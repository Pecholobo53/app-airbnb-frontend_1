'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Users, Eye, Flame, Clock, BadgeCheck, ArrowRight } from 'lucide-react';

const stays = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: { label: 'Más reservada', color: 'bg-[#FF385C] text-white', icon: Flame },
    name: 'Villa Mediterránea con Piscina Infinita',
    location: 'Costa del Sol, Málaga',
    type: 'Villa completa',
    rating: 4.98,
    reviews: 312,
    guests: 8,
    pricePerNight: 289,
    originalPrice: 380,
    urgency: '3 personas mirando esto ahora',
    availability: 'Solo 4 fechas disponibles este mes',
    verified: true,
    highlight: true,
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: { label: 'Oferta semana', color: 'bg-emerald-500 text-white', icon: Clock },
    name: 'Apartamento de Diseño · Vistas al Mar',
    location: 'Palma de Mallorca, Baleares',
    type: 'Apartamento exclusivo',
    rating: 4.95,
    reviews: 187,
    guests: 4,
    pricePerNight: 175,
    originalPrice: 220,
    urgency: '7 personas mirando esto ahora',
    availability: 'Últimas 2 semanas disponibles',
    verified: true,
    highlight: false,
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/2351649/pexels-photo-2351649.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: { label: 'Top anfitrión', color: 'bg-violet-500 text-white', icon: BadgeCheck },
    name: 'Chalet Nórdico en los Pirineos',
    location: 'Benasque, Huesca',
    type: 'Casa rural de autor',
    rating: 5.0,
    reviews: 94,
    guests: 6,
    pricePerNight: 198,
    originalPrice: 198,
    urgency: '2 personas mirando esto ahora',
    availability: 'Confirmación en menos de 1 hora',
    verified: true,
    highlight: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/**
 * FeaturedStaysSection — Propiedades curadas con urgencia real.
 * Reemplaza TrendingDestinations. Mueve usuarios al funnel de reserva directamente.
 * Zero backend: datos estáticos con FOMO + scarcity + social proof.
 */
export default function FeaturedStaysSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-[#FF385C]" />
              <p className="text-sm font-bold text-[#FF385C] uppercase tracking-widest">
                Reservadas esta semana
              </p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Estancias que no deberías perderte
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg">
              Disponibilidad limitada. Estas propiedades tienen huéspedes activos ahora mismo.
            </p>
          </div>
          <Link
            href="/buscar"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-[#FF385C] transition-colors whitespace-nowrap"
          >
            Ver todas las estancias
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {stays.map((stay) => {
            const BadgeIcon = stay.badge.icon;
            return (
              <motion.div key={stay.id} variants={itemVariants}>
                <Link
                  href={`/buscar`}
                  className={`group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border ${
                    stay.highlight ? 'border-[#FF385C]/30 ring-1 ring-[#FF385C]/20' : 'border-gray-100'
                  }`}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={stay.image}
                      alt={stay.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${stay.badge.color}`}>
                        <BadgeIcon className="w-3.5 h-3.5" />
                        {stay.badge.label}
                      </span>
                    </div>

                    {/* Discount badge */}
                    {stay.originalPrice > stay.pricePerNight && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-block px-2 py-1 bg-white text-xs font-bold text-[#FF385C] rounded-full shadow-sm">
                          -{Math.round((1 - stay.pricePerNight / stay.originalPrice) * 100)}%
                        </span>
                      </div>
                    )}

                    {/* Live viewers */}
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-xs text-white rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        {stay.urgency}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Type + Verified */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400 font-medium">{stay.type}</span>
                      {stay.verified && (
                        <span className="flex items-center gap-1 text-xs text-blue-500 font-medium">
                          <BadgeCheck className="w-3.5 h-3.5" />
                          Verificado
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-gray-900 leading-snug mb-1 group-hover:text-[#FF385C] transition-colors">
                      {stay.name}
                    </h3>

                    {/* Location */}
                    <p className="text-sm text-gray-500 mb-3">{stay.location}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-800">{stay.rating}</span>
                        <span>({stay.reviews})</span>
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        Hasta {stay.guests} huéspedes
                      </span>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-lg mb-4">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      {stay.availability}
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        {stay.originalPrice > stay.pricePerNight && (
                          <span className="text-xs text-gray-400 line-through block">
                            €{stay.originalPrice}/noche
                          </span>
                        )}
                        <span className="text-lg font-black text-gray-900">
                          €{stay.pricePerNight}
                          <span className="text-sm font-normal text-gray-500">/noche</span>
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 bg-[#FF385C] hover:bg-[#E31C5F] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors group-hover:shadow-md group-hover:shadow-[#FF385C]/25">
                        Ver disponibilidad
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile CTA */}
        <div className="sm:hidden text-center mt-8">
          <Link
            href="/buscar"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 underline underline-offset-4"
          >
            Ver todas las estancias
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
