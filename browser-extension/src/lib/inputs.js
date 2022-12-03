
const buttonBg = "#133d65";
const buttonText = "white";
const CODE_MIRROR_PREFIX = 'CM'

class CodeInputs {
  constructor(postMsg) {
    this.codeInputs = new Map();
    this.codeInputs.set(CODE_MIRROR_PREFIX, new ResurfaceCodeMirrorInput(postMsg))
  }


  get hasInputs() {
    return Array.from(this.codeInputs.values()).reduce((x, hasInputs) => hasInputs || x.hasInputs(), false)
  }

  destroy() {
    for (const codeInput of this.codeInputs.values()) {
      codeInput.destroy();
    }
  }

  _getCodeInput(inputId){
    //split based on -
    // lookup in map based on prefix
    // return the value
    return this.codeInputs.get(inputId.split("-")[0])
  }

  disableInput(inputId) {
    this._getCodeInput(inputId).disableInput(inputId)
  }

  enableInput(inputId) {
    this._getCodeInput(inputId).enableInput(inputId)
  }

  getValue(inputId) {
    return this._getCodeInput(inputId).getValue(inputId)
  }

  editorChanged(inputId, changes) {
    this._getCodeInput(inputId).editorChanged(inputId, changes)
  }

  getCodeInputById(inputId) {
    return this._getCodeInput(inputId).getCodeInputById(inputId)
  }
}

class ResurfaceInput {

  constructor(postMsg) {
    this.elements = []
    this.postMessageToProxy = postMsg
    this.findInputs()
    this.buttons = this.attachButtons()
  }

  findInputs() {
    throw new Error("findInputs not implemented")
  }

  /**
   * Get a value from the given inputId
   * @param inputId
   */
  getValue(inputId){
    throw new Error("getValue not implemented")
  }


  get prefix(){
    throw new Error("prefix not implmented")
  }

  enableInput(inputId){
    const codeInput = this.getCodeInputById(inputId);
    if (!codeInput) return;
    this.enable(codeInput);
    this.toggleButton(inputId, true);
  }

  enable(codeInput) {
    throw new Error("enableInput not implemented")
  }

  disable(codeInput) {
    throw new Error("disableInput not implemented")
  }

  disableInput(inputId) {
    const codeInput = this.getCodeInputById(inputId);
    if (!codeInput) return;
    this.disable(codeInput)
    this.toggleButton(inputId, false);
  }

  // Returns codeMirror DOM element by ID index
  getCodeInputById(mirrorId) {
    return this.elements.find(
      (mirror) => mirror.dataset.resurfaceInputId === mirrorId.toString()
    );
  }


// Enables/disables the open editor button
  toggleButton(inputId, enabled) {
    const button = this.buttons.find(
      (button) => button.dataset.resurfaceInputId === inputId.toString()
    );
    if (!button) return;
    button.disabled = !enabled;
    button.innerText = enabled
      ? "Open Resurface editor"
      : "(editing via Resurface)";
    button.style.backgroundColor = enabled ? buttonBg : "transparent";
    button.style.cursor = enabled ? "pointer" : "default";
    button.style.color = enabled ? buttonText : "black";
  }


  get hasInputs() {
    return this.elements.length > 0;
  }



  destroy() {
    // Just destory this classes buttons
    // TODO: Do we need to look for orphaned buttons?
    //const orphanedButtons = getAllButtons();
    //const allButtons = (
    //  orphanedButtons ? [...buttons, ...orphanedButtons] : buttons
    //).filter(Boolean);
    this.buttons.forEach((button) => {
      const mirrorId = button.dataset.resurfaceInputId;
      this.postMessageToProxy({ type: "closeEditor", mirrorId, recipient: "editor" });
      button.remove();
    });
    this.buttons = [];
    this.elements = [];
  }

  attachButtons() {
    return this.elements.map((mirror, index) => {
      const button = document.createElement("button");
      button.classList.add("resurface-editor-button");
      button.classList.add("resurface-stripe");
      button.innerText = "Open Resurface editor";
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
        () =>
          this.postMessageToProxy({
            type: "openEditor",
            recipient: "service-worker",
            mirrorId: `${this.prefix}-index`,
          }),
        false
      );

      // Attach mirrorIds
      button.dataset.resurfaceInputId = `${this.prefix}-index`;
      mirror.dataset.resurfaceInputId = `${this.prefix}-index`;
      mirror.appendChild(button); // Attach button to CodeMirror
      // TODO: buttons have not been initialized yet so this enableInput will not work.
      //this.enableInput(index); // Enable the mirror for editing in case it was disabled earlier
      return button;
    });
  }
}

class ResurfaceCodeMirrorInput extends ResurfaceInput {

  get prefix(){
    return CODE_MIRROR_PREFIX
  }

  preventKeyboardEntry(_cm, event) {
    event.preventDefault();
  }

  getValue(inputId){
    let codeMirror = this.getCodeInputById(inputId)
    return codeMirror.CodeMirror.doc.getValue();
  }

// Enables a given code mirror for editing
  enable(codeMirror) {
    codeMirror.style.opacity = 1;
    codeMirror.CodeMirror.off("keydown", this.preventKeyboardEntry);
  }

// Disables a given code mirror so that it cannot be edited
  disable(codeMirror) {
    codeMirror.style.opacity = 0.5;
    codeMirror.CodeMirror.on("keydown", this.preventKeyboardEntry);
  }

  findInputs() {
    const foundMirrors = Array.from(document.querySelectorAll(".CodeMirror"));
    this.elements = foundMirrors.filter(Boolean);
  }

  /*
      Converts Monaco changes
      https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IModelContentChange.html#text

      to CodeMirror replaceRange from/to args
      https://codemirror.net/doc/manual.html#api
  */
  _translateMonacoChanges(monacoChanges) {
    return monacoChanges.map((change) => {
      const { range, text: replacement } = change;
      const { startColumn, startLineNumber, endColumn, endLineNumber } = range;
      const from = { line: startLineNumber - 1, ch: startColumn - 1 };
      const to = { line: endLineNumber - 1, ch: endColumn - 1 };
      return { replacement, from, to };
    });
  }

  editorChanged(inputId, changes) {
    const codeMirror = this.getCodeInputById(inputId);
    if (!codeMirror) return;

    const translated = this._translateMonacoChanges(changes);
    translated.forEach((change) => {
      const { replacement, from, to } = change;
      codeMirror.CodeMirror.doc.replaceRange(replacement, from, to);
    });
  }
}


class ResurfaceTextareaInput extends ResurfaceInput {

  preventKeyboardEntry(_cm, event) {
    event.preventDefault();
  }

  getValue(inputId){
    let textArea = this.getCodeInputById(inputId)
    return textArea.value;
  }

// Enables a given code mirror for editing
  enable(codeInput) {
    codeInput.disable = false;
  }

// Disables a given code mirror so that it cannot be edited
  disableInput(mirrorId) {
    codeInput.disable = true;
  }

  findInputs() {
    const foundMirrors = Array.from(document.querySelectorAll(".CodeMirror"));
    this.elements = foundMirrors.filter(Boolean);
  }

  /*
      Converts Monaco changes
      https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IModelContentChange.html#text

      to CodeMirror replaceRange from/to args
      https://codemirror.net/doc/manual.html#api
  */
  _translateMonacoChanges(monacoChanges) {
    return monacoChanges.map((change) => {
      const { range, text: replacement } = change;
      const { startColumn, startLineNumber, endColumn, endLineNumber } = range;
      const from = { line: startLineNumber - 1, ch: startColumn - 1 };
      const to = { line: endLineNumber - 1, ch: endColumn - 1 };
      return { replacement, from, to };
    });
  }

  editorChanged(inputId, changes) {
    //const codeMirror = this.getCodeInputById(inputId);
    //if (!codeMirror) return;

    //const translated = this._translateMonacoChanges(changes);
    //translated.forEach((change) => {
    //  const { replacement, from, to } = change;
    //  codeMirror.CodeMirror.doc.replaceRange(replacement, from, to);
    //});
  }
}

export {ResurfaceCodeMirrorInput, CodeInputs}
