import type { NextConfig } from "next";

const isPagesBuild = process.env.GITHUB_PAGES === "true";
const repoBasePath = process.env.PAGES_BASE_PATH ?? "/Scam-Dam";

const nextConfig: NextConfig = {
  ...(isPagesBuild
    ? {
        output: "export",
        basePath: repoBasePath,
        assetPrefix: repoBasePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
