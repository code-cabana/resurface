// Returns a new array containing only visible elements from the given array
export async function filterVisible(elements) {
  const elementsArr = Array.from(elements);
  const promises = elementsArr.map(isElementVisible);
  const results = await Promise.all(promises);
  return elementsArr.filter((_, idx) => results[idx]);
}

// Returns true if the element is visible accordiong to the Intersection Observer API
// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
export function isElementVisible(element) {
  return new Promise((resolve) => {
    const observer = new IntersectionObserver(
      (entries) => {
        observer.disconnect();
        const { isVisible, intersectionRatio } = entries[0];
        const canUseIsVisible = typeof isVisible !== "undefined"; // https://caniuse.com/intersectionobserver-v2
        const isIntersecting = intersectionRatio > 0;
        resolve(canUseIsVisible ? isVisible || isIntersecting : isIntersecting);
      },
      { root: null, trackVisibility: true, delay: 100 }
    );

    observer.observe(element);
  });
}

// Returns false if the given DOM element possesses forbidden attributes/styles etc.
export function isElementValid(element) {
  const forbiddenStyles = [
    { key: "display", value: "none" },
    { key: "visibility", value: "hidden" },
  ];
  const forbiddenAttributes = ["hidden", "data-resurface-target-id"];

  const invalidStyle = forbiddenStyles.some((candidate) => {
    const anyValue = typeof candidate === "string";
    const { key, value } = candidate || {};
    return anyValue ? !!element.style[key] : element.style[key] === value;
  });

  const invalidAttr = forbiddenAttributes.some((candidate) => {
    const anyValue = typeof candidate === "string";
    const { key, value } = candidate || {};
    return anyValue
      ? element.hasAttribute(candidate)
      : element.getAttribute(key) === value;
  });

  return !invalidStyle && !invalidAttr;
}
