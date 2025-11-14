// components/search/SearchBarHome.tsx
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import LocationInput from './LocationInput';
import DateRangePicker from './DateRangePicker';
import GuestsSelector from './GuestsSelector';
import { SearchQuery } from '@/types/search';

export default function SearchBarHome() {
  const router = useRouter();
  const [query, setQuery] = useState<SearchQuery>({
    guests: { adults: 1, children: 0, infants: 0 }
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (query.location) params.set('location', query.location);
    if (query.checkIn) params.set('checkIn', query.checkIn.toISOString());
    if (query.checkOut) params.set('checkOut', query.checkOut.toISOString());
    if (query.guests) params.set('adults', query.guests.adults.toString());

    router.push(`/buscar?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-full shadow-2xl border border-gray-200 max-w-5xl mx-auto">
      <div className="flex items-center">
        {/* Location */}
        <div className="flex-1 px-6 py-4 border-r border-gray-200">
          <LocationInput
            value={query.location}
            onChange={(location) => setQuery({ ...query, location })}
          />
        </div>

        {/* Dates */}
        <div className="flex-1 px-6 py-4 border-r border-gray-200">
          <DateRangePicker
            checkIn={query.checkIn}
            checkOut={query.checkOut}
            onChange={(checkIn, checkOut) => 
              setQuery({ ...query, checkIn, checkOut })
            }
          />
        </div>

        {/* Guests */}
        <div className="flex-1 px-6 py-4">
          <GuestsSelector
            guests={query.guests}
            onChange={(guests) => setQuery({ ...query, guests })}
          />
        </div>

        {/* Search Button */}
        <div className="pr-2">
          <Button
            onClick={handleSearch}
            className="bg-[#FF385C] hover:bg-[#E31C5F] text-white rounded-full h-14 w-14 p-0 shadow-lg"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

