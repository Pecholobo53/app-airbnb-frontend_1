import { Shield, Clock, Award, HeadphonesIcon } from 'lucide-react';

/**
 * Features Section Component - Beneficios y características destacadas
 * TODO: Agregar animaciones cuando los elementos entren en viewport
 */

const features = [
  {
    icon: Shield,
    title: 'Reserva Segura',
    description: 'Protección completa en cada reserva con nuestro sistema de garantía.'
  },
  {
    icon: Clock,
    title: 'Cancelación Flexible',
    description: 'Cancela sin cargos hasta 24 horas antes de tu llegada.'
  },
  {
    icon: Award,
    title: 'Calidad Garantizada',
    description: 'Solo alojamientos verificados y con las mejores valoraciones.'
  },
  {
    icon: HeadphonesIcon,
    title: 'Soporte 24/7',
    description: 'Atención personalizada disponible en todo momento.'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-bg-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-texto-100 mb-4">
            ¿Por qué elegir Airbnb?
          </h2>
          <p className="text-lg text-texto-200 max-w-2xl mx-auto">
            Más que alojamiento, una experiencia completa respaldada por nuestra garantía de calidad.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}