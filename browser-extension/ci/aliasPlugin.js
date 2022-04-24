const resolve = require("resolve/sync");

// Redirect/alias a given node_module to another node_module
// Useful for react -> preact/compat
module.exports = (options) => {
  const aliases = Object.keys(options);
  const regex = new RegExp(
    `^(${aliases.map((x) => escapeRegExp(x)).join("|")})$`
  );

  return {
    name: "cc-alias",
    setup(build) {
      build.onResolve({ filter: regex }, (args) => {
        try {
          const newPath = options[args.path];
          debugDesired({ options, args, newPath });
          const resolvedPath = resolve(newPath);
          debugResolved({ options, args, resolvedPath });
          return { path: resolvedPath };
        } catch (error) {
          errorLog(error);
        }
      });
    },
  };
};

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const logPrefix = "[aliasPlugin]";
const debugLog = (...args) => console.log(logPrefix, ...args);
const errorLog = (...args) => console.error(logPrefix, ...args);
const debugDesired = ({ options, args, newPath }) =>
  options.debug &&
  debugLog("Found import:", args.path, "-> desired module:", newPath);
const debugResolved = ({ options, args, resolvedPath }) =>
  options.debug && debugLog(args.path, "-> resolved to:", resolvedPath);
