'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  HeadphonesIcon,
  BadgeCheck,
  Lock,
  RefreshCcw,
} from 'lucide-react';

const badges = [
  {
    icon: Lock,
    title: 'Pago 100% Seguro',
    description: 'Cifrado SSL de nivel bancario. Tu información financiera nunca está en riesgo.',
  },
  {
    icon: Sparkles,
    title: 'Limpieza de Excepción',
    description: 'Protocolo de higiene profesional certificado antes de cada estancia.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Atención 24/7',
    description: 'Conserjería privada disponible en todo momento, sin esperas.',
  },
  {
    icon: BadgeCheck,
    title: 'Propiedades Verificadas',
    description: 'Cada alojamiento pasa nuestra auditoría de calidad de 48 puntos.',
  },
  {
    icon: RefreshCcw,
    title: 'Cancelación Flexible',
    description: 'Modifica o cancela sin penalización hasta 48h antes de tu llegada.',
  },
  {
    icon: ShieldCheck,
    title: 'Protección Total',
    description: 'Garantía de reembolso completo si la propiedad no coincide con la descripción.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

/**
 * TrustBadges — Sección de garantías y seguridad para la página de detalle.
 * Zero backend: datos estáticos con iconos de Lucide y animaciones Framer Motion.
 * Orientado a perfil premium/lujo: lenguaje de confianza y exclusividad.
 */
export default function TrustBadges() {
  return (
    <section className="py-10 border-t border-gray-100">
      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Reserve con total confianza
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Cada reserva está respaldada por nuestra Garantía de Excelencia.
        </p>
      </div>

      {/* Grid de badges */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {badges.map((badge) => (
          <motion.div
            key={badge.title}
            variants={itemVariants}
            className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-acento-200/40 hover:border-acento-200 hover:bg-gray-100 transition-all duration-200"
          >
            {/* Icono */}
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <badge.icon className="w-5 h-5 text-acento-200" />
            </div>

            {/* Texto */}
            <div>
              <p className="text-base sm:text-sm font-semibold text-gray-900">{badge.title}</p>
              <p className="text-sm sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                {badge.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
