// components/search/SearchResults.tsx
'use client';

import { SearchResults as SearchResultsType, SortOption, SearchFilters } from '@/types/search';
import { Button } from '@/components/ui/button';
import PropertyGrid from './PropertyGrid';
import SortSelector from './SortSelector';
import FilterPanel from './FilterPanel';
import { Loader2 } from 'lucide-react';

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
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF385C] mx-auto mb-4" />
          <p className="text-gray-500">Buscando propiedades...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
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

