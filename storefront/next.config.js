const withTM = require("next-transpile-modules")(["shared"]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withTM(nextConfig);
