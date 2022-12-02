// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#host-page-communication
import { initWindowState } from "../lib/util";
import { ResurfaceCodeMirrorInput } from "../lib/inputs";

initWindowState(window);
let codeMirrors;

const logPrefix = "[DOM]";
const debug = (...args) =>
  _postMsgToProxy({ type: "debugLog", args: [logPrefix, ...args] });
const error = (...args) =>
  _postMsgToProxy({ type: "errorLog", args: [logPrefix, ...args] });

// Create editor buttons and listen for events
function init() {
  codeMirrors = new ResurfaceCodeMirrorInput(postMessageToProxy)
  if (!codeMirrors.hasInputs)
    return debug("No CodeMirrors found");
  listen();
}

// Remove buttons and stop listening
function destroy() {
  if(codeMirrors){
    codeMirrors.destroy();
  }
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
  const codeMirror = codeMirrors.getCodeInputById(mirrorId);
  if (!codeMirror) return error("Could not find CodeMirror with ID:", mirrorId);

  switch (type) {
    case "portConnected":
      codeMirrors.disableInput(mirrorId);
      break;
    case "portDisconnected":
      codeMirrors.enableInput(mirrorId);
      break;
    case "populateEditorRequest":
      postMessageToProxy({
        type: "populateEditorResponse",
        value: codeMirrors.getValue(mirrorId),
        recipient: "editor",
      });
      break;
    case "editorChanged":
      const { changes } = event.data;
      codeMirrors.editorChanged(mirrorId, changes)
      break;
    default:
      error("Received unknown message type:", event.data);
  }
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
