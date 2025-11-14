// components/search/FilterPanel.tsx
'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SearchFilters } from '@/types/search';
import PriceFilter from './filters/PriceFilter';
import PropertyTypeFilter from './filters/PropertyTypeFilter';
import AmenitiesFilter from './filters/AmenitiesFilter';
import RatingFilter from './filters/RatingFilter';
import BedroomsFilter from './filters/BedroomsFilter';
import InstantBookFilter from './filters/InstantBookFilter';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onApply: () => void;
}

export default function FilterPanel({ filters, onFiltersChange, onApply }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return true;
    return value !== undefined && value !== false;
  }).length;

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApply();
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters: SearchFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#FF385C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Filtros</SheetTitle>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Limpiar todo
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="space-y-8 py-6">
          {/* Rango de Precio */}
          <PriceFilter
            value={localFilters.priceRange}
            onChange={(priceRange) => 
              setLocalFilters({ ...localFilters, priceRange })
            }
          />

          {/* Tipo de Propiedad */}
          <PropertyTypeFilter
            value={localFilters.propertyTypes}
            onChange={(propertyTypes) =>
              setLocalFilters({ ...localFilters, propertyTypes })
            }
          />

          {/* Habitaciones */}
          <BedroomsFilter
            value={localFilters.bedrooms}
            onChange={(bedrooms) =>
              setLocalFilters({ ...localFilters, bedrooms })
            }
          />

          {/* Calificación Mínima */}
          <RatingFilter
            value={localFilters.minRating}
            onChange={(minRating) =>
              setLocalFilters({ ...localFilters, minRating })
            }
          />

          {/* Reserva Instantánea */}
          <InstantBookFilter
            value={localFilters.instantBook}
            onChange={(instantBook) =>
              setLocalFilters({ ...localFilters, instantBook })
            }
          />

          {/* Amenidades */}
          <AmenitiesFilter
            value={localFilters.amenities}
            onChange={(amenities) =>
              setLocalFilters({ ...localFilters, amenities })
            }
          />
        </div>

        {/* Footer con botones */}
        <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#FF385C] hover:bg-[#E31C5F]"
              onClick={handleApply}
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

