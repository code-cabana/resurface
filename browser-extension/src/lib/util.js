// Returns true if given string includes any string within given array
export function includesAny(str, array) {
  if (!str || !array) return false;
  return array.some((item) => str.includes(item));
}

export const isEmptyStr = (str) =>
  !str || (typeof str === "string" && str.trim().length === 0);

export function debounce(func, wait = 100) {
  if (!func) return;
  let timer = false;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, wait, ...args);
  };
}

// Window state
export function initWindowState(wObj) {
  if (!wObj.__RESURFACE__) wObj.__RESURFACE__ = {};
  if (!wObj.__RESURFACE__.listeners) wObj.__RESURFACE__.listeners = [];
  if (!wObj.__RESURFACE__.port) wObj.__RESURFACE__.port = null;
}

// Chrome
export function goToOptionsPage() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
}

export function goToPage(path) {
  if (!path) return;
  window.open(chrome.runtime.getURL(path));
}

export function getPath(path) {
  if (!path) return;
  return chrome.runtime.getURL(path);
}
