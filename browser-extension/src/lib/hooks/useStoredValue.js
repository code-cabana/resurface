import { useEffect, useState } from "preact/hooks";

// Uses a stateful value stored via Chrome's storage API
// https://developer.chrome.com/docs/extensions/reference/storage/
export function useStoredValue(key, defaultValue = null) {
  if (!key) return;
  const [stateValue, setStateValue] = useState(defaultValue);

  async function fetchValue() {
    const result = await chrome.storage.sync.get([key]);
    return result[key];
  }

  async function setValue(_newValue) {
    const newValue =
      typeof _newValue === "function" ? _newValue(stateValue) : _newValue;
    await chrome.storage.sync.set({ [key]: newValue });
    setStateValue(newValue);
  }

  async function refresh() {
    const fetched = await fetchValue();
    setStateValue(fetched);
  }

  useEffect(() => {
    chrome.storage.onChanged.addListener(refresh);
    return () => {
      chrome.storage.onChanged.removeListener(refresh);
    };
  }, []);

  useEffect(refresh, []);
  return [stateValue, setValue, refresh];
}
