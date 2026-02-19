'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, TrendingUp } from 'lucide-react';

const destinations = [
  {
    name: 'Costa del Sol',
    region: 'Málaga',
    country: 'España',
    tagline: 'Mediterráneo, sol y gastronomía de autor',
    badge: '🔥 Más popular',
    properties: 842,
    image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800',
    searchQuery: 'Málaga',
    priceFrom: 89,
  },
  {
    name: 'Islas Baleares',
    region: 'Mallorca · Ibiza · Formentera',
    country: 'España',
    tagline: 'Aguas turquesa y villas de ensueño',
    badge: '✨ Premium',
    properties: 1204,
    image: 'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&w=800',
    searchQuery: 'Mallorca',
    priceFrom: 125,
  },
  {
    name: 'Pirineos',
    region: 'Huesca · Lleida',
    country: 'España',
    tagline: 'Naturaleza intacta y refugios de montaña',
    badge: '🏔️ Escapada',
    properties: 376,
    image: 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=800',
    searchQuery: 'Pirineos',
    priceFrom: 72,
  },
  {
    name: 'Islas Canarias',
    region: 'Tenerife · Gran Canaria',
    country: 'España',
    tagline: 'Verano eterno y paisajes volcánicos únicos',
    badge: '☀️ Todo el año',
    properties: 918,
    image: 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=800',
    searchQuery: 'Tenerife',
    priceFrom: 79,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

/**
 * TrendingDestinations — Grid estático de destinos en tendencia.
 * Facilita la navegación y reduce el tiempo hasta la primera búsqueda.
 * Zero backend: datos hardcoded + imágenes Pexels.
 */
export default function TrendingDestinations() {
  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <motion.div
          className="flex items-end justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#FF385C]" />
              <p className="text-sm font-semibold text-[#FF385C] uppercase tracking-widest">
                Destinos en tendencia
              </p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              ¿A dónde quieres ir?
            </h2>
            <p className="text-gray-500 mt-2">
              Los destinos más reservados por viajeros como tú este mes.
            </p>
          </div>
          <Link
            href="/buscar"
            className="hidden sm:flex text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-[#FF385C] transition-colors"
          >
            Ver todos los destinos
          </Link>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {destinations.map((dest, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link
                href={`/buscar?location=${encodeURIComponent(dest.searchQuery)}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[3/4] shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                {/* Background image */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-2.5 py-1 bg-white/95 text-xs font-bold text-gray-800 rounded-full shadow-sm">
                    {dest.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {dest.name}
                  </h3>
                  <p className="flex items-center gap-1 text-white/80 text-xs mt-0.5 mb-2">
                    <MapPin className="w-3 h-3" />
                    {dest.region}
                  </p>
                  <p className="text-white/70 text-xs leading-snug mb-3">
                    {dest.tagline}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">
                      {dest.properties.toLocaleString()} residencias
                    </span>
                    <span className="text-white font-semibold text-sm">
                      desde €{dest.priceFrom}/noche
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile CTA */}
        <div className="sm:hidden text-center mt-8">
          <Link
            href="/buscar"
            className="text-sm font-semibold text-gray-900 underline underline-offset-4"
          >
            Ver todos los destinos
          </Link>
        </div>

      </div>
    </section>
  );
}
