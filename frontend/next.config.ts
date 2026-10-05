import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: { '/api/export': ['./public/fonts/sf-pro-display/*.ttf'] },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'images.genius.com',
      },
    ],
  },
}

export default nextConfig
