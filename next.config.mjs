/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "substackcdn.com" },
      { protocol: "https", hostname: "substack-post-media.s3.amazonaws.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async redirects() {
    return [
      { source: "/playground", destination: "/", permanent: true },
      { source: "/playground/:path*", destination: "/", permanent: true },
    ];
  },
  async headers() {
    const longCache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }];
    return ["/museum/:path*", "/showcase/:path*", "/images/:path*", "/case-studies/:path*", "/about-gallery/:path*"].map((source) => ({ source, headers: longCache }));
  },
};

export default nextConfig;
