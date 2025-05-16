import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Outputs a Single-Page Application (SPA)
  distDir: ".next", // Changes the build output directory to `.next`
};

export default nextConfig;
