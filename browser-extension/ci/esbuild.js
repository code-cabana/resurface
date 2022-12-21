const { build } = require("esbuild");
const cssModulesPlugin = require("esbuild-css-modules-plugin");
const aliasPlugin = require("./aliasPlugin");

const mode = process.env.MODE;
const prod = mode === "prod";

// Main
build({
  entryPoints: [
    "src/service-worker.js",
    "src/help/index.js",
    "src/options/index.js",
    "src/editor/index.js",
    "src/login/index.js",
    "src/content-scripts/main.js",
    "src/content-scripts/proxy.js",
  ],
  bundle: true,
  minify: prod,
  watch: !prod,
  sourcemap: prod ? false : "inline",
  outdir: "./dist",
  loader: {
    ".html": "file",
    ".js": "jsx",
    ".ttf": "file",
    ".otf": "file",
    ".svg": "file",
  },
  target: ["chrome89", "firefox91", "safari15", "ios15"],
  jsxFactory: "h",
  jsxFragment: "Fragment",
  inject: ["ci/preact-shim.js"],
  plugins: [
    cssModulesPlugin({ inject: true, localsConvention: "camelCase" }),
    aliasPlugin({ react: "preact/compat" }),
  ],
}).catch(() => process.exit(1));

const monacoWorkerEntryPoints = [
  "vs/language/json/json.worker.js",
  "vs/language/css/css.worker.js",
  "vs/language/html/html.worker.js",
  "vs/language/typescript/ts.worker.js",
  "vs/editor/editor.worker.js",
];

// Monaco Editor
build({
  entryPoints: monacoWorkerEntryPoints.map(
    (entry) => `../node_modules/monaco-editor/esm/${entry}`
  ),
  bundle: true,
  minify: true,
  format: "iife",
  outbase: "../node_modules/monaco-editor/esm/",
  outdir: "./dist",
}).catch(() => process.exit(1));
