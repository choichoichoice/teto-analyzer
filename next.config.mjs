/** @type {import('next').NextConfig} */
const nextConfig = {
  // 성능 최적화 설정
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 이미지 최적화
  images: {
    domains: ['demo.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  // 캐시 설정
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
