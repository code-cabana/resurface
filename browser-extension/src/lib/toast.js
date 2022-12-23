let toast;
const prefix = "[Resurface] ";

function createDom() {
  if (toast) return toast;
  toast = document.createElement("div");
  toast.classList.add("resurface-toast");
  document.body.appendChild(toast);
  return toast;
}

function createMessage(text) {
  createDom().textContent = `${prefix}${text}`;
}

function closeMessage() {
  if (!toast) return;
  document.body.removeChild(toast);
  toast = null;
}

function maybeDefer(fn, timeoutMs) {
  if (timeoutMs) setTimeout(fn, timeoutMs);
  else fn();
}

function show(text, timeout) {
  createMessage(text);
  if (timeout) hide(timeout);
}

function hide(timeoutMs) {
  maybeDefer(closeMessage, timeoutMs);
}

export default {
  show,
  hide,
};
