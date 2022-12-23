import { ResurfaceTarget } from "./generic";

function getValue() {
  return this.element.CodeMirror.doc.getValue();
}

/*
  Convert Monaco changes
  https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IModelContentChange.html#text

  to CodeMirror replaceRange from/to args
  https://codemirror.net/doc/manual.html#api
*/
function processChanges(monacoChanges) {
  const codeMirrorChanges = monacoChanges.map((change) => {
    const { range, text: replacement } = change;
    const { startColumn, startLineNumber, endColumn, endLineNumber } = range;
    const from = { line: startLineNumber - 1, ch: startColumn - 1 };
    const to = { line: endLineNumber - 1, ch: endColumn - 1 };
    return { replacement, from, to };
  });

  codeMirrorChanges.forEach((change) => {
    const { replacement, from, to } = change;
    this.element.CodeMirror.doc.replaceRange(replacement, from, to);
  });
}

// "active" means actively receiving input from Resurface -> DOM element
function setActive(isActive) {
  const preventKeyboardEntry = (_cm, event) => {
    event.preventDefault();
  };

  if (isActive) this.element.CodeMirror.on("keydown", preventKeyboardEntry);
  else {
    this.element.CodeMirror.off("keydown", preventKeyboardEntry); // Doesn't work ?
    if (this.element.CodeMirror._handlers?.keydown)
      delete this.element.CodeMirror._handlers.keydown; // Manually delete the handler instead
  }
}

export function CodeMirrorTarget(element) {
  const resurfaceTarget = ResurfaceTarget(element);
  return {
    __proto__: resurfaceTarget,
    getValue,
    processChanges,
    setActive(isActive) {
      super.setActive(isActive);
      setActive.call(this, isActive);
    },
  };
}
