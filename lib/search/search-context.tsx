// lib/search/search-context.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { SearchQuery, SearchFilters, SearchResults, SortOption, SearchState } from '@/types/search';
import { PropertyService } from '@/lib/properties/property-service';
import { toast } from 'sonner';

interface SearchContextType extends SearchState {
  updateQuery: (query: Partial<SearchQuery>) => void;
  updateFilters: (filters: SearchFilters) => void;
  updateSortBy: (sortBy: SortOption) => void;
  performSearch: (customQuery?: Partial<SearchQuery>, customFilters?: SearchFilters) => Promise<void>;
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

  const performSearch = async (customQuery?: Partial<SearchQuery>, customFilters?: SearchFilters) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Usar customQuery si se proporciona, sino usar state.query
    const queryToUse = customQuery ? { ...state.query, ...customQuery } : state.query;
    // Usar customFilters si se proporciona, sino usar state.filters
    // Si hay customFilters, reemplazar completamente los filtros (no mergear)
    const filtersToUse = customFilters !== undefined ? customFilters : state.filters;
    

    try {
      const response = await PropertyService.searchProperties({
        query: queryToUse,
        filters: filtersToUse,
        sortBy: state.sortBy,
        page: 1,
        perPage: 20
      });

      if (response.success && response.data) {
        // Filtro adicional por título si hay roomType (por si el backend no filtra correctamente)
        let filteredResults = response.data;
        
        // Filtro especial para "Montaña" - solo mostrar las 3 propiedades específicas de Galicia
        const isMountainFilter = (filtersToUse?.amenities && Array.isArray(filtersToUse.amenities) && filtersToUse.amenities.includes('mountain_view')) ||
                                 (filtersToUse as any)?.category === 'mountain';
        
        if (isMountainFilter) {
          const montanaProperties = (response.data?.properties ?? []).filter(property => {
            const city = (property.location?.city || '').toLowerCase().trim();
            const title = (property.title || '').toLowerCase().trim();
            const region = (property.location?.region || '').toLowerCase().trim();
            
            // Palabras clave para identificar las 3 propiedades de Galicia
            const validCityKeywords = ['cambados', 'santiago', 'compostela', 'muxía', 'muxia'];
            const validTitleKeywords = [
              'cottage rústico',
              'rías baixas',
              'casa de piedra',
              'santiago de compostela',
              'cabaña acogedora',
              'costa da morte'
            ];
            
            // Verificar si la ciudad contiene alguna palabra clave
            const cityMatch = validCityKeywords.some(keyword => city.includes(keyword));
            
            // Verificar si el título contiene alguna palabra clave
            const titleMatch = validTitleKeywords.some(keyword => title.includes(keyword));
            
            // Verificar si la región es Galicia
            const regionMatch = region.includes('galicia');
            
            // Debe cumplir al menos una condición: ciudad, título o región
            return cityMatch || titleMatch || regionMatch;
          });
          
          if (montanaProperties.length > 0) {
            filteredResults = {
              ...response.data,
              properties: montanaProperties,
              total: montanaProperties.length,
              hasMore: false,
            };
          }
        }
        
        if (filtersToUse?.roomType && response.data.properties) {
          const roomType = Array.isArray(filtersToUse.roomType) 
            ? filtersToUse.roomType[0] 
            : filtersToUse.roomType;
          
          // Mapeo de palabras clave en títulos (ordenadas por prioridad)
          const titleKeywords: Record<string, string[]> = {
            'apartment': ['apartamento', 'apartment', 'piso', 'estudio'],
            'house': ['casa', 'house', 'vivienda', 'hogar', 'chalet'],
            'villa': ['villa', 'villas'],
            'cabin': ['cabaña', 'cabin', 'cabañas', 'cabañita'],
            'loft': ['loft', 'lofts', 'ático'],
            'hotel': ['hotel', 'hoteles'],
            'cottage': ['cottage', 'cabaña rústica', 'casa rural'],
            'castle': ['castillo', 'castle', 'palacio'],
          };
          
          // Palabras que excluyen otros tipos (para evitar falsos positivos)
          const exclusionKeywords: Record<string, string[]> = {
            'apartment': ['villa', 'casa completa', 'cabaña', 'hotel'],
            'house': ['apartamento', 'villa', 'cabaña', 'hotel'],
            'villa': ['apartamento', 'casa pequeña', 'cabaña'],
            'cabin': ['apartamento', 'villa', 'casa moderna'],
          };
          
          const keywords = titleKeywords[roomType] || [];
          const exclusions = exclusionKeywords[roomType] || [];
          
          if (keywords.length > 0) {
            const filteredProperties = (response.data?.properties ?? []).filter(property => {
              // Obtener título y descripción
              const title = (property.title || '').toLowerCase();
              const description = (property.description || '').toLowerCase();
              const fullText = `${title} ${description}`;
              
              // Verificar roomType si está disponible (prioridad alta)
              const propertyRoomType = (property.roomType || '').toLowerCase();
              if (propertyRoomType === roomType.toLowerCase()) {
                return true; // Si el roomType coincide, incluir directamente
              }
              
              // Verificar exclusiones primero (si tiene palabras excluidas, no incluir)
              if (exclusions.length > 0) {
                const hasExclusion = exclusions.some(exclusion => 
                  fullText.includes(exclusion.toLowerCase())
                );
                if (hasExclusion) {
                  return false; // Excluir si tiene palabras de otros tipos
                }
              }
              
              // Buscar palabras clave en título o descripción
              const matchesKeywords = keywords.some(keyword => 
                title.includes(keyword) || description.includes(keyword)
              );
              
              return matchesKeywords;
            });
            
            filteredResults = {
              ...response.data,
              properties: filteredProperties,
              total: filteredProperties.length,
              hasMore: false, // No cargar más si filtramos en frontend
            };
            
          }
        }
        
        // Eliminar duplicados por ID y por título+ubicación antes de establecer el estado
        if (filteredResults.properties) {
          const seenIds = new Set<string>();
          const seenTitleLocation = new Set<string>(); // Para detectar duplicados por título y ubicación
          
          const uniqueProperties = filteredResults.properties.filter(property => {
            // Primero verificar por ID (duplicado exacto)
            if (seenIds.has(property.id)) {
              return false;
            }
            
            // Luego verificar por título + ubicación (duplicados visuales)
            const titleLocationKey = `${(property.title || '').toLowerCase().trim()}|${(property.location?.city || '').toLowerCase().trim()}|${(property.location?.country || '').toLowerCase().trim()}`;
            if (seenTitleLocation.has(titleLocationKey)) {
              return false;
            }
            
            seenIds.add(property.id);
            seenTitleLocation.add(titleLocationKey);
            return true;
          });
          
          if (uniqueProperties.length !== filteredResults.properties.length) {
            filteredResults = {
              ...filteredResults,
              properties: uniqueProperties,
              total: uniqueProperties.length,
            };
          }
        }
        
        setState(prev => ({
          ...prev,
          results: filteredResults,
          isLoading: false
        }));

        if (filteredResults.total === 0) {
          toast.info('No se encontraron resultados', {
            description: 'Intenta modificar tus criterios de búsqueda'
          });
        }
      } else {
        throw new Error(response.error?.message || 'Error en la búsqueda');
      }
    } catch (error) {
      console.error('Error en búsqueda');
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
      const response = await PropertyService.searchProperties({
        query: state.query,
        filters: state.filters,
        sortBy: state.sortBy,
        page: nextPage,
        perPage: state.results.perPage
      });

      if (response.success && response.data) {
        // Eliminar duplicados al cargar más resultados (por ID y por título+ubicación)
        const existingIds = new Set((state.results?.properties || []).map(p => p.id));
        const existingTitleLocation = new Set((state.results?.properties || []).map(p => 
          `${(p.title || '').toLowerCase().trim()}|${(p.location?.city || '').toLowerCase().trim()}|${(p.location?.country || '').toLowerCase().trim()}`
        ));
        
        const newProperties = response.data!.properties.filter(property => {
          // Verificar por ID
          if (existingIds.has(property.id)) {
            return false;
          }
          
          // Verificar por título+ubicación
          const titleLocationKey = `${(property.title || '').toLowerCase().trim()}|${(property.location?.city || '').toLowerCase().trim()}|${(property.location?.country || '').toLowerCase().trim()}`;
          if (existingTitleLocation.has(titleLocationKey)) {
            return false;
          }
          
          existingIds.add(property.id);
          existingTitleLocation.add(titleLocationKey);
          return true;
        });
        
        setState(prev => ({
          ...prev,
          results: {
            ...response.data!,
            properties: [...(prev.results?.properties || []), ...newProperties]
          },
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error al cargar más');
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

