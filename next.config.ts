import type { NextConfig } from "next";

// Validate env vars at build/dev start.
import "./src/env";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
