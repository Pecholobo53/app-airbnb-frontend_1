// app/buscar/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchProvider, useSearch } from '@/lib/search/search-context';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const {
    query,
    filters,
    sortBy,
    results,
    isLoading,
    updateQuery,
    updateFilters,
    updateSortBy,
    performSearch,
    loadMore,
  } = useSearch();

  // DEBUG: Estado visible en UI
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Cargar parámetros de URL al montar
  useEffect(() => {
    const location = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const adults = searchParams.get('adults');
    const propertyType = searchParams.get('propertyType');
    const amenities = searchParams.get('amenities');

    console.log('📍 [BUSCAR] Parámetros recibidos:', { location, checkIn, checkOut, adults, propertyType, amenities });

    // Construir query
    const newQuery = {
      location: location || undefined,
      checkIn: checkIn ? new Date(checkIn) : undefined,
      checkOut: checkOut ? new Date(checkOut) : undefined,
      guests: {
        adults: adults ? parseInt(adults) : 1,
        children: 0,
        infants: 0
      }
    };

    // Construir filtros
    const newFilters: any = {};
    
    // Mapear propertyType de URL a roomType
    if (propertyType) {
      // Los filtros rápidos usan: house, apartment, villa, cabin
      // Mapearlos a los tipos RoomType correctos
      const roomTypeMap: Record<string, any> = {
        'house': 'house',
        'apartment': 'apartment',
        'villa': 'villa',
        'cabin': 'cabin'
      };
      
      if (roomTypeMap[propertyType]) {
        newFilters.roomType = roomTypeMap[propertyType];
      }
    }

    // Filtro de amenidades
    if (amenities) {
      // Si hay múltiples amenidades separadas por coma, parsearlas
      const amenitiesList = amenities.split(',').map(a => a.trim());
      newFilters.amenities = amenitiesList as any[];
    }

    // DEBUG: Guardar info para mostrar en UI
    setDebugInfo({
      params: { location, checkIn, checkOut, adults, propertyType, amenities },
      timestamp: new Date().toISOString(),
      hasParams: !!(location || checkIn || checkOut || adults || propertyType || amenities),
      query: newQuery,
      filters: newFilters,
      resultsCount: results?.total || 0
    });

    // Actualizar query y filtros
    updateQuery(newQuery);
    if (Object.keys(newFilters).length > 0) {
      updateFilters(newFilters);
    }
    
    // Auto-buscar con los nuevos filtros directamente (solo si hay filtros)
    console.log('🚀 [BUSCAR] Ejecutando búsqueda automática:', { query: newQuery, filters: newFilters });
    const filtersToPass = Object.keys(newFilters).length > 0 ? newFilters : undefined;
    performSearch(newQuery, filtersToPass);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Solo searchParams - updateQuery y performSearch causan loops

  const handleSearch = () => {
    performSearch();
  };

  const handleApplyFilters = () => {
    performSearch();
  };

  const handleSortChange = (newSort: typeof sortBy) => {
    updateSortBy(newSort);
    performSearch();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* DEBUG Panel - Visible siempre para diagnosticar móvil */}
      {debugInfo && (
        <div className="bg-blue-50 border-b border-blue-200 p-3">
          <div className="max-w-7xl mx-auto">
            <details className="text-xs">
              <summary className="cursor-pointer font-semibold text-blue-900">
                🔍 Debug Info (Click para ver)
              </summary>
              <pre className="mt-2 text-xs overflow-x-auto bg-white p-2 rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      {/* Search Bar Section */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar
            query={query}
            onQueryChange={updateQuery}
            onSearch={handleSearch}
            compact
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchResults
          results={results}
          isLoading={isLoading}
          sortBy={sortBy}
          filters={filters}
          onSortChange={handleSortChange}
          onFiltersChange={updateFilters}
          onLoadMore={loadMore}
          onApplyFilters={handleApplyFilters}
        />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <SearchProvider>
      <SearchPageContent />
    </SearchProvider>
  );
}

