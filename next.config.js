/**
 * Next.js Configuration
 * Configures image domains, react strict mode, and bundle settings for LS.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'raw.githubusercontent.com'],
    unoptimized: true
  }
};

export default nextConfig;
