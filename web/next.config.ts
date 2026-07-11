import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  serverExternalPackages: ["better-sqlite3"],
  async redirects() {
    return [
      { source: "/category/:slug", destination: "/categorie/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
