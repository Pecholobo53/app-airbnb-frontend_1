/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  /**
   * Rewrites de desarrollo:
   *   - Solo activos en local. Proxea /api/* al backend para evitar CORS en el browser.
   *   - El destino se toma de NEXT_PUBLIC_API_URL o cae al puerto 3000 local.
   *
   * En producción:
   *   - Los servicios usan NEXT_PUBLIC_API_URL directamente (peticiones client-side).
   *   - El rewrite se desactiva para no interferir con rutas SSR/API de Next.js.
   */
  async rewrites() {
    if (process.env.NODE_ENV === 'production') return [];

    const backendOrigin =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') ||
      'http://localhost:3000';

    return [
      {
        source: '/api/:path*',
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
