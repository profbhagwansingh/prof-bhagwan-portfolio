/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ─── API Proxy: forward /api/* requests to the backend ───────────
  // This runs server-side so the browser never hits port 4000 directly,
  // which avoids CORS issues in both dev and production.
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },

  images: {
    // Allow images from the backend API and common CDNs
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
    ],
    // Responsive breakpoints for srcset
    deviceSizes: [400, 640, 768, 1024, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ["image/webp", "image/avif"],
  },

  // ─── 301 Redirects: Legacy .html URLs → New Clean URLs ───────────
  async redirects() {
    return [
      { source: "/index.html",        destination: "/",              permanent: true },
      { source: "/about.html",        destination: "/about",         permanent: true },
      { source: "/publication.html",  destination: "/publications",  permanent: true },
      { source: "/gallery.html",      destination: "/gallery",       permanent: true },
      { source: "/talk_to_prof.html", destination: "/contact",       permanent: true },
      { source: "/alumani.html",      destination: "/alumni",        permanent: true },
      // Common misspellings / alternate paths
      { source: "/publications.html", destination: "/publications",  permanent: true },
      { source: "/contact.html",      destination: "/contact",       permanent: true },
      { source: "/alumni.html",       destination: "/alumni",        permanent: true },
    ];
  },

  // ─── Security Headers ────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",          value: "DENY" },
          { key: "X-Content-Type-Options",   value: "nosniff" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Cache fonts and static assets aggressively
        source: "/fonts/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // ─── Output Configuration ─────────────────────────────────────────
  // 'standalone' output is required for GoDaddy VPS / PM2 deployment
  output: "standalone",
};

export default nextConfig;