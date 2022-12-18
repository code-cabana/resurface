import { ResurfaceTarget } from "./generic";

export function CodeMirrorTarget(element) {
  const resurfaceTarget = ResurfaceTarget(element);
  const buttonBg = "#133d65";
  const buttonText = "white";

  return {
    __proto__: resurfaceTarget,

    getValue() {
      return this.element.CodeMirror.doc.getValue();
    },

    /*
      Convert Monaco changes
      https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IModelContentChange.html#text

      to CodeMirror replaceRange from/to args
      https://codemirror.net/doc/manual.html#api
    */
    processChanges(monacoChanges) {
      const codeMirrorChanges = monacoChanges.map((change) => {
        const { range, text: replacement } = change;
        const { startColumn, startLineNumber, endColumn, endLineNumber } =
          range;
        const from = { line: startLineNumber - 1, ch: startColumn - 1 };
        const to = { line: endLineNumber - 1, ch: endColumn - 1 };
        return { replacement, from, to };
      });

      codeMirrorChanges.forEach((change) => {
        const { replacement, from, to } = change;
        this.element.CodeMirror.doc.replaceRange(replacement, from, to);
      });
    },

    // "active" means actively receiving input from Resurface -> DOM element
    setActive(isActive) {
      resurfaceTarget.setActive.call(this, isActive);

      const preventKeyboardEntry = (_cm, event) => {
        event.preventDefault();
      };

      if (isActive) this.element.CodeMirror.on("keydown", preventKeyboardEntry);
      else this.element.CodeMirror.off("keydown", preventKeyboardEntry);
    },

    // Add a button to the DOM that opens the Resurface editor
    attachButton() {
      const button = document.createElement("button");
      button.classList.add("resurface-editor-button");
      button.classList.add("resurface-stripe");
      button.innerText = "Open Resurface editor";
      button.type = "button";
      button.style = `
          position: absolute;
          top: 0; left: 0;
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

      this.element.appendChild(button);
      this.button = button;
    },
  };
}
