import { useEffect } from "preact/hooks";

// Do something on a regular interval
export function useInterval(func, interval = 1000, dependencies = []) {
  useEffect(() => {
    const intervalId = setInterval(func, interval);
    return () => {
      clearInterval(intervalId);
    };
  }, dependencies);
}
