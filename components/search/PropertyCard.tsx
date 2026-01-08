// components/search/PropertyCard.tsx
'use client';

import { useState } from 'react';
import { Star, Users, Bed, MapPin, Zap } from 'lucide-react';
import { Property } from '@/types/search';
import Image from 'next/image';
import Link from 'next/link';
import { UI_LABELS } from '@/lib/constants';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import { normalizeText } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Helper para determinar si es Base64
  const isBase64 = (src: string) => {
    return src.startsWith('data:image/') || src.startsWith('data:image%2F');
  };

  // Placeholder image
  const placeholderImage = '/placeholder-property.jpg';

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleImageError = (isPlaceholder: boolean = false) => {
    // Solo marcar error si NO es el placeholder (evitar bucles infinitos)
    if (!isPlaceholder) {
      setImageErrors(prev => {
        // Solo agregar si no está ya en el set (evitar re-renders innecesarios)
        if (prev.has(currentImageIndex)) {
          return prev;
        }
        const newSet = new Set(prev);
        newSet.add(currentImageIndex);
        return newSet;
      });
      console.warn(`⚠️ [PROPERTY CARD] Error cargando imagen ${currentImageIndex} de propiedad ${property.id}`);
    }
  };

  // Obtener imagen actual o fallback
  const currentImage = property.images[currentImageIndex] || placeholderImage;
  const hasError = imageErrors.has(currentImageIndex);
  const imageSrc = hasError ? placeholderImage : currentImage;
  const isPlaceholder = imageSrc === placeholderImage || hasError;

  return (
    <Link href={`/propiedad/${property.id}`} className="group block">
      <div className="rounded-xl overflow-hidden transition-all hover:shadow-lg">
        {/* Image Carousel */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
          {isBase64(imageSrc) ? (
            <img
              src={imageSrc}
              alt={property.title}
              className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
              onError={() => handleImageError(isPlaceholder)}
            />
          ) : (
            <Image
              src={imageSrc}
              alt={property.title}
              fill
              className="object-contain transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => handleImageError(isPlaceholder)}
            />
          )}
          
          {/* Favorite Button */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton propertyId={property.id} size="md" />
          </div>

          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                →
              </button>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'w-4 bg-white' 
                        : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {property.featured && (
              <span className="px-2 py-1 bg-[#FF385C] text-white text-xs font-semibold rounded-md">
                Destacado
              </span>
            )}
            {property.availability.instantBook && (
              <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-md flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Instantánea
              </span>
            )}
          </div>
        </div>

        {/* Property Info */}
        <div className="mt-3 space-y-2">
          {/* Location & Rating */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {normalizeText(property.location.city)}, {normalizeText(property.location.country)}
              </p>
              {property.host.isSuperhost && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  Superanfitrión
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-4 w-4 fill-current text-gray-900" />
              <span className="text-sm font-semibold">
                {property.rating.overall.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">
                ({property.rating.reviewCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm text-gray-700 line-clamp-2 leading-snug">
            {property.title}
          </h3>

          {/* Capacity */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {property.capacity.guests}
            </span>
            <span className="flex items-center gap-1">
              <Bed className="h-3 w-3" />
              {property.capacity.bedrooms} {UI_LABELS.BEDROOMS_SHORT}
            </span>
          </div>

          {/* Price */}
          <div className="pt-1">
            <p className="text-sm">
              <span className="font-bold text-gray-900">
                €{property.pricing.basePrice}
              </span>
              <span className="text-gray-500"> / {UI_LABELS.NIGHTS_SINGLE}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

