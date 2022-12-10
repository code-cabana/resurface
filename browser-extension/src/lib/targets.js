
const buttonBg = "#133d65";
const buttonText = "white";
const CODE_MIRROR_PREFIX = 'CM'
const TEXTAREA_PREFIX = 'TA'

/**
 * ResurfaceTargets is the main interface used from main.js to initialize all code inputs on a page that can be used with
 * resurface.
 */
class ResurfaceTargets {
  constructor(postMsg) {
    this.resurfaceInstances = new Map();
    this.resurfaceInstances.set(CODE_MIRROR_PREFIX, new ResurfaceCodeMirrorTarget(postMsg))
    this.resurfaceInstances.set(TEXTAREA_PREFIX, new ResurfaceTextareaTarget(postMsg))
  }

  /**
   * Are there any code elements on the page?
   * @returns {boolean} True if there are code elements on page, false otherwise.
   */
  static hasCodeElements(){
    return ResurfaceTextareaTarget.hasCodeElements() || ResurfaceCodeMirrorTarget.hasCodeElements();
  }

  /**
   * Are their initialized code elements on the page?
   * @returns {boolean} True if there are already intialized ResurfaceInputs on the page, false otherwise.
   */
  get hasInputs() {
    return Array.from(this.resurfaceInstances.values()).reduce((x, hasInputs) => hasInputs || x.hasInputs(), false)
  }

  /**
   * Destroy all inputs that have been initialized.
   */
  destroy() {
    for (const resurfaceInstance of this.resurfaceInstances.values()) {
      resurfaceInstance.destroy();
    }
  }

  /**
   * Helper function to get ResurfaceInput instance used for a given ID
   * @param inputId - the ID of the element
   * @returns {ResurfaceTarget} The initialized ResurfaceInput instance to use for the ID
   * @private
   */
  _getResurfaceInstance(inputId){
    return this.resurfaceInstances.get(inputId.split("-")[0])
  }

  /**
   * Disable an input. Called before editing in Resurface Editor
   * @param inputId - ID of input to disable
   */
  disableInput(inputId) {
    this._getResurfaceInstance(inputId).disableInput(inputId)
  }

  /**
   * Enable an input. Called after editing is completed.
   * @param inputId - ID of input to enable
   */
  enableInput(inputId) {
    this._getResurfaceInstance(inputId).enableInput(inputId)
  }

  /**
   * Get the current value of an input. This is used to intialize the editor with the correct code contents.
   * @param inputId - ID of input to get value for
   * @returns {string} The current value of the input on the page.
   */
  getValue(inputId) {
    return this._getResurfaceInstance(inputId).getValue(inputId)
  }

  /**
   * Called to update the input on the page. This is called every time the resurface editor has changed
   * @param inputId - ID of the input that is being edited.
   * @param changes - Change being made with this format:
   *        https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IModelContentChange.html#text
   */
  editorChanged(inputId, changes) {
    this._getResurfaceInstance(inputId).editorChanged(inputId, changes)
  }

  /**
   * Given an ID get the DOM element
   * @param inputId The ID of the element to get
   * @returns {*} DOM element for the given ID
   */
  getResurfaceTargetById(inputId) {
    return this._getResurfaceInstance(inputId).getResurfaceTargetById(inputId)
  }
}

/**
 * Baseclass for any Resurface Input.
 * Any new inputs that inherit from this class must implement:
 *    - hasCodeElements
 *    - findInputs
 *    - getValue
 *    - prefix (this is just a getter with the static prefix for this input type. Define a const above.
 *    - enable
 *    - disable
 */
class ResurfaceTarget {

  constructor(postMsg) {
    this.elements = []
    this.postMessageToProxy = postMsg
    this.findInputs()
    this.buttons = this.attachButtons()
  }

  /**
   * A static method that checks if there are any inputs on the page that could use a code editor
   */
  static hasCodeElements() {
    throw new Error("hasCodeElements not implemented")
  }

  /**
   * Will be called on initalization and should find all inputs on the page and save the DOM elements to
   * `this.elements`.
   */
  findInputs() {
    throw new Error("findInputs not implemented")
  }

  /**
   * Get the string value of a given inputId. This should get the current code in the DOM input element.
   * @param inputId the ID of the input to get the value for.
   */
  getValue(inputId){
    throw new Error("getValue not implemented")
  }

  /**
   * Getter for the prefix. Each class that inherits from ResurfaceTarget needs a unique prefix
   */
  get prefix(){
    throw new Error("prefix not implmented")
  }

  enableInput(inputId){
    const resurfaceTarget = this.getResurfaceTargetById(inputId);
    if (!resurfaceTarget) return;
    this.enable(resurfaceTarget);
    this.toggleButton(inputId, true);
  }

  /**
   * Given a DOM element enable it for editing
   * @param resurfaceTarget The DOM element stored in `this.elements`
   */
  enable(resurfaceTarget) {
    throw new Error("enableInput not implemented")
  }

  /**
   * Given a DOM element disable it for editing
   * @param resurfaceTarget The DOM element stored in `this.elements`
   */
  disable(resurfaceTarget) {
    throw new Error("disableInput not implemented")
  }

  disableInput(inputId) {
    const resurfaceTarget = this.getResurfaceTargetById(inputId);
    if (!resurfaceTarget) return;
    this.disable(resurfaceTarget)
    this.toggleButton(inputId, false);
  }

  /**
   * Converts the inputID to the DOM element
   * @param inputId - The ID to get the DOM element for
   * @returns {*} DOM element for the ID
   */
  getResurfaceTargetById(inputId) {
    return this.elements.find(
      (el) => el.dataset.resurfaceInputId === inputId.toString()
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
      const targetId = button.dataset.resurfaceInputId;
      this.postMessageToProxy({ type: "closeEditor", targetId, recipient: "editor" });
      button.remove();
    });
    this.buttons = [];
    this.elements = [];
  }

  getButtonStyle(element) {

    const parentTopOffset = element.offsetTop;
    const parentLeftOffset = element.offsetLeft;

    return `
        position: absolute;
        top: ${parentTopOffset + 10}px; 
        left: ${parentLeftOffset + 10}px;
        width: 200px;
        cursor: pointer;
        padding: 12px;
        border: none;
        border-radius: 4px;
        background-color: ${buttonBg};
        color: ${buttonText};
        z-index: 5;
        `; // z-index 5 is required for Squarespace (might need to change per platform)
  }

  attachButtons() {
    return this.elements.map((codeElement, index) => {
      const button = document.createElement("button");
      button.classList.add("resurface-editor-button");
      button.classList.add("resurface-stripe");
      button.innerText = "Open Resurface editor";
      button.style = this.getButtonStyle(codeElement);
      button.addEventListener(
        "click",
        (evt) =>{
          evt.preventDefault();
          this.postMessageToProxy({
            type: "openEditor",
            recipient: "service-worker",
            targetId: `${this.prefix}-${index}`,
          })},
        false
      );

      // Attach targetIds
      button.dataset.resurfaceInputId = `${this.prefix}-${index}`;
      codeElement.dataset.resurfaceInputId = `${this.prefix}-${index}`;
      codeElement.parentNode.insertBefore(button, codeElement); // Attach button to target
      // TODO: buttons have not been initialized yet so this enableInput will not work.
      //this.enableInput(index); // Enable the mirror for editing in case it was disabled earlier
      return button;
    });
  }
}

class ResurfaceCodeMirrorTarget extends ResurfaceTarget {

  get prefix(){
    return CODE_MIRROR_PREFIX
  }

  preventKeyboardEntry(_cm, event) {
    event.preventDefault();
  }

  static hasCodeElements() {
    return !!document.querySelector(".CodeMirror")
  }

  getValue(inputId){
    let codeMirror = this.getResurfaceTargetById(inputId)
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
    this.elements = foundMirrors.filter((el) => el && el.offsetParent);
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
    const codeMirror = this.getResurfaceTargetById(inputId);
    if (!codeMirror) return;

    const translated = this._translateMonacoChanges(changes);
    translated.forEach((change) => {
      const { replacement, from, to } = change;
      codeMirror.CodeMirror.doc.replaceRange(replacement, from, to);
    });
  }
}


class ResurfaceTextareaTarget extends ResurfaceTarget {

  get prefix(){
    return TEXTAREA_PREFIX;
  }

  static hasCodeElements() {
    return !!document.querySelector("textarea")
  }

  preventKeyboardEntry(_cm, event) {
    event.preventDefault();
  }

  getValue(inputId){
    let textArea = this.getResurfaceTargetById(inputId)
    return textArea.value;
  }

  // Enables a given text area for editing
  enable(resurfaceTarget) {
    resurfaceTarget.disabled = false;
  }

  // Disables a given text area so that it cannot be edited
  disable(resurfaceTarget) {
    resurfaceTarget.disabled = true;
  }

  findInputs() {
    const foundTextareas = Array.from(document.querySelectorAll("textarea"));
    this.elements = foundTextareas.filter((el) => el && el.offsetParent);
  }


  editorChanged(inputId, changes) {
    const resurfaceTarget = this.getResurfaceTargetById(inputId);
    if (!resurfaceTarget) return;

    changes.forEach((change) => {
      resurfaceTarget.setRangeText(change.text, change.rangeOffset, change.rangeOffset + change.rangeLength);
    });
  }

}

export {ResurfaceTargets}
