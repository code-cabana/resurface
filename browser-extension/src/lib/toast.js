let toast;
const prefix = "[Resurface] ";

function createCssStyleSheet() {
  const style = document.createElement("style");
  document.head.appendChild(style);
  return style.sheet;
}

function insertStyle(className, sheet, style) {
  Object.keys(style).forEach((key) => {
    const value = style[key];
    sheet.insertRule(`.${className} { ${key}: ${value} }`, 0);
  });
}

function createToastStyle() {
  const className = "toast";
  const style = {
    color: "white",
    position: "fixed",
    top: "1rem",
    right: "1rem",
    "background-color": "#133D65",
    "border-radius": "5px",
    padding: "1rem 2rem",
    "z-index": 1000,
  };

  const sheet = createCssStyleSheet();
  insertStyle(className, sheet, style);
  return className;
}

function createDom() {
  if (toast) {
    return toast;
  }

  const className = createToastStyle();

  toast = document.createElement("h3");
  toast.classList.add(className);
  document.body.appendChild(toast);
  return toast;
}

function createMessage(text) {
  createDom().textContent = `${prefix}${text}`;
}

function closeMessage() {
  if (toast) {
    document.body.removeChild(toast);
    toast = null;
  }
}

function maybeDefer(fn, timeoutMs) {
  if (timeoutMs) {
    setTimeout(fn, timeoutMs);
  } else {
    fn();
  }
}

function hide(timeoutMs) {
  maybeDefer(closeMessage, timeoutMs);
}

const toastApi = {
  show: function show(text, timeout) {
    createMessage(text);
    if (timeout) hide(timeout);
    return toastApi;
  },
  hide: hide,
};

export default toastApi;
