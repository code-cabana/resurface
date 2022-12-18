const { devUrls } = require("../src/config/ci");

module.exports = {
  sourceDir: "dist",
  run: {
    startUrl: devUrls,
  },
};
