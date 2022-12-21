import {
  debug as _debug,
  warn as _warn,
  error as _error,
} from "../lib/console";
import { sentryInit, sentryError } from "../lib/sentry";
import { initWindowState, cleanWindowState, isInitialized } from "../lib/util";
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#host-page-communication

const scriptName = "proxy.js";
const logPrefix = "[Proxy]";
const debug = (...args) => _debug(logPrefix, ...args);
const warn = (...args) => _warn(logPrefix, ...args);
const error = (...args) => {
  sentryError(new Error(...args));
  _error(logPrefix, ...args);
};

// Listen and wait for main.js (DOM world) to be ready
function init() {
  window.addEventListener("message", onDomMessage, false);
}

// Occurs when main.js has notified proxy.js it is ready
// Scaffold state, initialize Sentry, and listen for chrome events
function onDOMReady() {
  if (isInitialized(scriptName)) return;
  initWindowState(window, scriptName);
  sentryInit();

  chrome.runtime.onMessage.addListener(onChromeMessage);
  debug("proxy.js initialized");
}

// Remove state, listeners and notify DOM to destroy as well
function destroy() {
  window.removeEventListener("message", onDomMessage, false);
  chrome.runtime.onMessage.removeListener(onChromeMessage);
  closeAllEditors();
  postMessageToDom({ type: "destroy" });
  cleanWindowState(window);
}

// Facilitate sending messages from DOM -> Editor
function onDomMessage(event) {
  if (event.source != window) return;
  const { sender, recipient, type, targetId } = event?.data || {};
  if (sender !== "CC_RESURFACE_DOM") return;
  switch (recipient) {
    case "proxy":
      switch (type) {
        case "DOMReady":
          onDOMReady();
          break;
      }
      break;
    case "editor":
      switch (type) {
        case "closeEditor":
          closeEditor(targetId);
          break;
        default:
          sendMessageToPort(event.data, targetId);
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

// Returns the port associated with the given targetId
function getPort(targetId) {
  return (window.__RESURFACE__?.ports || []).find(
    ({ targetId: id }) => id === targetId
  );
}

// Delete any saved ports associated with the given targetId
function deletePort(targetId) {
  window.__RESURFACE__.ports = (window.__RESURFACE__?.ports || []).filter(
    ({ targetId: id }) => id !== targetId
  );
}

// Send a message to the given targetId's communication port
function sendMessageToPort(message, targetId) {
  const foundPort = getPort(targetId);
  if (!foundPort) return error(`No editor found with targetId ${targetId}`);
  const { port } = foundPort;
  port.postMessage(message);
}

// Close any opened editors and disconnect associated ports
function closeAllEditors() {
  (window.__RESURFACE__?.ports || []).forEach(({ port, targetId }) => {
    port.postMessage({ type: "closeEditor", recipient: "editor", targetId });
    port.disconnect();
  });
}

// Close a specific editor by targetId
function closeEditor(targetId) {
  const foundPort = getPort(targetId);
  if (!foundPort) return debug(`No editor found with targetId ${targetId}`);
  const { port } = foundPort;
  port.postMessage({ type: "closeEditor", recipient: "editor", targetId });
  port.disconnect();
  deletePort(targetId);
}

// Facilitate sending messages from Editor -> DOM
function onChromeMessage(request, _sender, sendResponse) {
  getResponse(request).then((response) => {
    if (!response) return;
    debug("Responding:", response);
    sendResponse(response);
  });
  return true;
}

async function getResponse(message) {
  debug("Received message:", message);
  const { tabId } = await chrome.runtime.sendMessage({ type: "getTabId" });
  const { recipientId, type } = message;
  if (recipientId !== tabId) return { success: false };
  switch (type) {
    case "connect":
      const { editorId, targetId, windowId } = message;
      const port = chrome.runtime.connect({
        name: `${editorId}-${recipientId}-${targetId}`,
      });

      port.onMessage.addListener((message) => {
        debug("Got message", message);
        postMessageToDom(message);
      });

      port.onDisconnect.addListener(() => {
        debug(`Port for target ${targetId} disconnected`);
        deletePort(targetId);
        postMessageToDom({ type: "portDisconnected", targetId });
      });

      if (!window.__RESURFACE__.ports) window.__RESURFACE__.ports = [];
      window.__RESURFACE__.ports.push({ targetId, windowId, port });

      postMessageToDom({ type: "portConnected", targetId, editorId, windowId });
      return { success: true };
    case "editorClosed":
      postMessageToDom(message);
      return { success: true };
    case "destroy":
      destroy();
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

init();
