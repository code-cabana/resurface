import { excludedUrls } from "./config";
import { onStorageToggleChange, isStorageToggleEnabled } from "./lib/chrome";
import { isEmptyStr, includesAny } from "./lib/util";
import { warn as _warn, debug as _debug } from "./lib/log";

const logPrefix = "[SW]";
const debug = (...args) => _debug(logPrefix, ...args);
const warn = (...args) => _warn(logPrefix, ...args);
const enabled = isStorageToggleEnabled("cc-resurface-enabled");

/*
  Attach main.js content script in DOM level "MAIN" world
  (can only communicate to extension via proxy.js)
  Runs every time the tab url changes,
  because DOM needs to be manipulated on each page
*/
function onTabUpdate(_tabId, changeInfo, tab) {
  if (isEmptyStr(tab?.url) || includesAny(tab?.url, excludedUrls)) return;
  if (changeInfo.status === "complete") {
    chrome.scripting.executeScript({
      files: ["content-scripts/main.js"],
      target: { tabId: tab.id },
      world: "MAIN",
    });
  }
}
enabled && chrome.tabs.onUpdated.addListener(onTabUpdate);

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
enabled && chrome.runtime.onMessage.addListener(onMessage);

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

      // Give the newly created editor tab/window IDs
      chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
        if (tabId !== newTab.id || changeInfo.status !== "complete") return;
        chrome.tabs.sendMessage(newTab.id, {
          type: "createdInfo",
          openedTabId: newTab.id,
          openedWindowId: newWindow.id,
          openerTabId: sender.tab.id,
          openerWindowId: sender.tab.windowId,
          mirrorId: message.mirrorId,
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

// Add/remove listeners if "enabled" storage option is changed
chrome.storage.onChanged.addListener(
  onStorageToggleChange({
    key: "cc-resurface-enabled",
    onEnabled: () => {
      chrome.tabs.onUpdated.addListener(onTabUpdate);
      chrome.runtime.onMessage.addListener(onMessage);
    },
    onDisabled: () => {
      chrome.tabs.onUpdated.removeListener(onTabUpdate);
      chrome.runtime.onMessage.removeListener(onMessage);
    },
  })
);

// Set default storage options on install
const defaultStorageOptions = {
  "cc-resurface-enabled": true,
  "cc-resurface-logging": false,
  "cc-resurface-minimap": true,
  "cc-resurface-theme": "vs",
  "cc-resurface-remember-editor-size": true,
  "cc-resurface-editor-size": { width: 400, height: 800 },
  "cc-resurface-editor-position": {},
};
function setDefaultStorageOptions() {
  chrome.storage.sync.set(defaultStorageOptions);
}
chrome.runtime.onInstalled.addListener(setDefaultStorageOptions);

// Login context menu options (shown when right clicking extension icon)
chrome.contextMenus.removeAll(function () {
  chrome.contextMenus.create({
    id: "1",
    title: "Login",
    contexts: ["action"],
  });
});

chrome.contextMenus.onClicked.addListener((data) => {
  const { menuItemId } = data;
  if (menuItemId === "1")
    chrome.tabs.create({ url: chrome.runtime.getURL("assets/login.html") });
});
