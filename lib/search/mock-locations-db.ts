// lib/search/mock-locations-db.ts

import { LocationSuggestion } from '@/types/search';

/**
 * BASE DE DATOS MOCK DE UBICACIONES
 * Para autocompletado en búsqueda
 */

export const MOCK_LOCATIONS: LocationSuggestion[] = [
  // España
  { id: 'loc-001', city: 'Barcelona', country: 'España', region: 'Cataluña', type: 'city', matchText: 'Barcelona, España' },
  { id: 'loc-002', city: 'Madrid', country: 'España', region: 'Comunidad de Madrid', type: 'city', matchText: 'Madrid, España' },
  { id: 'loc-003', city: 'Valencia', country: 'España', region: 'Comunidad Valenciana', type: 'city', matchText: 'Valencia, España' },
  { id: 'loc-004', city: 'Sevilla', country: 'España', region: 'Andalucía', type: 'city', matchText: 'Sevilla, España' },
  { id: 'loc-005', city: 'Málaga', country: 'España', region: 'Andalucía', type: 'city', matchText: 'Málaga, España' },
  { id: 'loc-006', city: 'Bilbao', country: 'España', region: 'País Vasco', type: 'city', matchText: 'Bilbao, España' },
  { id: 'loc-007', city: 'Granada', country: 'España', region: 'Andalucía', type: 'city', matchText: 'Granada, España' },
  { id: 'loc-008', city: 'Marbella', country: 'España', region: 'Andalucía', type: 'city', matchText: 'Marbella, España' },
  
  // Portugal
  { id: 'loc-009', city: 'Lisboa', country: 'Portugal', region: 'Lisboa', type: 'city', matchText: 'Lisboa, Portugal' },
  { id: 'loc-010', city: 'Porto', country: 'Portugal', region: 'Porto', type: 'city', matchText: 'Porto, Portugal' },
  { id: 'loc-011', city: 'Faro', country: 'Portugal', region: 'Algarve', type: 'city', matchText: 'Faro, Portugal' },
  
  // Francia
  { id: 'loc-012', city: 'París', country: 'Francia', region: 'Île-de-France', type: 'city', matchText: 'París, Francia' },
  { id: 'loc-013', city: 'Lyon', country: 'Francia', region: 'Auvernia-Ródano-Alpes', type: 'city', matchText: 'Lyon, Francia' },
  { id: 'loc-014', city: 'Marsella', country: 'Francia', region: 'Provenza-Alpes-Costa Azul', type: 'city', matchText: 'Marsella, Francia' },
  { id: 'loc-015', city: 'Niza', country: 'Francia', region: 'Provenza-Alpes-Costa Azul', type: 'city', matchText: 'Niza, Francia' },
  
  // Italia
  { id: 'loc-016', city: 'Roma', country: 'Italia', region: 'Lazio', type: 'city', matchText: 'Roma, Italia' },
  { id: 'loc-017', city: 'Florencia', country: 'Italia', region: 'Toscana', type: 'city', matchText: 'Florencia, Italia' },
  { id: 'loc-018', city: 'Venecia', country: 'Italia', region: 'Véneto', type: 'city', matchText: 'Venecia, Italia' },
  { id: 'loc-019', city: 'Milán', country: 'Italia', region: 'Lombardía', type: 'city', matchText: 'Milán, Italia' },
  
  // Reino Unido
  { id: 'loc-020', city: 'Londres', country: 'Reino Unido', region: 'Inglaterra', type: 'city', matchText: 'Londres, Reino Unido' },
  { id: 'loc-021', city: 'Edimburgo', country: 'Reino Unido', region: 'Escocia', type: 'city', matchText: 'Edimburgo, Reino Unido' },
  
  // Alemania
  { id: 'loc-022', city: 'Berlín', country: 'Alemania', region: 'Berlín', type: 'city', matchText: 'Berlín, Alemania' },
  { id: 'loc-023', city: 'Múnich', country: 'Alemania', region: 'Baviera', type: 'city', matchText: 'Múnich, Alemania' },
  
  // Países Bajos
  { id: 'loc-024', city: 'Ámsterdam', country: 'Países Bajos', region: 'Noord-Holland', type: 'city', matchText: 'Ámsterdam, Países Bajos' },
  { id: 'loc-025', city: 'Rotterdam', country: 'Países Bajos', region: 'Zuid-Holland', type: 'city', matchText: 'Rotterdam, Países Bajos' },
];

export function searchLocations(query: string): LocationSuggestion[] {
  if (!query || query.trim().length < 2) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  return MOCK_LOCATIONS.filter(loc => 
    loc.city.toLowerCase().includes(searchTerm) ||
    loc.country.toLowerCase().includes(searchTerm) ||
    loc.region?.toLowerCase().includes(searchTerm) ||
    loc.matchText.toLowerCase().includes(searchTerm)
  ).slice(0, 8); // Máximo 8 sugerencias
}

export function getLocationByCity(city: string): LocationSuggestion | undefined {
  return MOCK_LOCATIONS.find(loc => 
    loc.city.toLowerCase() === city.toLowerCase()
  );
}

