// app/propiedad/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Property } from '@/types/search';
import { MockSearchService } from '@/lib/search/mock-search-service';
import PropertyGallery from '@/components/property/PropertyGallery';
import PropertyHeader from '@/components/property/PropertyHeader';
import PropertyInfo from '@/components/property/PropertyInfo';
import HostSection from '@/components/property/HostSection';
import AmenitiesList from '@/components/property/AmenitiesList';
import ReviewsList from '@/components/property/ReviewsList';
import PriceCalculator from '@/components/property/PriceCalculator';
import PropertyMap from '@/components/property/PropertyMap';
import PropertyRules from '@/components/property/PropertyRules';
import SimilarProperties from '@/components/property/SimilarProperties';
import Footer from '@/components/Footer';

/**
 * Página de Detalle de Propiedad
 * Muestra información completa de una propiedad específica
 */
export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperty() {
      if (!propertyId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await MockSearchService.getPropertyById(propertyId);
        
        if (response.success && response.data) {
          setProperty(response.data);
        } else {
          setError('Propiedad no encontrada');
        }
      } catch (err) {
        console.error('Error cargando propiedad:', err);
        setError('Error al cargar la propiedad');
      } finally {
        setIsLoading(false);
      }
    }

    loadProperty();
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Propiedad no encontrada'}
          </h2>
          <a
            href="/buscar"
            className="text-[#FF385C] hover:underline"
          >
            Volver a la búsqueda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Galería de Imágenes (Full Width) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertyGallery images={property.images} title={property.title} />
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal - Info (2/3) */}
          <div className="lg:col-span-2">
            {/* Header */}
            <PropertyHeader property={property} />

            {/* Información Básica */}
            <PropertyInfo property={property} />

            {/* Amenidades */}
            <AmenitiesList amenities={property.amenities} />

            {/* Anfitrión */}
            <HostSection host={property.host} />

            {/* Reviews */}
            <ReviewsList
              propertyId={property.id}
              initialRating={property.rating.overall}
              initialReviewCount={property.rating.reviewCount}
            />

            {/* Mapa */}
            <PropertyMap location={property.location} />

            {/* Reglas */}
            <PropertyRules property={property} />
          </div>

          {/* Columna Lateral - Calculadora de Precio (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PriceCalculator property={property} />
            </div>
          </div>
        </div>

        {/* Propiedades Similares (Full Width) */}
        <SimilarProperties currentProperty={property} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

