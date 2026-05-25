/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '10.62.173.9:3000',
    '10.62.173.9',
    'localhost:3000',
    '127.0.0.1:3000',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
