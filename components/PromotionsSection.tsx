import { MapPin, Calendar, Users, Percent } from 'lucide-react';

/**
 * Promotions Section Component - Sección de ofertas y promociones
 * TODO: Implementar sistema de filtros para las ofertas
 * FIXME: Validar que todas las imágenes se carguen correctamente
 */

interface PromoCard {
  id: string;
  title: string;
  location: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  imageUrl: string;
  rating: number;
  guests: number;
  category: string;
}

const promotions: PromoCard[] = [
  {
    id: '1',
    title: 'Villa Mediterránea',
    location: 'Barcelona, España',
    originalPrice: 150,
    discountPrice: 89,
    discount: 40,
    imageUrl: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.9,
    guests: 6,
    category: 'Villa'
  },
  {
    id: '2',
    title: 'Loft Moderno',
    location: 'Madrid, España',
    originalPrice: 120,
    discountPrice: 75,
    discount: 35,
    imageUrl: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8,
    guests: 4,
    category: 'Apartamento'
  },
  {
    id: '3',
    title: 'Casa Rural',
    location: 'Toscana, Italia',
    originalPrice: 200,
    discountPrice: 140,
    discount: 30,
    imageUrl: 'https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7,
    guests: 8,
    category: 'Casa'
  }
];

export default function PromotionsSection() {
  return (
    <section id="ofertas" className="py-16 lg:py-24 bg-bg-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-texto-100 mb-6">
            Ofertas <span className="text-gradient">Exclusivas</span>
          </h2>
          <p className="text-lg text-texto-200 max-w-2xl mx-auto">
            Descubre alojamientos únicos con descuentos increíbles. 
            Cada propiedad ha sido cuidadosamente seleccionada para ofrecerte la mejor experiencia.
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <div 
              key={promo.id}
              className="promo-card group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={promo.imageUrl}
                  alt={promo.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-acento-200 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Percent className="w-3 h-3 mr-1" />
                  {promo.discount}% OFF
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-texto-100 px-3 py-1 rounded-full text-sm font-medium">
                  {promo.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-texto-100 group-hover:text-acento-200 transition-colors">
                      {promo.title}
                    </h3>
                    <div className="flex items-center text-texto-200 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {promo.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-acento-200">
                      €{promo.discountPrice}
                    </div>
                    <div className="text-sm text-texto-200 line-through">
                      €{promo.originalPrice}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-sm text-texto-200 mb-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Hasta {promo.guests} huéspedes
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    {promo.rating}
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full btn-primary text-center">
                  Reservar Ahora
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* TODO: Agregar botón "Ver más ofertas" si hay más de 6 promociones */}
        <div className="text-center mt-12">
          <button className="btn-secondary">
            Ver Todas las Ofertas
          </button>
        </div>
      </div>
    </section>
  );
}