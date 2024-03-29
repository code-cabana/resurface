// https://betterprogramming.pub/functional-solutions-for-classes-in-javascript-7116d12be6b6
import { isElementValid, filterVisible } from "./validation";
import { ResurfaceTarget } from "./generic";
import { CodeMirrorTarget } from "./codeMirror";
import { TextAreaTarget } from "./textArea";

// Compatible DOM elements that can be controlled by Resurface
const targets = [
  {
    type: "CodeMirror",
    selector: ".CodeMirror",
    targetClass: CodeMirrorTarget,
  },
  { type: "textarea", selector: "textarea", targetClass: TextAreaTarget },
];

// Find all compatible Resurface target elements in the given document
export async function getResurfaceTargets(document) {
  return await targets.reduce(async (acc, target) => {
    const { selector, targetClass } = target;
    const elements = await recursiveQuerySelectorAll({ document, selector });
    const visibleElements = await filterVisible(elements);
    const validElements = visibleElements.filter(isElementValid);
    const targets = validElements.map(targetClass || ResurfaceTarget);
    return [...(await acc), ...targets];
  }, []);
}

/* 
  Recursively traverses all iframes within the given document,
  and selects elements matching the given selector
*/
async function recursiveQuerySelectorAll({ document: rootDoc, selector }) {
  let documents = [rootDoc];
  let elements = [];
  let maxNesting = 100;

  /* Extract selector matched elements from the given document,
  and also append any nested iframe documents to the global documents array */
  async function queryDocument({ document, selector }) {
    const iframes = document.querySelectorAll("iframe");
    const visibleIframes = await filterVisible(iframes);
    const validIframes = visibleIframes.filter(isElementValid);
    const foundDocs = validIframes.map((iframe) => iframe.contentDocument);
    if (foundDocs.length > 0) documents.push(...foundDocs);
    return Array.from(document.querySelectorAll(selector));
  }

  while (documents.length > 0 && maxNesting-- > 0) {
    const document = documents[0];
    if (!document) continue;
    const foundElements = await queryDocument({ document, selector });
    if (foundElements.length > 0) elements.push(...foundElements);
    documents.shift();
  }

  return elements;
}
