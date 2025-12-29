// app/propiedad/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Property } from '@/types/search';
import { PropertyService } from '@/lib/properties/property-service';
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
        const response = await PropertyService.getPropertyById(propertyId);
        
        console.log('🔍 [PROPERTY DETAIL] Response recibida:', {
          success: response.success,
          hasData: !!response.data,
          dataType: typeof response.data,
          dataKeys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : 'N/A',
          error: response.error,
          fullResponse: JSON.stringify(response, null, 2),
        });
        
        if (response.success && response.data) {
          // Validar que response.data sea un objeto válido
          if (typeof response.data !== 'object' || response.data === null || Array.isArray(response.data)) {
            console.error('❌ [PROPERTY DETAIL] response.data no es un objeto válido:', {
              type: typeof response.data,
              isArray: Array.isArray(response.data),
              value: response.data,
            });
            setError('Error: La respuesta del servidor no tiene el formato esperado. Por favor, intenta de nuevo.');
            setIsLoading(false);
            return;
          }
          
          // Validar que al menos tenga un ID
          if (!response.data.id) {
            console.error('❌ [PROPERTY DETAIL] La propiedad no tiene ID:', {
              data: response.data,
              dataKeys: Object.keys(response.data),
            });
            // Intentar usar el propertyId de la URL como fallback
            if (propertyId) {
              console.warn('⚠️ [PROPERTY DETAIL] Usando propertyId de la URL como fallback:', propertyId);
              response.data.id = propertyId;
            } else {
              setError('Error: La propiedad recibida no tiene un ID válido. Por favor, intenta de nuevo.');
              setIsLoading(false);
              return;
            }
          }
          
          // Normalizar datos de la propiedad para asegurar que todos los campos opcionales tengan valores por defecto
          const normalizedProperty: Property = {
            ...response.data,
            // Asegurar que siempre tenga un ID
            id: response.data.id || propertyId,
            // Asegurar que rating tenga valores por defecto
            rating: response.data.rating || {
              overall: 0,
              reviewCount: 0,
              breakdown: {
                cleanliness: 0,
                accuracy: 0,
                communication: 0,
                location: 0,
                checkIn: 0,
                value: 0
              }
            },
            // Asegurar que amenities sea un array
            amenities: Array.isArray(response.data.amenities) ? response.data.amenities : [],
            // Asegurar que images sea un array
            images: Array.isArray(response.data.images) ? response.data.images : [],
            // Asegurar que location tenga valores por defecto
            location: response.data.location ? {
              ...response.data.location,
              city: response.data.location.city || 'Ciudad no especificada',
              country: response.data.location.country || 'País no especificado',
              region: response.data.location.region || '',
              coordinates: response.data.location.coordinates || { lat: 0, lng: 0 }
            } : {
              city: 'Ciudad no especificada',
              country: 'País no especificado',
              region: '',
              coordinates: { lat: 0, lng: 0 }
            },
            // Asegurar que capacity tenga valores por defecto
            capacity: response.data.capacity || {
              guests: 1,
              bedrooms: 1,
              beds: 1,
              bathrooms: 1
            },
            // Asegurar que pricing tenga valores por defecto
            pricing: response.data.pricing || {
              basePrice: 0,
              currency: 'EUR',
              cleaningFee: 0,
              serviceFee: 0
            },
            // Asegurar que availability tenga valores por defecto
            availability: response.data.availability || {
              minNights: 1,
              maxNights: 365,
              instantBook: false,
              checkInTime: '15:00',
              checkOutTime: '11:00'
            },
            // Asegurar que host tenga valores por defecto
            host: response.data.host || {
              id: 'unknown',
              name: 'Anfitrión',
              avatar: '/placeholder-avatar.png',
              isSuperhost: false,
              joinedDate: new Date(),
              responseTime: '',
              responseRate: 0
            }
          };
          
          console.log('✅ [PROPERTY DETAIL] Propiedad normalizada:', {
            id: normalizedProperty.id,
            title: normalizedProperty.title,
            hasRating: !!normalizedProperty.rating,
            hasAmenities: Array.isArray(normalizedProperty.amenities),
            hasImages: Array.isArray(normalizedProperty.images),
            imagesCount: Array.isArray(normalizedProperty.images) ? normalizedProperty.images.length : 0,
            imagesPreview: Array.isArray(normalizedProperty.images) && normalizedProperty.images.length > 0 
              ? normalizedProperty.images[0].substring(0, 50) + '...' 
              : 'No hay imágenes',
            hasLocation: !!normalizedProperty.location,
            hasHost: !!normalizedProperty.host,
          });
          
          setProperty(normalizedProperty);
        } else {
          // Mensajes de error más descriptivos para el usuario
          const errorCode = response.error?.code;
          let errorMessage = 'Propiedad no encontrada';
          
          if (errorCode === 'NOT_FOUND') {
            errorMessage = 'Lo sentimos, no pudimos encontrar esta propiedad. Puede que haya sido eliminada o la URL sea incorrecta.';
          } else if (errorCode === 'NETWORK_ERROR') {
            errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.';
          } else if (errorCode === 'UNAUTHORIZED') {
            errorMessage = 'No tienes permisos para ver esta propiedad.';
          } else if (response.error?.message) {
            errorMessage = response.error.message;
          }
          
          setError(errorMessage);
        }
      } catch (err) {
        console.error('Error cargando propiedad:', err);
        const errorMessage = err instanceof Error 
          ? `Error al cargar la propiedad: ${err.message}`
          : 'Error inesperado al cargar la propiedad. Por favor, intenta de nuevo.';
        setError(errorMessage);
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

  // Mostrar error si existe y no hay property
  if (error && !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error}
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
  
  // Validar que property exista y tenga ID (después de normalización debería tenerlo siempre)
  if (!property || !property.id) {
    console.error('❌ [PROPERTY DETAIL] Property inválida:', {
      hasProperty: !!property,
      hasId: property?.id ? true : false,
      propertyKeys: property ? Object.keys(property) : [],
    });
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Error: Datos de propiedad incompletos'}
          </h2>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar los datos de la propiedad. Por favor, intenta de nuevo.
          </p>
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
        <PropertyGallery 
          images={Array.isArray(property.images) ? property.images : []} 
          title={property.title || 'Propiedad sin título'} 
        />
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
            {property.amenities && (
              <AmenitiesList amenities={property.amenities} />
            )}

            {/* Anfitrión */}
            {property.host && (
              <HostSection host={property.host} />
            )}

            {/* Reviews */}
            <ReviewsList
              propertyId={property.id}
              initialRating={property.rating?.overall || 0}
              initialReviewCount={property.rating?.reviewCount || 0}
            />

            {/* Mapa */}
            {property.location && (
              <PropertyMap location={property.location} />
            )}

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

