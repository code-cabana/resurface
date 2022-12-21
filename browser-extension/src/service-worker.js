import { excludedUrls } from "./config";
import { isEmptyStr, includesAny } from "./lib/util";
import { warn as _warn, debug as _debug } from "./lib/console";

const logPrefix = "[SW]";
const debug = (...args) => _debug(logPrefix, ...args);
const warn = (...args) => _warn(logPrefix, ...args);

/*
  Attach main.js content script in DOM level "MAIN" world
  (can only communicate to extension via proxy.js)
  Runs every time the tab url changes,
  because DOM needs to be manipulated on each page
*/
async function onActionClick(tab) {
  if (isEmptyStr(tab?.url) || includesAny(tab?.url, excludedUrls)) return;

  let isInjected = await isAlreadyInjected(tab.id);

  if (isInjected) {
    chrome.tabs.sendMessage(tab.id, { type: "destroy", recipientId: tab.id });
  } else {
    chrome.scripting.executeScript({
      files: ["content-scripts/main.js"],
      target: { tabId: tab.id },
      world: "MAIN",
    });

    chrome.scripting.executeScript({
      files: ["content-scripts/proxy.js"],
      target: { tabId: tab.id },
    });
  }
}
chrome.action.onClicked.addListener(onActionClick);

/*
  Returns true if the given tabId already has content scripts attached
  (i.e. the action icon has already been clicked)
*/
function isAlreadyInjected(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      { target: { tabId }, func: () => window.__RESURFACE__ },
      (results) => {
        resolve(results[0].result);
      }
    );
  });
}

// Listen to global one-shot messages
// https://developer.chrome.com/docs/extensions/mv3/messaging/#simple
function onMessage(request, sender, sendResponse) {
  listen(request, sender).then((response) => {
    if (!response) return;
    debug("Responding:", response);
    sendResponse(response);
  });
  return true;
}
chrome.runtime.onMessage.addListener(onMessage);

async function listen(message, sender) {
  debug("Received message:", message);
  if (!sender.tab) return { success: false }; // Only listen to messages from tabs
  switch (message.type) {
    case "openEditor":
      const result = await chrome.storage.sync.get([
        "cc-resurface-editor-size",
        "cc-resurface-editor-position",
      ]);
      const { width = 400, height = 800 } =
        result["cc-resurface-editor-size"] || {};
      const pos = result["cc-resurface-editor-position"] || {};
      const left = !isEmptyStr(pos.left) ? Number(pos.left) : undefined;
      const top = !isEmptyStr(pos.top) ? Number(pos.top) : undefined;

      const newWindow = await chrome.windows.create({
        type: "popup",
        left,
        top,
        width,
        height,
      });

      const newTab = await chrome.tabs.create({
        url: "assets/editor.html",
        windowId: newWindow.id,
      });

      chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
        if (tabId !== newTab.id || changeInfo.status !== "complete") return;

        // Notify the newly created editor about its own and parent props
        chrome.tabs.sendMessage(newTab.id, {
          type: "createdInfo",
          recipient: "editor",
          openedTabId: newTab.id,
          openedWindowId: newWindow.id,
          openerTabId: sender.tab.id,
          openerWindowId: sender.tab.windowId,
          targetId: message.targetId,
        });

        // Handle editor closing
        chrome.windows.onRemoved.addListener((windowId) => {
          if (windowId !== newWindow.id) return;
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "editorClosed",
            recipientId: sender.tab.id,
            windowId: newWindow.id,
            targetId: message.targetId,
          });
        });
      });

      return { success: true };
    case "getTabId":
      return { success: true, tabId: sender.tab.id };
    default:
      warn("Unknown message type:", request.type);
      return null;
  }
}

// Set default storage options on install
const defaultStorageOptions = {
  "cc-resurface-logging": false,
  "cc-resurface-minimap": true,
  "cc-resurface-theme": "vs",
  "cc-resurface-remember-editor-size": true,
  "cc-resurface-editor-size": { width: 450, height: 800 },
  "cc-resurface-editor-position": {},
};
function setDefaultStorageOptions() {
  chrome.storage.sync.set(defaultStorageOptions);
}
chrome.runtime.onInstalled.addListener(setDefaultStorageOptions);

// Login context menu options (shown when right clicking extension icon)
chrome.contextMenus.removeAll(function () {
  chrome.contextMenus.create({
    id: "login",
    title: "Login",
    contexts: ["action"],
  });
  chrome.contextMenus.create({
    id: "help",
    title: "Help",
    contexts: ["action"],
  });
});

chrome.contextMenus.onClicked.addListener((data) => {
  const { menuItemId } = data;
  if (menuItemId === "login")
    chrome.tabs.create({ url: chrome.runtime.getURL("assets/login.html") });
  if (menuItemId === "help")
    chrome.tabs.create({ url: chrome.runtime.getURL("assets/help.html") });
});
