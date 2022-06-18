import {
  debug as _debug,
  error as _error,
  warn as _warn,
} from "../lib/console";
import cssFormatMonaco from "css-format-monaco";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import { useEffect, useRef, useState } from "preact/hooks";
import { useStoredValue, useResizeEnd, useInterval } from "../lib/hooks";
import Watermark from "../lib/components/watermark";
import { watermarkGracePeriod } from "../config";
import renderWithProviders from "../lib/render";
import { goToOptionsPage } from "../lib/util";
import { sentryError, sentryInit } from "../lib/sentry";
import detectLang from "lang-detector";
import { Button } from "shared/ui";
import { useAuth } from "shared/hooks";
import { cssJoin } from "shared/util";
import "shared/styles";
import "../lib/styles/global.css";
import styles from "./styles.module.css";

sentryInit();
const logPrefix = "[EDITOR]";
const debug = (...args) => _debug(logPrefix, ...args);
const warn = (...args) => _warn(logPrefix, ...args);
const error = (...args) => {
  sentryError(new Error(...args));
  _error(logPrefix, ...args);
};

function Editor() {
  const { customer, refresh } = useAuth();
  const { paidSession } = customer || {};

  const editorRef = useRef(null);
  const [_port, _setPort] = useState();
  const [_editor, _setEditor] = useState();
  const [_mirrorId, _setMirrorId] = useState();
  const [language, setLanguage] = useState();
  const [theme] = useStoredValue("cc-resurface-theme", "vs-dark");
  const [minimap] = useStoredValue("cc-resurface-minimap", true);
  const [rememberEditorSize] = useStoredValue(
    "cc-resurface-remember-editor-size",
    true
  );
  const [_, setEditorSize] = useStoredValue("cc-resurface-editor-size");
  const [inGracePeriod, setInGracePeriod] = useState(true);

  const port = useRef(_port);
  const setPort = (newPort) => {
    port.current = newPort;
    _setPort(newPort);
  };

  const editor = useRef(_editor);
  const setEditor = (newEditor) => {
    editor.current = newEditor;
    _setEditor(newEditor);
  };

  const mirrorId = useRef(_mirrorId);
  const setMirrorId = (newMirrorId) => {
    mirrorId.current = newMirrorId;
    _setMirrorId(newMirrorId);
  };

  useEffect(() => refresh(), []);
  useInterval(() => refresh(), 5000);
  useEffect(handleGlobalMessages({ setPort, setMirrorId }), []);
  useEffect(handleProxyMessages({ port, editor, mirrorId, setLanguage }), [
    editor.current,
    port.current,
  ]);
  useEffect(spawnEditor({ port, editorRef, setEditor }), [
    editorRef,
    port.current,
  ]);
  useEffect(setEditorLanguage({ language, editor }), [
    language,
    editor.current,
  ]);
  useEffect(() => setEditorTheme(theme), [theme]);
  useEffect(() => setEditorMinimap({ editor, enabled: minimap }), [minimap]);

  // Save editor size on mount
  useEffect(() => {
    if (!rememberEditorSize || !window) return;
    setEditorSize({ width: window.innerWidth, height: window.innerHeight });
  }, [rememberEditorSize]);

  // Save editor size on window resize end
  useResizeEnd(
    (_, width, height) => {
      if (!rememberEditorSize) return;
      setEditorSize({ width, height });
    },
    100,
    [rememberEditorSize]
  );

  // Prevent right click menu
  useEffect(() => {
    if (!window) return;
    const onContextMenu = (event) => event.preventDefault();
    window.addEventListener("contextmenu", onContextMenu);
    return () => {
      window.removeEventListener("contextmenu", onContextMenu);
    };
  }, []);

  // Show the watermark after grace period ends
  useEffect(() => {
    const endGracePeriod = () => setInGracePeriod(false);
    const timeout = setTimeout(endGracePeriod, watermarkGracePeriod * 1000);
    return () => clearTimeout(timeout);
  }, []);

  const languageOptions = monaco.languages.getLanguages();
  const commonLanguageOptions = [
    { id: "html", aliases: ["HTML"] },
    { id: "css", aliases: ["CSS"] },
    { id: "javascript", aliases: ["JavaScript"] },
    { id: "json", aliases: ["JSON"] },
    { id: "liquid", aliases: ["Liquid"] },
  ];

  function renderLanguageOption(language) {
    return (
      <option key={language.id} value={language.id}>
        {(language.aliases && language.aliases[0]) || language.id}
      </option>
    );
  }

  const showWatermark = paidSession === false && !inGracePeriod;

  return (
    <>
      <div className={cssJoin(styles.header, styles[`theme-${theme}`])}>
        <span>Language</span>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className={styles.select}
        >
          {commonLanguageOptions.map(renderLanguageOption)}
          <option disabled>
            &#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;
          </option>
          {languageOptions.map(renderLanguageOption)}
        </select>
        <span className={styles.spacer}>&middot;</span>
        <Button onClick={goToOptionsPage} className={styles.button}>
          Options
        </Button>
        <Button onClick={formatEditor(editor)} className={styles.button}>
          Format
        </Button>
      </div>
      <div ref={editorRef} className={styles.editor} />
      <Watermark enabled={showWatermark} />
    </>
  );
}

function formatEditor(editor) {
  return () => {
    if (!editor.current) return;
    debug("Formatting editor content");
    editor.current.getAction("editor.action.formatDocument").run();
  };
}

// Turn the minimap on/off
function setEditorMinimap({ editor, enabled }) {
  if (!editor.current || (!enabled && enabled !== false)) return;
  editor.current.updateOptions({ minimap: { enabled } });
}

// Change the editor's theme
function setEditorTheme(theme) {
  if (!theme) return;
  monaco.editor.setTheme(theme);
}

// Change the editor's code language
function setEditorLanguage({ editor, language }) {
  return () => {
    if (!editor.current || !language) return;
    debug("Setting editor language to", language);
    monaco.editor.setModelLanguage(editor.current.getModel(), language);
  };
}

function handleGlobalMessages({ setPort, setMirrorId }) {
  return () => {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      handleGlobalMessage({ message: request, setPort, setMirrorId }).then(
        (response) => {
          if (!response) return;
          debug("Responding:", response);
          sendResponse(response);
        }
      );
      return true;
    });
  };
}

async function handleGlobalMessage({ message, setPort, setMirrorId }) {
  debug("Received message:", message);
  switch (message.type) {
    case "createdInfo": // Open long-lived connection to proxy content script
      const { openedTabId, openerTabId, mirrorId } = message;

      // Tell proxy to open a long-lived connection to this editor
      chrome.tabs.sendMessage(
        openerTabId,
        {
          type: "connect",
          editorId: openedTabId,
          recipientId: openerTabId,
          mirrorId,
        },
        ({ success }) => {
          if (!success) error("Could not connect to opener tab's CodeMirror");
        }
      );
      // Await connection from proxy
      chrome.runtime.onConnect.addListener((port) => {
        if (port.name !== `${openedTabId}-${openerTabId}-${mirrorId}`) return;
        debug("Successfully connected to proxy");
        setPort(port);
        setMirrorId(mirrorId);
      });
      return { success: true };
    default:
      warn("Unknown message type:", message.type);
      return null;
  }
}

// Handle incoming messages from proxy content script
function handleProxyMessages({ port, editor, mirrorId, setLanguage }) {
  return () => {
    if (!port.current || !editor.current) return;

    port.current.onMessage.addListener((message) => {
      debug("Received message from proxy:", message);

      switch (message.type) {
        case "populateEditorResponse":
          const detectedLanguage = detectLang(message.value);
          setLanguage(detectedLanguage.toLowerCase());
          editor.current.getModel().setValue(message.value);

          editor.current.getModel().onDidChangeContent((event) => {
            debug("Editor changed event:", event);
            const { changes } = event;
            port.current.postMessage({
              type: "editorChanged",
              changes,
              mirrorId: mirrorId.current,
            });
          });
          break;
        case "closeEditor":
          window.close();
          break;
        default:
          error("Unknown message type from proxy:", message);
      }
    });

    port.current.postMessage({
      type: "populateEditorRequest",
      mirrorId: mirrorId.current,
    });

    return () => {
      port.current.disconnect();
    };
  };
}

// Create a new Monaco editor
function spawnEditor({ editorRef, port, setEditor }) {
  return () => {
    if (!editorRef.current || !port.current) return;
    const newEditor = monaco.editor.create(editorRef.current, {
      value: "waiting for CodeMirror data...",
    });

    const disposeCssPlugin = cssFormatMonaco(monaco, { indent_size: 2 }); // Editor cannot format CSS without this plugin

    function layoutEditor() {
      const { offsetWidth, offsetHeight } = editorRef.current;
      newEditor.layout({ width: offsetWidth, height: offsetHeight });
    }

    window.addEventListener("resize", layoutEditor);
    setEditor(newEditor);

    return () => {
      window.removeEventListener("resize", layoutEditor);
      disposeCssPlugin();
      newEditor.dispose();
      setEditor(null);
    };
  };
}

self.MonacoEnvironment = {
  getWorkerUrl: function (_, label) {
    if (label === "json") {
      return "../vs/language/json/json.worker.js";
    }
    if (label === "css" || label === "scss" || label === "less") {
      return "../vs/language/css/css.worker.js";
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return "../vs/language/html/html.worker.js";
    }
    if (label === "typescript" || label === "javascript") {
      return "../vs/language/typescript/ts.worker.js";
    }
    return "../vs/editor/editor.worker.js";
  },
};

renderWithProviders(Editor, "editor");
