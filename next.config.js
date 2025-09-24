/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    swcWasm: true, // 强制使用WASM版SWC，规避安卓原生依赖缺失
  },
};

module.exports = nextConfig;
