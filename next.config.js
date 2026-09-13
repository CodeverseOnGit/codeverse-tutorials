/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/cloud-native-development',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/cloud-native-development',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
