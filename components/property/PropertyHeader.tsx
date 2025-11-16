// components/property/PropertyHeader.tsx
'use client';

import { useState } from 'react';
import { Heart, Share2, MapPin, Star } from 'lucide-react';
import { Property } from '@/types/search';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PropertyHeaderProps {
  property: Property;
}

/**
 * Header de Propiedad
 * Título, ubicación, rating y botones de acción
 */
export default function PropertyHeader({ property }: PropertyHeaderProps) {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Mira esta propiedad increíble en ${property.location.city}`,
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error compartiendo:', error);
      toast.error('Error al compartir');
    }
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para guardar favoritos');
      return;
    }
    
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos'
    );
  };

  return (
    <div className="mb-6">
      {/* Título */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        {property.title}
      </h1>

      {/* Info bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Ubicación y Rating */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current text-gray-900" />
            <span className="font-semibold">{property.rating.overall}</span>
            <span className="text-gray-600">
              ({property.rating.reviewCount} reviews)
            </span>
          </div>

          <span className="text-gray-400">•</span>

          {/* Ubicación */}
          <div className="flex items-center gap-1 text-gray-700">
            <MapPin className="w-4 h-4" />
            <span className="underline cursor-pointer hover:text-gray-900">
              {property.location.city}, {property.location.country}
            </span>
          </div>

          {/* Superhost badge */}
          {property.host.isSuperhost && (
            <>
              <span className="text-gray-400">•</span>
              <span className="px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                ⭐ Superanfitrión
              </span>
            </>
          )}
        </div>

        {/* Right: Botones de acción */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartir</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            className="flex items-center gap-2"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-[#FF385C] text-[#FF385C]' : ''
              }`}
            />
            <span className="hidden sm:inline">Guardar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

