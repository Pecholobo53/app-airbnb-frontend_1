import { ArrowRight, Star } from 'lucide-react';

/**
 * Hero Section Component - Sección principal con promoción destacada
 * TODO: Implementar animaciones de entrada para mejorar UX
 * FIXME: Optimizar imágenes para diferentes dispositivos
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-bg-100 to-primario-100/30 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-acento-100/20 text-acento-200 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Oferta Limitada - Solo por tiempo limitado
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-texto-100 leading-tight">
                Vive experiencias
                <span className="text-gradient block">
                  únicas
                </span>
              </h1>
              <p className="text-lg text-texto-200 leading-relaxed">
                Descubre alojamientos extraordinarios con hasta <strong>40% de descuento</strong>. 
                Encuentra tu próximo destino perfecto y crea recuerdos inolvidables.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8">
              <div>
                <div className="text-2xl font-bold text-texto-100">2M+</div>
                <div className="text-sm text-texto-200">Huéspedes satisfechos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-texto-100">150K+</div>
                <div className="text-sm text-texto-200">Alojamientos únicos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-texto-100">4.8★</div>
                <div className="text-sm text-texto-200">Valoración promedio</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary flex items-center justify-center group">
                Explorar Ofertas
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary">
                Ver Destinos Populares
              </button>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            {/* TODO: Reemplazar con imagen real de Airbnb siguiendo las guías de la URL proporcionada */}
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Alojamiento único de Airbnb"
                className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs animate-slide-in">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-acento-200 to-acento-100 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-texto-100">Casa Vista Mar</div>
                    <div className="text-sm text-texto-200">Santorini, Grecia</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-texto-100">€89/noche</div>
                  <div className="text-sm text-acento-200 font-medium">40% OFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}