import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/quantfident_logo_transparent_cropped.png",
        permanent: true,
      },
    ];
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "sonner",
      "@vercel/analytics/react",
      "@vercel/speed-insights/next",
    ],
  },
};

export default nextConfig;
