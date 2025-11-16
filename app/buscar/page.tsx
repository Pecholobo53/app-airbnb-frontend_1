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

    console.log('📍 [BUSCAR] Parámetros recibidos:', { location, checkIn, checkOut, adults });

    // DEBUG: Guardar info para mostrar en UI
    setDebugInfo({
      params: { location, checkIn, checkOut, adults },
      timestamp: new Date().toISOString(),
      hasParams: !!(location || checkIn || checkOut || adults),
      query: query,
      resultsCount: results?.total || 0
    });

    if (location || checkIn || checkOut || adults) {
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
      
      console.log('🔍 [BUSCAR] Query construida:', newQuery);
      updateQuery(newQuery);
      
      // Auto-buscar pasando el query directamente (no esperar a que state se actualice)
      console.log('🚀 [BUSCAR] Ejecutando búsqueda automática con query:', newQuery);
      performSearch(newQuery);
    }
  }, [searchParams]);

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

