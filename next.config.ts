/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://cohyouth-app-backend-1:3000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
