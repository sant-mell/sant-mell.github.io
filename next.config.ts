import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages (sant-mell.github.io user site).
  output: "export",
  images: {
    // No Image Optimization server on static hosts — serve images as-is.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.microlink.io" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "ui.aceternity.com" },
    ],
  },
};

export default nextConfig;
