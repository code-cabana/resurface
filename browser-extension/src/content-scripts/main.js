// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#host-page-communication
import { initWindowState, cleanWindowState, isInitialized } from "../lib/util";
import { getResurfaceTargets } from "../lib/targets";
import toast from "../lib/toast";

const scriptName = "main.js";
const logPrefix = "[DOM]";
const debug = (...args) =>
  _postMsgToProxy({ type: "debugLog", args: [logPrefix, ...args] });
const error = (...args) =>
  _postMsgToProxy({ type: "errorLog", args: [logPrefix, ...args] });

// Scaffold state, create editor buttons and listen for events
async function init() {
  if (isInitialized(scriptName)) return;
  initWindowState(window, scriptName);
  const hasTargets = await initTargets();
  if (hasTargets) onHasTargets();
  else onNoTargets();
}

function onHasTargets() {
  listen();
  debug("main.js initialized");
  postMessageToProxy({ type: "DOMReady", recipient: "proxy" });
}

function onNoTargets() {
  toast.show("No targets found", 3000);
  destroy();
}

// Remove buttons and stop listening
function destroy() {
  destroyTargets();
  unlisten();
  cleanWindowState(window);
}

// Get and record all resurface targets on the page
async function initTargets() {
  window.__RESURFACE__.targets = await getResurfaceTargets(document);
  window.__RESURFACE__.targets.forEach((target, idx) => target.initialize(idx));
  const hasTargets = window.__RESURFACE__.targets.length > 0;
  return hasTargets;
}

// Remove all records of resurface targets
function destroyTargets() {
  (window.__RESURFACE__.targets || []).forEach((target) => target.destroy());
  window.__RESURFACE__.targets = [];
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
  if (type === "destroy") return destroy();
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
        targetId,
      });
      break;
    case "editorChanged":
      const { changes } = event.data;
      resurfaceTarget.processChanges(changes);
      break;
    case "editorClosed":
      resurfaceTarget.setActive(false);
      break;
    default:
      error("Received unknown message type:", event.data);
  }
}

init();
