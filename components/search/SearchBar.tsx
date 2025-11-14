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
    <div className={`bg-white rounded-full shadow-lg border border-gray-200 ${
      compact ? 'max-w-4xl' : 'max-w-5xl'
    } mx-auto`}>
      <div className="flex items-center">
        {/* Location */}
        <div className="flex-1 px-6 py-4 border-r border-gray-200">
          <LocationInput
            value={query.location}
            onChange={(location) => onQueryChange({ ...query, location })}
          />
        </div>

        {/* Dates */}
        <div className="flex-1 px-6 py-4 border-r border-gray-200">
          <DateRangePicker
            checkIn={query.checkIn}
            checkOut={query.checkOut}
            onChange={(checkIn, checkOut) => 
              onQueryChange({ ...query, checkIn, checkOut })
            }
          />
        </div>

        {/* Guests */}
        <div className="flex-1 px-6 py-4">
          <GuestsSelector
            guests={query.guests}
            onChange={(guests) => onQueryChange({ ...query, guests })}
          />
        </div>

        {/* Search Button */}
        <div className="pr-2">
          <Button
            onClick={onSearch}
            className="bg-[#FF385C] hover:bg-[#E31C5F] text-white rounded-full h-14 w-14 p-0"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

