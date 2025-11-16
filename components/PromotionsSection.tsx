'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users, Percent, Star } from 'lucide-react';
import { Property } from '@/types/search';
import { MockSearchService } from '@/lib/search/mock-search-service';

/**
 * Promotions Section Component - Sección de ofertas y promociones
 * Muestra propiedades destacadas con descuentos
 */
export default function PromotionsSection() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        setIsLoading(true);
        const response = await MockSearchService.getFeaturedProperties(6);
        if (response.success && response.data) {
          setFeaturedProperties(response.data);
        }
      } catch (error) {
        console.error('Error cargando propiedades destacadas:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFeatured();
  }, []);

  // Calcular descuento (simulado - 30-40% para propiedades destacadas)
  // Usa el ID de la propiedad para generar un descuento determinístico
  const calculateDiscount = (property: Property) => {
    if (!property.featured) {
      return { discount: 0, originalPrice: property.pricing.basePrice, discountPrice: property.pricing.basePrice };
    }
    
    // Generar descuento determinístico basado en el ID
    const hash = property.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const discount = 30 + (hash % 11); // 30-40%
    const originalPrice = Math.round(property.pricing.basePrice / (1 - discount / 100));
    
    return {
      discount,
      originalPrice,
      discountPrice: property.pricing.basePrice
    };
  };

  if (isLoading) {
    return (
      <section id="ofertas" className="py-16 lg:py-24 bg-bg-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-texto-100 mb-6">
              Ofertas <span className="text-gradient">Exclusivas</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-2xl" />
                <div className="h-32 bg-gray-200 rounded-b-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProperties.length === 0) {
    return null;
  }
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
          {featuredProperties.map((property, index) => {
            const { discount, originalPrice, discountPrice } = calculateDiscount(property);
            const roomTypeLabels: Record<string, string> = {
              'villa': 'Villa',
              'apartment': 'Apartamento',
              'house': 'Casa',
              'loft': 'Loft',
              'cabin': 'Cabaña',
              'hotel': 'Hotel',
              'cottage': 'Casa de campo',
              'castle': 'Castillo'
            };

            return (
              <Link
                key={property.id}
                href={`/propiedad/${property.id}`}
                className="promo-card group cursor-pointer block"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    width={600}
                    height={256}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 bg-acento-200 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Percent className="w-3 h-3 mr-1" />
                    {discount}% OFF
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-texto-100 px-3 py-1 rounded-full text-sm font-medium">
                    {roomTypeLabels[property.roomType] || property.roomType}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-texto-100 group-hover:text-acento-200 transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-texto-200 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.location.city}, {property.location.country}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-acento-200">
                        €{discountPrice}
                      </div>
                      <div className="text-sm text-texto-200 line-through">
                        €{originalPrice}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between text-sm text-texto-200 mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Hasta {property.capacity.guests} huéspedes
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 mr-1" />
                      {property.rating.overall}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="w-full btn-primary text-center">
                    Ver Detalles
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Ver más ofertas */}
        <div className="text-center mt-12">
          <Link href="/buscar" className="btn-secondary inline-block">
            Ver Todas las Ofertas
          </Link>
        </div>
      </div>
    </section>
  );
}