// components/search/SearchBar.tsx
'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationInput from './LocationInput';
import DateRangePicker from './DateRangePicker';
import GuestsSelector from './GuestsSelector';
import { SearchQuery } from '@/types/search';

interface SearchBarProps {
  query: SearchQuery;
  onQueryChange: (query: SearchQuery) => void;
  onSearch: () => void;
  compact?: boolean;
}

export default function SearchBar({ query, onQueryChange, onSearch, compact = false }: SearchBarProps) {
  return (
    <div className={`bg-white shadow-lg border border-gray-200 ${
      compact ? 'max-w-4xl' : 'max-w-5xl'
    } mx-auto rounded-2xl md:rounded-full`}>
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Location */}
        <div className="flex-1 px-4 md:px-6 py-3 md:py-4 border-b md:border-b-0 md:border-r border-gray-200">
          <LocationInput
            value={query.location}
            onChange={(location) => onQueryChange({ ...query, location })}
          />
        </div>

        {/* Dates */}
        <div className="flex-1 px-4 md:px-6 py-3 md:py-4 border-b md:border-b-0 md:border-r border-gray-200">
          <DateRangePicker
            checkIn={query.checkIn}
            checkOut={query.checkOut}
            onChange={(checkIn, checkOut) => 
              onQueryChange({ ...query, checkIn, checkOut })
            }
          />
        </div>

        {/* Guests */}
        <div className="flex-1 px-4 md:px-6 py-3 md:py-4 border-b md:border-b-0 border-gray-200">
          <GuestsSelector
            guests={query.guests}
            onChange={(guests) => onQueryChange({ ...query, guests })}
          />
        </div>

        {/* Search Button */}
        <div className="p-3 md:pr-2 flex justify-center md:justify-start">
          <Button
            onClick={onSearch}
            className="bg-acento-200 hover:bg-acento-100 text-white rounded-full h-12 md:h-14 w-full md:w-14 p-0 flex items-center justify-center gap-2"
          >
            <Search className="h-5 w-5" />
            <span className="md:hidden font-semibold">Buscar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

