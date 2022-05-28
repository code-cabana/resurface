export const isFunc = (value) => typeof value === "function";
export const cssJoin = (...args) => args.filter(Boolean).join(" ");

export function getCurrentSession() {
  const swellId = document.cookie.match(/swell-session=([^;]+)/)?.[1];
  const userAgent = navigator.userAgent;
  return { swellId, userAgent };
}

export const isEmptyStr = (str) =>
  !str || (typeof str === "string" && str.trim().length === 0);
