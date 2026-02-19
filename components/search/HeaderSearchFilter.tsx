// components/search/HeaderSearchFilter.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LocationInput from './LocationInput';
import DateRangePicker from './DateRangePicker';
import GuestsSelector from './GuestsSelector';
import PriceFilter from './filters/PriceFilter';
import RoomTypeFilter from './filters/RoomTypeFilter';
import AmenitiesFilter from './filters/AmenitiesFilter';
import { SearchQuery, SearchFilters, RoomType } from '@/types/search';
import { ROUTES } from '@/lib/constants';

interface HeaderSearchFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Filtro de búsqueda para el Header
 * Modal responsive con fondo blanco y letras negras
 * Incluye: búsqueda básica, precio, tipo de alojamiento y amenidades
 */
export default function HeaderSearchFilter({ isOpen, onClose }: HeaderSearchFilterProps) {
  const router = useRouter();
  const [query, setQuery] = useState<SearchQuery>({
    location: undefined,
    checkIn: undefined,
    checkOut: undefined,
    guests: { adults: 1, children: 0, infants: 0 }
  });
  
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: undefined,
    roomType: undefined,
    amenities: []
  });

  const handleApply = () => {
    const params = new URLSearchParams();
    
    if (query.location) {
      params.set('location', query.location);
    }
    
    if (query.checkIn) {
      params.set('checkIn', query.checkIn.toISOString().split('T')[0]);
    }
    
    if (query.checkOut) {
      params.set('checkOut', query.checkOut.toISOString().split('T')[0]);
    }
    
    if (query.guests?.adults) {
      params.set('adults', query.guests.adults.toString());
    }

    // Agregar filtros de precio
    if (filters.priceRange) {
      params.set('minPrice', filters.priceRange.min.toString());
      params.set('maxPrice', filters.priceRange.max.toString());
    }

    // Agregar tipo de alojamiento (roomType)
    if (filters.roomType && Array.isArray(filters.roomType) && filters.roomType.length > 0) {
      params.set('propertyType', filters.roomType[0]); // Usar propertyType para compatibilidad
    }

    // Agregar amenidades
    if (filters.amenities && filters.amenities.length > 0) {
      params.set('amenities', filters.amenities.join(','));
    }

    const searchUrl = params.toString() 
      ? `${ROUTES.BUSCAR}?${params.toString()}`
      : ROUTES.BUSCAR;
    
    router.push(searchUrl);
    onClose();
  };

  const handleReset = () => {
    setQuery({
      location: undefined,
      checkIn: undefined,
      checkOut: undefined,
      guests: { adults: 1, children: 0, infants: 0 }
    });
    setFilters({
      priceRange: undefined,
      roomType: undefined,
      amenities: []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-hidden bg-white text-gray-900 p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-gray-200 bg-white">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            Filtros
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)] bg-white">
          <div className="space-y-6">
            {/* Búsqueda básica */}
            <div className="space-y-4 border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-base text-gray-900">Búsqueda</h3>
              
              <LocationInput
                value={query.location}
                onChange={(location) => setQuery({ ...query, location })}
              />

              <DateRangePicker
                checkIn={query.checkIn}
                checkOut={query.checkOut}
                onChange={(checkIn, checkOut) => 
                  setQuery({ ...query, checkIn, checkOut })
                }
              />

              <GuestsSelector
                guests={query.guests}
                onChange={(guests) => setQuery({ ...query, guests })}
              />
            </div>

            {/* Rango de precio */}
            <div className="border-b border-gray-200 pb-6">
              <PriceFilter
                value={filters.priceRange}
                onChange={(priceRange) => setFilters({ ...filters, priceRange })}
              />
            </div>

            {/* Tipo de alojamiento */}
            <div className="border-b border-gray-200 pb-6">
              <RoomTypeFilter
                value={filters.roomType as RoomType[]}
                onChange={(roomType) => setFilters({ ...filters, roomType })}
              />
            </div>

            {/* Amenidades */}
            <div>
              <AmenitiesFilter
                value={filters.amenities}
                onChange={(amenities) => setFilters({ ...filters, amenities })}
              />
            </div>
          </div>
        </div>

        {/* Botones de acción - Sticky footer */}
        <div className="flex flex-col sm:flex-row gap-3 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white sticky bottom-0">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto sm:flex-none order-2 sm:order-1 text-gray-900 border-gray-300 hover:bg-gray-50"
          >
            Limpiar
          </Button>
          <Button
            onClick={handleApply}
            className="w-full sm:flex-1 bg-acento-200 hover:bg-acento-100 text-white font-semibold order-1 sm:order-2"
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

