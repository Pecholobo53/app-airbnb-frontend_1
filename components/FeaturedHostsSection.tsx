'use client';

import { motion } from 'framer-motion';
import { Star, BadgeCheck } from 'lucide-react';

const hosts = [
  {
    initials: 'MG',
    name: 'María García',
    title: 'Superanfitriona',
    location: 'Costa del Sol, Málaga',
    since: 'Anfitriona desde 2018',
    properties: 12,
    rating: 4.97,
    reviews: 384,
    specialty: 'Villas frente al mar con vistas panorámicas',
    quote:
      'Mi objetivo es que cada huésped sienta que llega a su segundo hogar — preparado, cuidado y con el detalle que marca la diferencia.',
    gradient: 'from-rose-400 to-pink-500',
    verified: true,
  },
  {
    initials: 'CM',
    name: 'Carlos Montoya',
    title: 'Superanfitrión',
    location: 'Pirineos, Huesca',
    since: 'Anfitrión desde 2019',
    properties: 8,
    rating: 4.99,
    reviews: 217,
    specialty: 'Casas rurales y refugios de montaña de autor',
    quote:
      'Cuido cada propiedad como si fuera mi propia casa. Porque en el fondo, lo es — y me encanta compartirla con quienes la van a disfrutar.',
    gradient: 'from-emerald-400 to-teal-500',
    verified: true,
  },
  {
    initials: 'SL',
    name: 'Sophie Laurent',
    title: 'Superanfitriona',
    location: 'Islas Baleares, Ibiza',
    since: 'Anfitriona desde 2020',
    properties: 6,
    rating: 5.0,
    reviews: 158,
    specialty: 'Apartamentos de diseño y villas de lujo contemporáneo',
    quote:
      'Soy diseñadora de interiores y aplico ese criterio a cada rincón. La belleza y el confort no son opuestos — son la misma cosa bien hecha.',
    gradient: 'from-violet-400 to-purple-500',
    verified: true,
  },
  {
    initials: 'RA',
    name: 'Roberto Álvarez',
    title: 'Superanfitrión',
    location: 'Islas Canarias, Tenerife',
    since: 'Anfitrión desde 2017',
    properties: 15,
    rating: 4.95,
    reviews: 612,
    specialty: 'Propiedades familiares con piscina y jardín privado',
    quote:
      'Más de 600 familias han descansado en mis propiedades. Cada una merece la misma atención que la primera. Es mi compromiso personal.',
    gradient: 'from-amber-400 to-orange-500',
    verified: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

/**
 * FeaturedHostsSection — Humaniza la plataforma mostrando anfitriones reales.
 * Genera confianza y conexión emocional antes de la primera reserva.
 * Zero backend: datos estáticos + Framer Motion stagger.
 */
export default function FeaturedHostsSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <p className="text-sm font-semibold text-acento-200 uppercase tracking-widest mb-3">
            Personas reales, cuidado real
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Conoce a quienes cuidan tus estancias
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Detrás de cada propiedad hay un anfitrión comprometido con que tu experiencia sea impecable.
            No son hoteles. Son personas que aman lo que hacen.
          </p>
        </motion.div>

        {/* Grid de anfitriones */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {hosts.map((host, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300 flex flex-col gap-4"
            >
              {/* Avatar + badge */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${host.gradient} flex items-center justify-center text-white text-lg font-bold shadow-sm`}
                >
                  {host.initials}
                </div>
                {host.verified && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-medium text-blue-600">Verificado</span>
                  </div>
                )}
              </div>

              {/* Nombre y datos */}
              <div>
                <h3 className="font-bold text-gray-900">{host.name}</h3>
                <p className="text-xs text-acento-200 font-semibold">{host.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{host.location}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                  <span className="font-semibold text-gray-700">{host.rating}</span>
                </span>
                <span className="text-gray-300">·</span>
                <span>{host.reviews} reseñas</span>
                <span className="text-gray-300">·</span>
                <span>{host.properties} propiedades</span>
              </div>

              {/* Especialidad */}
              <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                <span className="font-medium text-gray-700">Especialidad: </span>
                {host.specialty}
              </p>

              {/* Quote */}
              <blockquote className="text-xs text-gray-500 italic leading-relaxed border-l-2 border-gray-200 pl-3">
                &quot;{host.quote}&quot;
              </blockquote>

              {/* Desde */}
              <p className="text-xs text-gray-400 mt-auto">{host.since}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
