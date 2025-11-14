// components/search/PropertyCard.tsx
'use client';

import { useState } from 'react';
import { Heart, Star, Users, Bed, MapPin, Zap } from 'lucide-react';
import { Property } from '@/types/search';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(
    user?.favorites.includes(property.id) || false
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para guardar favoritos');
      return;
    }

    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos');
  };

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

  return (
    <Link href={`/propiedad/${property.id}`} className="group block">
      <div className="rounded-xl overflow-hidden transition-all hover:shadow-lg">
        {/* Image Carousel */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={property.images[currentImageIndex]}
            alt={property.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all z-10"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? 'fill-[#FF385C] text-[#FF385C]' : 'text-gray-700'
              }`}
            />
          </button>

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
                {property.location.city}, {property.location.country}
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
              {property.capacity.bedrooms} hab
            </span>
          </div>

          {/* Price */}
          <div className="pt-1">
            <p className="text-sm">
              <span className="font-bold text-gray-900">
                €{property.pricing.basePrice}
              </span>
              <span className="text-gray-500"> / noche</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

