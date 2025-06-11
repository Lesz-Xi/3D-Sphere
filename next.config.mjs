/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this devIndicators object
  devIndicators: {
    devToolbar: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
