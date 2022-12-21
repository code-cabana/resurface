const buttonBg = "#133d65";
const buttonText = "white";

function initialize(index) {
  if (typeof index === "undefined")
    throw `No index provided when initializing element: ${this.element}`;
  this.id = index;
  this.element.dataset.resurfaceTargetId = index;
  this.attachButton();
}

function destroy() {
  this.setActive(false);
  this.removeButton();

  this.postMessageToProxy({
    type: "closeEditor",
    recipient: "editor",
    targetId: this.id,
  });

  this.id = null;
  delete this.element.dataset.resurfaceTargetId;
}

// Return the current value of the DOM element
function getValue() {
  return this.element.value;
}

// Ingest monaco changes from a Resurface editor and apply them to the DOM element
function processChanges(monacoChanges) {
  let newValue = this.getValue();
  let newLines = [];

  monacoChanges.forEach((change) => {
    const { range, text } = change;

    const { startColumn, startLineNumber, endColumn, endLineNumber } = range;

    const lines = newValue.split(/\r?\n/);

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      if (lineNum < startLineNumber || lineNum > endLineNumber)
        newLines.push(line);
      else {
        const isStartLine = lineNum === startLineNumber;
        const isEndLine = lineNum === endLineNumber;

        if (isStartLine) {
          const start = startColumn - 1;
          const newLine = line.slice(0, start) + text;
          newLines.push(newLine);
        }

        if (isEndLine) {
          const end = endColumn - 1;
          const newLine = line.slice(end);
          newLines[newLines.length - 1] += newLine;
        }
      }
    });
  });

  this.element.value = newLines.join("\n");
}

// Change this target's DOM element appearance to reflect whether it is
// currently receiving input from a Resurface editor
function setActive(isActive) {
  this.element.style.opacity = isActive ? 0.5 : 1;
  this.element.disabled = isActive;
  this.element.readonly = isActive;
  this.setButtonEnabled(!isActive);
}

// Add a button to the DOM that opens the Resurface editor
function attachButton() {
  const button = document.createElement("button");
  button.classList.add("resurface-editor-button");
  button.innerText = "Open Resurface editor";
  button.type = "button";
  button.style = `
          position: relative;
          cursor: pointer;
          padding: 12px;
          border: none;
          border-radius: 4px;
          background-color: ${buttonBg};
          color: ${buttonText};
          z-index: 5;
          `; // z-index 5 is required for Squarespace (might need to change per platform)
  button.addEventListener(
    "click",
    () => {
      this.postMessageToProxy({
        type: "openEditor",
        recipient: "service-worker",
        targetId: this.id,
      });
    },
    false
  );
  this.element.parentElement.appendChild(button);
  this.button = button;
}

// Remove this target's button from the DOM
function removeButton() {
  if (this.button) this.button.remove();
  this.button = null;
}

// Modify the button to indicate whether it's enabled or not
function setButtonEnabled(isEnabled) {
  this.button.disabled = !isEnabled;
  this.button.innerText = isEnabled
    ? "Open Resurface editor"
    : "(editing via Resurface)";
  this.button.style.backgroundColor = isEnabled ? buttonBg : "transparent";
  this.button.style.cursor = isEnabled ? "pointer" : "default";
  this.button.style.color = isEnabled ? buttonText : "black";
}

// Send a message to the Resurface service worker via the proxy
function postMessageToProxy(message) {
  window.postMessage({ ...message, sender: "CC_RESURFACE_DOM" }, "*");
}

export function ResurfaceTarget(element) {
  return {
    element,
    initialize,
    destroy,
    getValue,
    processChanges,
    setActive,
    attachButton,
    removeButton,
    setButtonEnabled,
    postMessageToProxy,
  };
}
