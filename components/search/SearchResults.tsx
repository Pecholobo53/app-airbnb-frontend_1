// components/search/SearchResults.tsx
'use client';

import { SearchResults as SearchResultsType, SortOption, SearchFilters } from '@/types/search';
import { Button } from '@/components/ui/button';
import PropertyGrid from './PropertyGrid';
import SortSelector from './SortSelector';
import FilterPanel from './FilterPanel';
import { Loader2, Search } from 'lucide-react';
import { PropertyGridSkeleton } from './PropertyCardSkeleton';

interface SearchResultsProps {
  results: SearchResultsType | null;
  isLoading: boolean;
  sortBy: SortOption;
  filters: SearchFilters;
  onSortChange: (sort: SortOption) => void;
  onFiltersChange: (filters: SearchFilters) => void;
  onLoadMore?: () => void;
  onApplyFilters: () => void;
}

export default function SearchResults({
  results,
  isLoading,
  sortBy,
  filters,
  onSortChange,
  onFiltersChange,
  onLoadMore,
  onApplyFilters,
}: SearchResultsProps) {
  if (isLoading && !results) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-40" />
          <div className="h-9 bg-gray-200 animate-pulse rounded w-28" />
        </div>
        <PropertyGridSkeleton count={8} />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Busca tu próximo destino
          </h3>
          <p className="text-gray-500">
            Usa los filtros de arriba para encontrar el alojamiento perfecto
          </p>
        </div>
      </div>
    );
  }

  // Estado cuando no hay resultados
  if (results.total === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No encontramos alojamientos
          </h3>
          <p className="text-gray-500 mb-6">
            Intenta ajustar tus filtros de búsqueda o cambiar la ubicación
          </p>
          <Button
            onClick={onApplyFilters}
            variant="outline"
            className="mx-auto"
          >
            Limpiar filtros
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros y ordenamiento */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {results.total} {results.total === 1 ? 'alojamiento' : 'alojamientos'}
          </h2>
          {results.total > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Mostrando {results.properties.length} de {results.total}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <FilterPanel
            filters={filters}
            onFiltersChange={onFiltersChange}
            onApply={onApplyFilters}
          />
          <SortSelector value={sortBy} onChange={onSortChange} />
        </div>
      </div>

      {/* Grid de propiedades */}
      <PropertyGrid properties={results.properties} />

      {/* Load More Button */}
      {results.hasMore && onLoadMore && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={onLoadMore}
            variant="outline"
            className="px-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Cargando...
              </>
            ) : (
              'Ver más resultados'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

