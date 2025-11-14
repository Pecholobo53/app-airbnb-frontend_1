// app/buscar/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchProvider, useSearch } from '@/lib/search/search-context';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import Header from '@/components/Header';

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

  // Cargar parámetros de URL al montar
  useEffect(() => {
    const location = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const adults = searchParams.get('adults');

    if (location || checkIn || checkOut || adults) {
      updateQuery({
        location: location || undefined,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        guests: {
          adults: adults ? parseInt(adults) : 1,
          children: 0,
          infants: 0
        }
      });
      
      // Auto-buscar si hay parámetros
      performSearch();
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
      <Header />
      
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

