'use client';

import { Shield, Clock, Award, HeadphonesIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: Shield,
    title: 'Pago Blindado',
    description:
      'Cifrado SSL de nivel bancario en cada transacción. Tu patrimonio, protegido.',
  },
  {
    icon: Clock,
    title: 'Flexibilidad sin Compromisos',
    description:
      'Modifica o cancela sin penalización hasta 48 horas antes de tu llegada.',
  },
  {
    icon: Award,
    title: 'Alojamientos Certificados',
    description:
      'Solo residencias que superan nuestra auditoría de calidad de 48 puntos.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Conserjería Privada 24/7',
    description:
      'Atención personalizada disponible en todo momento, sin esperas ni bots.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-texto-100 mb-4">
            La garantía de una experiencia impecable
          </h2>
          <p className="text-lg text-texto-200 max-w-2xl mx-auto">
            Cada detalle, cuidadosamente supervisado para quienes exigen lo mejor.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center group"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-primario-100 to-acento-100/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-acento-200" />
              </div>

              {/* Content */}
              <h3 className="font-bold text-lg text-texto-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-texto-200 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/buscar"
            className="inline-flex items-center gap-2 bg-acento-200 hover:bg-acento-100 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-acento-200/25 hover:shadow-acento-200/40 transition-all duration-200 group"
          >
            Explorar propiedades verificadas
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}