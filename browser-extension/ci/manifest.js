import pkg from "../../package.json";
import fs from "fs";

function getManifest() {
  return {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    icons: {
      16: "assets/resurface-logo-16.png",
      48: "assets/resurface-logo-48.png",
      128: "assets/resurface-logo-128.png",
    },
    background: {
      service_worker: "service-worker.js",
      type: "module",
    },
    action: {
      default_popup: "assets/popup.html",
    },
    options_page: "assets/options.html",
    content_scripts: [
      {
        matches: ["<all_urls>"],
        js: ["content-scripts/proxy.js"],
      },
    ],
    permissions: ["scripting", "tabs", "storage", "contextMenus"],
    host_permissions: ["<all_urls>"],
  };
}

function writeManifest(path) {
  try {
    console.log(`Writing ${path}. Detected version: ${pkg.version}`);
    fs.writeFileSync(path, JSON.stringify(getManifest(), null, 2));
  } catch (err) {
    console.error(err);
  }
}

writeManifest("./dist/manifest.json");
