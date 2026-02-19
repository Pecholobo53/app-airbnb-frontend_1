'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MessageCircle } from 'lucide-react';

const faqs = [
  {
    id: 'check-in',
    question: '¿Cómo recibo las llaves? ¿Hay alguien esperándome?',
    answer:
      'Disponemos de check-in autónomo y sin contacto mediante caja de seguridad con código personal. Recibirás todas las instrucciones por email 24h antes de tu llegada. Sin esperas, sin coordinación de horarios — llegas cuando tú decides.',
  },
  {
    id: 'cancelacion',
    question: '¿Cuál es la política de cancelación?',
    answer:
      'Ofrecemos cancelación gratuita hasta 48 horas antes de la fecha de entrada. En caso de cancelación posterior, se aplica un cargo equivalente a la primera noche. Tu tranquilidad es nuestra prioridad — si los planes cambian, estamos aquí para ayudarte.',
  },
  {
    id: 'wifi',
    question: '¿Hay Wi-Fi? ¿Puedo trabajar cómodamente desde aquí?',
    answer:
      'Fibra óptica de alta velocidad (mínimo 300 Mbps) garantizada en toda la propiedad. Espacio de trabajo habilitado con escritorio ergonómico. Muchos de nuestros huéspedes combinan trabajo y descanso con total comodidad.',
  },
  {
    id: 'limpieza',
    question: '¿Qué estándares de limpieza aplican?',
    answer:
      'Protocolo de limpieza profesional de 48 puntos certificado, que incluye desinfección de todas las superficies, ropa de cama de hotel (400 hilos), toallas nuevas y amenities de cortesía. La propiedad se inspecciona antes de cada estancia.',
  },
  {
    id: 'mascotas',
    question: '¿Se aceptan mascotas?',
    answer:
      'Algunas de nuestras propiedades son pet-friendly. Verás el icono "Mascotas bienvenidas" en el listado correspondiente. Si tienes alguna duda puntual, nuestro equipo de conserjería está disponible 24/7 para asesorarte.',
  },
  {
    id: 'problemas',
    question: '¿Qué ocurre si surge algún problema durante la estancia?',
    answer:
      'Cuenta con soporte de conserjería privada disponible las 24 horas, los 7 días de la semana. Si la propiedad no cumple con lo descrito, activamos nuestra Garantía de Estancia Impecable: te buscamos alojamiento alternativo de categoría equivalente o superior sin coste adicional.',
  },
];

/**
 * FAQSection — Preguntas frecuentes con accordion Radix UI.
 * Resuelve las 6 principales objeciones antes de la reserva.
 * Zero backend: datos estáticos + Framer Motion para la entrada.
 */
export default function FAQSection() {
  return (
    <section className="py-10 border-t border-gray-100">
      {/* Encabezado */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle className="w-5 h-5 text-acento-200" />
          <h2 className="text-xl font-semibold text-gray-900">
            Preguntas frecuentes
          </h2>
        </div>
        <p className="text-sm text-gray-500">
          Todo lo que necesitas saber antes de confirmar tu reserva.
        </p>
      </motion.div>

      {/* Accordion */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Accordion type="single" collapsible className="divide-y divide-gray-100 border-y border-gray-100">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border-0 py-1"
            >
              <AccordionTrigger className="text-left text-sm font-medium text-gray-900 hover:no-underline hover:text-acento-200 py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 leading-relaxed pb-5 pr-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
