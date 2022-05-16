import { useEffect } from "preact/hooks";
import { debounce } from "../util";

// Do something after a browser window has finished sizing
export function useResizeEnd(func, wait = 100, dependencies = []) {
  useEffect(() => {
    if (!window) return;
    const handleResize = debounce(
      (event) => func(event, window.innerWidth, window.innerHeight),
      wait
    );
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, dependencies);
}
