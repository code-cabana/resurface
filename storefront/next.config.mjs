import nextTranspileModules from "next-transpile-modules";
import { getPageRel, webstorePage } from "shared/config";
const withTM = nextTranspileModules(["shared"]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  async redirects() {
    return [
      {
        source: getPageRel,
        destination: webstorePage,
        permanent: false,
      },
    ];
  },
};

export default withTM(nextConfig);
