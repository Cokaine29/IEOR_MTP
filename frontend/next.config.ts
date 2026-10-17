import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lets `npm run dev` be opened from the department server's address (dev only; ignored by the production build)
  allowedDevOrigins: ["10.119.2.17"],
};

export default nextConfig;
