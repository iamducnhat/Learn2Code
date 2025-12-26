/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features if needed
  experimental: {
    // serverActions: true,
  },
  
  // Image optimization domains
  images: {
    domains: [],
  },
  
  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: 'Learn2Code',
  },
};

module.exports = nextConfig;
