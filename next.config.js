/** @type {import('next').NextConfig} */
const nextConfig = {
  // Comentar output: 'export' para desarrollo con rutas dinámicas
  // Descomentar para producción/build estático
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  
  // Proxy de desarrollo para evitar problemas de CORS
  // Las peticiones a /api se redirigen al backend en localhost:3000
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
