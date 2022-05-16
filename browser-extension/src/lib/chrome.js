/* 
  Usage:
    chrome.storage.onChanged.addListener(
      onStorageToggleChange({
        key: "my-storage-key",
        onEnabled: () => { ... },
        onDisabled: () => { ... },
      })
    );
*/
export function onStorageToggleChange({ key, onEnabled, onDisabled }) {
  return (changes, areaName) => {
    const valueWasEnabled = (key) =>
      changes[key]?.newValue === true && changes[key]?.oldValue === false;
    const valueWasDisabled = (key) =>
      changes[key]?.newValue === false && changes[key]?.oldValue === true;
    if (areaName !== "sync") return;
    if (valueWasEnabled(key)) onEnabled();
    else if (valueWasDisabled(key)) onDisabled();
  };
}

export async function isStorageToggleEnabled(key) {
  const result = await chrome.storage.sync.get([key]);
  return result[key] === true;
}
