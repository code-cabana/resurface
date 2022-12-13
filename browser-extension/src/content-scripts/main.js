// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#host-page-communication
import { initWindowState } from "../lib/util";
import { ResurfaceTargets } from "../lib/targets";

initWindowState(window);
let resurfaceTargets;

const logPrefix = "[DOM]";
const debug = (...args) =>
  _postMsgToProxy({ type: "debugLog", args: [logPrefix, ...args] });
const error = (...args) =>
  _postMsgToProxy({ type: "errorLog", args: [logPrefix, ...args] });

// Create editor buttons and listen for events
function init() {
  resurfaceTargets = new ResurfaceTargets(postMessageToProxy)
  if (!resurfaceTargets.hasInputs)
    return debug("No ResurfaceTargets found");
  listen();
}

// Remove buttons and stop listening
function destroy() {
  if(resurfaceTargets) resurfaceTargets.destroy();
  unlisten();
}

// Destroy buttons + event listeners and then re-initialize
function reinit() {
  destroy();
  init();
}

// Reinitializes if at least one target exists
function tryReinit() {
  if (!hasResurfaceTargets()) return false;
  reinit();
  return true;
}

// Returns true if any targets are found on the page
function hasResurfaceTargets() {
  debug("Checking for ResurfaceTargets...");
  const result = ResurfaceTargets.hasCodeElements();
  debug("ResurfaceTargets found:", result);
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
  const { targetId: targetId, type } = event.data;
  if (type === "disabled") return destroy();
  if (!targetId && targetId !== 0) return error("Invalid targetId:", targetId);
  const resurfaceTarget = resurfaceTargets.getResurfaceTargetById(targetId);
  if (!resurfaceTarget) return error("Could not find ResurfaceTarget with ID:", targetId);

  switch (type) {
    case "portConnected":
      resurfaceTargets.disableInput(targetId);
      break;
    case "portDisconnected":
      resurfaceTargets.enableInput(targetId);
      break;
    case "populateEditorRequest":
      postMessageToProxy({
        type: "populateEditorResponse",
        value: resurfaceTargets.getValue(targetId),
        recipient: "editor",
      });
      break;
    case "editorChanged":
      const { changes } = event.data;
      resurfaceTargets.editorChanged(targetId, changes)
      break;
    default:
      error("Received unknown message type:", event.data);
  }
}

// Poll page 10 times until ResurfaceTarget is found
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
