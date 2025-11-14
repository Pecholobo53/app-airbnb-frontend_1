// lib/search/search-context.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { SearchQuery, SearchFilters, SearchResults, SortOption, SearchState } from '@/types/search';
import { MockSearchService } from './mock-search-service';
import { toast } from 'sonner';

interface SearchContextType extends SearchState {
  updateQuery: (query: Partial<SearchQuery>) => void;
  updateFilters: (filters: SearchFilters) => void;
  updateSortBy: (sortBy: SortOption) => void;
  performSearch: () => Promise<void>;
  loadMore: () => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SearchState>({
    query: {
      guests: { adults: 1, children: 0, infants: 0 }
    },
    filters: {},
    sortBy: 'recommended',
    results: null,
    isLoading: false,
    error: null,
  });

  const updateQuery = (newQuery: Partial<SearchQuery>) => {
    setState(prev => ({
      ...prev,
      query: { ...prev.query, ...newQuery }
    }));
  };

  const updateFilters = (filters: SearchFilters) => {
    setState(prev => ({ ...prev, filters }));
  };

  const updateSortBy = (sortBy: SortOption) => {
    setState(prev => ({ ...prev, sortBy }));
  };

  const performSearch = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await MockSearchService.searchProperties({
        query: state.query,
        filters: state.filters,
        sortBy: state.sortBy,
        page: 1,
        perPage: 20
      });

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          results: response.data!,
          isLoading: false
        }));

        if (response.data.total === 0) {
          toast.info('No se encontraron resultados', {
            description: 'Intenta modificar tus criterios de búsqueda'
          });
        }
      } else {
        throw new Error(response.error?.message || 'Error en la búsqueda');
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al buscar propiedades'
      }));
      toast.error('Error al buscar propiedades');
    }
  };

  const loadMore = async () => {
    if (!state.results || !state.results.hasMore || state.isLoading) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const nextPage = state.results.page + 1;
      const response = await MockSearchService.searchProperties({
        query: state.query,
        filters: state.filters,
        sortBy: state.sortBy,
        page: nextPage,
        perPage: state.results.perPage
      });

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          results: {
            ...response.data!,
            properties: [...(prev.results?.properties || []), ...response.data!.properties]
          },
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error al cargar más:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('Error al cargar más resultados');
    }
  };

  const clearSearch = () => {
    setState({
      query: {
        guests: { adults: 1, children: 0, infants: 0 }
      },
      filters: {},
      sortBy: 'recommended',
      results: null,
      isLoading: false,
      error: null,
    });
  };

  return (
    <SearchContext.Provider
      value={{
        ...state,
        updateQuery,
        updateFilters,
        updateSortBy,
        performSearch,
        loadMore,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

