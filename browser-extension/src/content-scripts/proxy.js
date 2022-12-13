import {
  debug as _debug,
  warn as _warn,
  error as _error,
} from "../lib/console";
import { sentryInit, sentryError } from "../lib/sentry";
import { initWindowState } from "../lib/util";
import { onStorageToggleChange } from "../lib/chrome";
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#host-page-communication

initWindowState(window);
sentryInit();
const logPrefix = "[Proxy]";
const debug = (...args) => _debug(logPrefix, ...args);
const warn = (...args) => _warn(logPrefix, ...args);
const error = (...args) => {
  sentryError(new Error(...args));
  _error(logPrefix, ...args);
};

// Facilitate sending messages from DOM -> Editor
function onDomMessage(event) {
  if (event.source != window) return;
  if (event.data?.sender !== "CC_RESURFACE_DOM") return;
  switch (event.data.recipient) {
    case "editor":
      switch (event.data.type) {
        case "closeEditor":
          if (!window.__RESURFACE__.port)
            return debug("No editor found to close");
          window.__RESURFACE__.port.postMessage(event.data);
          window.__RESURFACE__.port.disconnect();
          window.__RESURFACE__.port = null;
          break;
        default:
          if (!window.__RESURFACE__.port)
            return error("Invalid window.__RESURFACE__.port");
          window.__RESURFACE__.port.postMessage(event.data);
          break;
      }
      break;
    case "service-worker":
      chrome.runtime.sendMessage(event.data);
      break;
    default:
      switch (event.data.type) {
        case "debugLog":
          _debug(...event.data.args);
          break;
        case "errorLog":
          sentryError(new Error(...event.data.args));
          _error(...event.data.args);
          break;
        default:
          error("Unknown recipient:", event.data.recipient);
      }
  }
}
window.addEventListener("message", onDomMessage, false);

// Facilitate sending messages from Editor -> DOM
function onChromeMessage(request, _sender, sendResponse) {
  listen(request).then((response) => {
    if (!response) return;
    debug("Responding:", response);
    sendResponse(response);
  });
  return true;
}
chrome.runtime.onMessage.addListener(onChromeMessage);

async function listen(message) {
  debug("Received message:", message);
  const { tabId } = await chrome.runtime.sendMessage({ type: "getTabId" });
  const { editorId, recipientId, type, targetId } = message;
  if (recipientId !== tabId) return { success: false };
  switch (type) {
    case "connect":
      window.__RESURFACE__.port = chrome.runtime.connect({
        name: `${editorId}-${recipientId}-${targetId}`,
      });

      window.__RESURFACE__.port.onMessage.addListener((message) => {
        debug("Got message", message);
        postMessageToDom(message);
      });

      window.__RESURFACE__.port.onDisconnect.addListener(() => {
        debug(`Port for target ${targetId} disconnected`);
        postMessageToDom({ type: "portDisconnected", targetId });
      });

      postMessageToDom({ type: "portConnected", targetId });
      return { success: true };
    default:
      warn("Unknown message type:", type);
      return null;
  }
}

function postMessageToDom(message) {
  debug("Sending message to DOM", message);
  window.postMessage({ ...message, sender: "CC_RESURFACE_PROXY" }, "*");
}

// Add/remove listeners if "enabled" storage option is changed
chrome.storage.onChanged.addListener(
  onStorageToggleChange({
    key: "cc-resurface-enabled",
    onEnabled: () => {
      chrome.runtime.onMessage.addListener(onChromeMessage);
      window.addEventListener("message", onDomMessage, false);
    },
    onDisabled: () => {
      chrome.runtime.onMessage.removeListener(onChromeMessage);
      window.removeEventListener("message", onDomMessage, false);
      postMessageToDom({ type: "disabled" });
    },
  })
);
