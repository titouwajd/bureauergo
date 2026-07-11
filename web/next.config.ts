import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  serverExternalPackages: ["@libsql/client"],
  async redirects() {
    return [
      { source: "/category/:slug", destination: "/categorie/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
