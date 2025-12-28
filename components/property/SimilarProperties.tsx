// components/property/SimilarProperties.tsx
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '@/types/search';
import { PropertyService } from '@/lib/properties/property-service';
import PropertyCard from '@/components/search/PropertyCard';

interface SimilarPropertiesProps {
  currentProperty: Property;
}

/**
 * Propiedades Similares
 * Carrusel horizontal de propiedades en la misma ubicación
 */
export default function SimilarProperties({ currentProperty }: SimilarPropertiesProps) {
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    async function loadSimilar() {
      try {
        setIsLoading(true);
        
        // Obtener propiedades similares usando el endpoint de la API
        const response = await PropertyService.getSimilarProperties(currentProperty.id, 6);

        if (response.success && response.data) {
          setSimilarProperties(response.data.properties);
        }
      } catch (error) {
        console.error('Error cargando propiedades similares:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSimilar();
  }, [currentProperty.id, currentProperty.location.city]);

  const scrollLeft = () => {
    const container = document.getElementById('similar-properties-container');
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('similar-properties-container');
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-shrink-0 w-80 h-96 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (similarProperties.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        Propiedades similares
      </h2>

      {/* Carrusel */}
      <div className="relative">
        {/* Botón izquierdo */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>

        {/* Contenedor scrollable */}
        <div
          id="similar-properties-container"
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {similarProperties.map((property) => (
            <div
              key={property.id}
              className="flex-shrink-0 w-80"
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        {/* Botón derecho */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* Indicador de scroll */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Desliza para ver más propiedades
      </p>
    </div>
  );
}

