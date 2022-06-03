// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#host-page-communication
import { initWindowState } from "../lib/util";

initWindowState(window);
let buttons = [];
let codeMirrors = [];
const buttonBg = "#133d65";
const buttonText = "white";

const logPrefix = "[DOM]";
const debug = (...args) =>
  _postMsgToProxy({ type: "debugLog", args: [logPrefix, ...args] });
const error = (...args) =>
  _postMsgToProxy({ type: "errorLog", args: [logPrefix, ...args] });

// Create editor buttons and listen for events
function init() {
  codeMirrors = getAllCodeMirrors();
  if (!codeMirrors || codeMirrors.length === 0)
    return debug("No CodeMirrors found");
  buttons = attachButtons(codeMirrors);
  listen();
}

// Remove buttons and stop listening
function destroy() {
  const orphanedButtons = getAllButtons();
  const allButtons = (
    orphanedButtons ? [...buttons, ...orphanedButtons] : buttons
  ).filter(Boolean);
  allButtons.forEach((button) => {
    const mirrorId = button.dataset.resurfaceMirrorId;
    postMessageToProxy({ type: "closeEditor", mirrorId, recipient: "editor" });
    button.remove();
  });
  buttons = [];
  codeMirrors = [];
  unlisten();
}

// Destroy buttons + event listeners and then re-initialize
function reinit() {
  destroy();
  init();
}

// Reinitializes if at least one code mirror exists
function tryReinit() {
  if (!hasCodeMirrors()) return false;
  reinit();
  return true;
}

// Returns true if any code mirrors are found on the page
function hasCodeMirrors() {
  debug("Checking for CodeMirrors...");
  const result = !!document.querySelector(".CodeMirror");
  debug("CodeMirrors found:", result);
  return result;
}

// Get all CodeMirror instances on this page
function getAllCodeMirrors() {
  const foundMirrors = Array.from(document.querySelectorAll(".CodeMirror"));
  return foundMirrors.length > 0 && foundMirrors.filter(Boolean);
}

// Get all "open resurface editor" buttons on this page
function getAllButtons() {
  const foundButtons = Array.from(
    document.querySelectorAll(".resurface-editor-button")
  );
  return foundButtons.length > 0 && foundButtons.filter(Boolean);
}

// Return current value of given CodeMirror
function getValue(codeMirror) {
  return codeMirror.CodeMirror.doc.getValue();
}

// Send message to proxy content script on the same page
function postMessageToProxy(message) {
  debug("Sending message to proxy", message);
  _postMsgToProxy(message);
}

function _postMsgToProxy(message) {
  window.postMessage(
    Object.assign({}, message, { sender: "CC_RESURFACE_DOM" }),
    "*"
  );
}

// Create button elements above each CodeMirror
function attachButtons(codeMirrors) {
  return codeMirrors.map((mirror, index) => {
    const button = document.createElement("button");
    button.classList.add("resurface-editor-button");
    button.classList.add("resurface-stripe");
    button.innerText = "Open Resurface editor";
    button.style = `
        position: absolute;
        top: 0; left: 0;
        cursor: pointer;
        padding: 12px;
        border: none;
        border-radius: 4px;
        background-color: ${buttonBg};
        color: ${buttonText};
        z-index: 5;
        `; // z-index 5 is required for Squarespace (might need to change per platform)
    button.addEventListener(
      "click",
      () =>
        postMessageToProxy({
          type: "openEditor",
          recipient: "service-worker",
          mirrorId: index,
        }),
      false
    );

    // Attach mirrorIds
    button.dataset.resurfaceMirrorId = index;
    mirror.dataset.resurfaceMirrorId = index;
    mirror.appendChild(button); // Attach button to CodeMirror
    enableMirror(index); // Enable the mirror for editing in case it was disabled earlier
    return button;
  });
}

/*
    Converts Monaco changes
    https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IModelContentChange.html#text
    
    to CodeMirror replaceRange from/to args
    https://codemirror.net/doc/manual.html#api
*/
function translateMonacoChanges(monacoChanges) {
  return monacoChanges.map((change) => {
    const { range, text: replacement } = change;
    const { startColumn, startLineNumber, endColumn, endLineNumber } = range;
    const from = { line: startLineNumber - 1, ch: startColumn - 1 };
    const to = { line: endLineNumber - 1, ch: endColumn - 1 };
    return { replacement, from, to };
  });
}

// Listen for events from proxy content script running on the same page
function listen() {
  window.addEventListener("message", handleMessage, false);
  window.__RESURFACE__.listeners.push(handleMessage);
}

// Stop listening to events from proxy content script
function unlisten() {
  window.removeEventListener("message", handleMessage, false);
  const orphanedListeners = window.__RESURFACE__.listeners;
  orphanedListeners.forEach((listener) =>
    window.removeEventListener("message", listener, false)
  );
  window.__RESURFACE__.listeners = [];
}

function handleMessage(event) {
  if (event.source != window) return;
  if (event.data?.sender !== "CC_RESURFACE_PROXY") return;
  debug("Got message:", event.data);
  const { mirrorId: mirrorId, type } = event.data;
  if (type === "disabled") return destroy();
  if (!mirrorId && mirrorId !== 0) return error("Invalid mirrorId:", mirrorId);
  const codeMirror = getCodeMirrorById(mirrorId);
  if (!codeMirror) return error("Could not find CodeMirror with ID:", mirrorId);

  switch (type) {
    case "portConnected":
      disableMirror(mirrorId);
      break;
    case "portDisconnected":
      enableMirror(mirrorId);
      break;
    case "populateEditorRequest":
      postMessageToProxy({
        type: "populateEditorResponse",
        value: getValue(codeMirror),
        recipient: "editor",
      });
      break;
    case "editorChanged":
      const { changes } = event.data;
      const translated = translateMonacoChanges(changes);
      translated.forEach((change) => {
        const { replacement, from, to } = change;
        codeMirror.CodeMirror.doc.replaceRange(replacement, from, to);
      });
      break;
    default:
      error("Received unknown message type:", event.data);
  }
}

// Prevents a code mirror from being edited
function preventKeyboardEntry(_cm, event) {
  event.preventDefault();
}

// Returns codeMirror DOM element by ID index
function getCodeMirrorById(mirrorId) {
  return codeMirrors.find(
    (mirror) => mirror.dataset.resurfaceMirrorId === mirrorId.toString()
  );
}

// Enables a given code mirror for editing
function enableMirror(mirrorId) {
  const codeMirror = getCodeMirrorById(mirrorId);
  if (!codeMirror) return;
  codeMirror.style.opacity = 1;
  codeMirror.CodeMirror.off("keydown", preventKeyboardEntry);
  toggleButton(mirrorId, true);
}

// Disables a given code mirror so that it cannot be edited
function disableMirror(mirrorId) {
  const codeMirror = getCodeMirrorById(mirrorId);
  if (!codeMirror) return;
  codeMirror.style.opacity = 0.5;
  codeMirror.CodeMirror.on("keydown", preventKeyboardEntry);
  toggleButton(mirrorId, false);
}

// Enables/disables the open editor button
function toggleButton(mirrorId, enabled) {
  const button = buttons.find(
    (button) => button.dataset.resurfaceMirrorId === mirrorId.toString()
  );
  if (!button) return;
  button.disabled = !enabled;
  button.innerText = enabled
    ? "Open Resurface editor"
    : "(editing via Resurface)";
  button.style.backgroundColor = enabled ? buttonBg : "transparent";
  button.style.cursor = enabled ? "pointer" : "default";
  button.style.color = enabled ? buttonText : "black";
}

// Poll page 10 times until CodeMirror is found
function poll() {
  const firstTryWorked = tryReinit();
  if (firstTryWorked) return;
  const maxAttempts = 10;
  let counter = 0;
  const checkUntilFound = setInterval(() => {
    counter += 1;
    const success = tryReinit();
    if (success || counter > maxAttempts) clearInterval(checkUntilFound);
  }, 1000);
}

poll();
