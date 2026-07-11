import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./data/**/*"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  serverExternalPackages: ["better-sqlite3", "@libsql/client"],
  async redirects() {
    return [
      { source: "/category/:slug", destination: "/categorie/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
