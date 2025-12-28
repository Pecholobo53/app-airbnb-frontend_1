/** @type {import('next').NextConfig} */
const nextConfig = {
  // Comentar output: 'export' para desarrollo con rutas dinámicas
  // Descomentar para producción/build estático
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
