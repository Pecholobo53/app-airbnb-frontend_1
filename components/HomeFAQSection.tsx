'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    id: 1,
    question: '¿Cómo funciona el proceso de reserva de principio a fin?',
    answer:
      'Es más sencillo de lo que imaginas. Elige tu alojamiento, selecciona fechas y número de huéspedes, y confirma el pago con tarjeta segura. Recibirás una confirmación instantánea en tu email con todos los detalles: dirección exacta, código de acceso autónomo y contacto directo de tu anfitrión. Sin llamadas, sin esperas, sin intermediarios.',
  },
  {
    id: 2,
    question: '¿Son seguros los pagos? ¿Cómo se protegen mis datos financieros?',
    answer:
      'Todos los pagos se procesan a través de Stripe, el estándar de la industria en pagos online, con cifrado SSL de nivel bancario. Tus datos de tarjeta nunca pasan por nuestros servidores — se transmiten directamente a Stripe de forma encriptada. Nunca almacenamos números de tarjeta. El cargo solo se realiza una vez confirmada la disponibilidad.',
  },
  {
    id: 3,
    question: '¿Qué ocurre si la propiedad no es como se describe al llegar?',
    answer:
      'Activamos nuestra Garantía de Estancia Impecable: si la propiedad no coincide fielmente con la descripción publicada, tienes 24 horas desde el check-in para notificárnoslo. Buscaremos alojamiento alternativo de categoría equivalente o superior sin coste adicional, o te reembolsaremos el importe íntegro. Nuestro equipo está disponible 24/7 para resolverlo.',
  },
  {
    id: 4,
    question: '¿Cuál es la política de cancelación y cómo funcionan los reembolsos?',
    answer:
      'La política estándar permite cancelación gratuita hasta 48 horas antes de la fecha de entrada, con reembolso del 100% del importe pagado. Las cancelaciones posteriores se gestionan caso por caso con nuestro equipo. El reembolso se procesa en 5-10 días hábiles según tu banco. Algunas propiedades tienen política de cancelación flexible extendida — se indica en cada ficha.',
  },
  {
    id: 5,
    question: '¿Puedo publicar mi propiedad y convertirme en anfitrión?',
    answer:
      'Sí. Si tienes una propiedad que cumple nuestros estándares de calidad, puedes unirte a nuestra comunidad de anfitriones. El proceso incluye una auditoría de calidad de 48 puntos, configuración de precios y disponibilidad, y formación en nuestra plataforma de gestión. Los anfitriones verificados acceden a nuestro programa de visibilidad premium. Escríbenos a anfitriones@tudominio.com para empezar.',
  },
  {
    id: 6,
    question: '¿Existe algún programa de fidelidad, descuentos o beneficios para clientes recurrentes?',
    answer:
      'Sí. Los huéspedes que repiten acceden automáticamente a nuestro programa de fidelidad. A partir de la segunda reserva, obtienes un descuento del 5% acumulable. A partir de la quinta, acceso prioritario a propiedades de estreno y ofertas exclusivas antes de que se publiquen. No hay puntos ni tarjetas — el descuento se aplica automáticamente en el checkout con tu email registrado.',
  },
  {
    id: 7,
    question: '¿En qué se diferencia reservar con VoyagerAuMaroc frente a otras plataformas?',
    answer:
      'Tres diferencias clave: (1) Atención humana real — hablamos con personas, no con bots, con respuesta media de 4 minutos. (2) Mejor precio garantizado — si encuentras el mismo alojamiento más barato en otra plataforma en las 24h siguientes, igualamos el precio y te devolvemos un 5% adicional. (3) Calidad certificada — cada propiedad pasa una auditoría de 48 puntos y limpieza profesional certificada antes de cada estancia.',
  },
];

/**
 * HomeFAQSection — 7 preguntas sobre la lógica de negocio.
 * Accordion custom con animación Framer Motion (sin Radix para estilo independiente).
 * Colocado justo encima del Footer en la Home.
 * Zero backend: datos estáticos.
 */
export default function HomeFAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="py-20 lg:py-28 bg-[#071b3e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <p className="text-xs font-bold text-acento-200 uppercase tracking-[0.2em] mb-4">
            Todo lo que necesitas saber
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Respuestas directas sobre cómo funciona todo. Sin letra pequeña.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {faqs.map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-acento-200/40 bg-white/5'
                    : 'border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5'
                }`}
              >
                {/* Trigger */}
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
                  aria-expanded={isOpen}
                >
                  <span className={`text-base font-semibold leading-snug transition-colors duration-200 ${
                    isOpen ? 'text-white' : 'text-gray-200 group-hover:text-white'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen
                      ? 'bg-acento-200 rotate-0'
                      : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    {isOpen
                      ? <Minus className="w-4 h-4 text-white" />
                      : <Plus className="w-4 h-4 text-gray-300" />
                    }
                  </div>
                </button>

                {/* Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6">
                        <div className="h-px bg-white/20 mb-4" />
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA inferior */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="text-gray-500 text-sm mb-4">
            ¿Tienes alguna duda que no está aquí?
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/20 hover:border-acento-200 hover:text-acento-200 px-6 py-3 rounded-xl transition-all duration-200"
          >
            Hablar con el equipo
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
