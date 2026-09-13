/** @type {import('next').NextConfig} */
const nextConfig = {
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