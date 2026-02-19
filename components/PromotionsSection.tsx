'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users, Percent, Star } from 'lucide-react';
import { Property } from '@/types/search';
import { PropertyService } from '@/lib/properties/property-service';

/**
 * Promotions Section Component - Sección de ofertas y promociones
 * Muestra propiedades destacadas con descuentos
 */
export default function PromotionsSection() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // Helper para determinar si es Base64
  const isBase64 = (src: string) => {
    return src.startsWith('data:image/') || src.startsWith('data:image%2F');
  };
  
  // Placeholder image
  const placeholderImage = '/placeholder-property.jpg';
  
  const handleImageError = (propertyId: string, isPlaceholder: boolean = false) => {
    // Solo marcar error si NO es el placeholder (evitar bucles infinitos)
    if (!isPlaceholder) {
      setImageErrors(prev => {
        // Solo agregar si no está ya en el set (evitar re-renders innecesarios)
        if (prev.has(propertyId)) {
          return prev;
        }
        const newSet = new Set(prev);
        newSet.add(propertyId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    async function loadFeatured() {
      try {
        setIsLoading(true);
        // Buscar propiedades destacadas usando el servicio real
        // Nota: El backend debería soportar un filtro 'featured' o retornar propiedades destacadas
        const response = await PropertyService.searchProperties({
          query: {},
          filters: {},
          sortBy: 'recommended',
          page: 1,
          perPage: 6
        });
        
        if (response.success && response.data) {
          // Filtrar propiedades destacadas si el backend no las filtra automáticamente
          const properties = response.data?.properties ?? [];
          const featured = properties.filter(p => p.featured === true);
          setFeaturedProperties(featured.length > 0 ? featured.slice(0, 6) : properties.slice(0, 6));
        }
      } catch (error) {
        console.error('Error cargando propiedades destacadas');
      } finally {
        setIsLoading(false);
      }
    }

    loadFeatured();
  }, []);

  // Calcular descuento fijo de 30% para todas las propiedades en ofertas exclusivas
  const calculateDiscount = (property: Property) => {
    const discount = 30; // 30% fijo para todas las ofertas exclusivas
    const discountPrice = Math.round(property.pricing.basePrice * (1 - discount / 100)); // Precio con descuento
    const originalPrice = property.pricing.basePrice; // Precio original (sin descuento)
    
    return {
      discount,
      originalPrice,
      discountPrice
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
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
                className="promo-card group cursor-pointer flex flex-col h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden flex-shrink-0 bg-gray-100">
                  {(() => {
                    const hasError = imageErrors.has(property.id);
                    const originalImage = property.images && property.images.length > 0 && property.images[0] 
                      ? property.images[0].trim() 
                      : null;
                    
                    // Validar que la imagen no esté vacía o sea inválida
                    const isValidImage = originalImage && 
                      originalImage !== '' && 
                      (originalImage.startsWith('http') || originalImage.startsWith('data:image') || originalImage.startsWith('/'));
                    
                    const imageSrc = hasError || !isValidImage
                      ? placeholderImage 
                      : originalImage;
                    const isPlaceholder = imageSrc === placeholderImage || hasError || !isValidImage;
                    
                    // Si no hay imagen válida, mostrar placeholder directamente
                    if (!isValidImage && !hasError) {
                    }
                    
                    if (isBase64(imageSrc)) {
                      return (
                        <img
                          src={imageSrc}
                          alt={property.title}
                          className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-500"
                          onError={() => {
                            handleImageError(property.id, isPlaceholder);
                          }}
                        />
                      );
                    }
                    return (
                      <Image
                        src={imageSrc}
                        alt={property.title}
                        width={600}
                        height={256}
                        className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-500"
                        onError={() => {
                          handleImageError(property.id, isPlaceholder);
                        }}
                        unoptimized={imageSrc.startsWith('http://localhost') || imageSrc.includes('localhost')}
                      />
                    );
                  })()}
                  
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
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-3 flex-shrink-0">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-bold text-lg text-texto-100 group-hover:text-acento-200 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-texto-200 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {property.location.city}, {(property.location.country || '').replace(/Espa a/g, 'España').replace(/Espana/g, 'España')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-acento-200">
                        €{discountPrice}
                      </div>
                      <div className="text-sm text-texto-200 line-through">
                        €{originalPrice}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between text-sm text-texto-200 mb-4 flex-shrink-0">
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
                  <div className="w-full btn-primary text-center mt-auto">
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