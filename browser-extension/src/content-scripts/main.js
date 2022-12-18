// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#host-page-communication
import { initWindowState } from "../lib/util";
import { getResurfaceTargets, hasResurfaceTargets } from "../lib/targets";

initWindowState(window);

const logPrefix = "[DOM]";
const debug = (...args) =>
  _postMsgToProxy({ type: "debugLog", args: [logPrefix, ...args] });
const error = (...args) =>
  _postMsgToProxy({ type: "errorLog", args: [logPrefix, ...args] });

// Create editor buttons and listen for events
async function init() {
  window.__RESURFACE__ = { targets: [], listeners: [] };
  initTargets();
  listen();
}

// Remove buttons and stop listening
function destroy() {
  destroyTargets();
  unlisten();
}

// Get and record all resurface targets on the page
async function initTargets() {
  window.__RESURFACE__.targets = await getResurfaceTargets(document);
  window.__RESURFACE__.targets.forEach((target, idx) => target.initialize(idx));
}

// Remove all records of resurface targets
function destroyTargets() {
  (window.__RESURFACE__?.targets || []).forEach((target) => target.destroy());
  window.__RESURFACE__.targets = [];
}

// Destroy buttons + event listeners and then re-initialize
function reinit() {
  destroy();
  init();
}

// Reinitializes if at least one target exists
async function tryReinit() {
  if (!hasResurfaceTargets(document)) return false;
  reinit();
  return true;
}

// Send message to proxy content script on the same page
function postMessageToProxy(message) {
  debug("Sending message to proxy", message);
  _postMsgToProxy(message);
}

function _postMsgToProxy(message) {
  window.postMessage({ ...message, sender: "CC_RESURFACE_DOM" }, "*");
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
  const { targetId, type } = event.data;
  if (type === "disabled") return destroy();
  if (!targetId && targetId !== 0) return error("Invalid targetId:", targetId);

  function getResurfaceTargetById(id) {
    return (window.__RESURFACE__?.targets || []).find(
      (target) => target.id === id
    );
  }

  const resurfaceTarget = getResurfaceTargetById(targetId);
  if (!resurfaceTarget)
    return error("Could not find ResurfaceTarget with ID:", targetId);

  switch (type) {
    case "portConnected":
      resurfaceTarget.setActive(true);
      break;
    case "portDisconnected":
      resurfaceTarget.setActive(false);
      break;
    case "populateEditorRequest":
      postMessageToProxy({
        type: "populateEditorResponse",
        value: resurfaceTarget.getValue(),
        recipient: "editor",
      });
      break;
    case "editorChanged":
      const { changes } = event.data;
      resurfaceTarget.processChanges(changes);
      break;
    default:
      error("Received unknown message type:", event.data);
  }
}

// Poll page 10 times until ResurfaceTarget is found
async function poll() {
  const firstTryWorked = await tryReinit();
  if (firstTryWorked) return;
  const maxAttempts = 10;
  let counter = 0;
  const checkUntilFound = setInterval(async () => {
    counter += 1;
    const success = await tryReinit();
    if (success || counter > maxAttempts) clearInterval(checkUntilFound);
  }, 1000);
}

poll();
