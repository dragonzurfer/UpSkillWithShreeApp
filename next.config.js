/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // WARNING: This will skip *all* ESLint checks at build time!
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
