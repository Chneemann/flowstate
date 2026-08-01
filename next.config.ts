import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone" as const,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
