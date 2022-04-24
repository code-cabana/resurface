import { isStorageToggleEnabled } from "./chrome";

const logPrefix = "[Resurface]";
async function logIfEnabled(callback) {
  const loggingEnabled = await isStorageToggleEnabled("cc-resurface-logging");
  if (!loggingEnabled) return;
  callback();
}

const logger = {
  debug: (...args) => logIfEnabled(() => console.debug(...args)),
  warn: (...args) => logIfEnabled(() => console.warn(...args)),
  error: (...args) => logIfEnabled(() => console.error(...args)),
};

export const debug = (...args) => logger.debug(logPrefix, ...args);
export const warn = (...args) => logger.warn(logPrefix, ...args);
export const error = (...args) => logger.error(logPrefix, ...args);
