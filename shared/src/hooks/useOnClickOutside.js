import { useEffect } from "react";

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    if (!document || !ref || !handler) return;
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return; // Do nothing if clicking ref's element or descendent elements
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
