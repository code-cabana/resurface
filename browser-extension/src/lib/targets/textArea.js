import { ResurfaceTarget } from "./generic";

function initialize() {
  this.setter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value"
  ).set;
}

/*
  Set the value of the DOM element and dispatch an input event
  
  Necessary to force any React instance that may be
  controlling the element to also notice the changes

  https://stackoverflow.com/a/70548640/13911217
*/
function setValue(newValue) {
  this.setter.call(this.element, newValue);
  this.element.dispatchEvent(new Event("input", { bubbles: true }));
}

export function TextAreaTarget(element) {
  const resurfaceTarget = ResurfaceTarget(element);
  return {
    __proto__: resurfaceTarget,
    initialize(idx) {
      super.initialize(idx);
      initialize.call(this, idx);
    },
    setValue,
  };
}
