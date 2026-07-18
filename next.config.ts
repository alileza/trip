import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site into ./out for GitHub Pages (no Node server).
  output: "export",
  // Custom domain (trip.alileza.me) serves from the root, so no basePath.
  // next/image optimisation needs a server, so disable it for the static build.
  images: { unoptimized: true },
  // Serve each route as a folder with index.html — friendlier on static hosts.
  trailingSlash: true,
};

export default nextConfig;
