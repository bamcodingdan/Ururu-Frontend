/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const isProd = process.env.NODE_ENV === 'production';
    return [
      {
        source: '/api/:path*',
        destination: isProd
          ? 'https://api.ururu.shop/api/:path*'
          : 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;
