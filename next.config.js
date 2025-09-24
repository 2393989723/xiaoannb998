/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    swcFileReading: true,
    swcWasm: true, // 强制使用WASM版SWC
  },
};
module.exports = nextConfig;


