/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cssLoaderOptions: {
    url: false, // 禁用CSS中url加载器，避免本地资源引入报错
  },
};

module.exports = nextConfig;
