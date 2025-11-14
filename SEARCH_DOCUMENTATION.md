# 🔍 Documentación Técnica - Módulo de Búsqueda

## 📋 Índice

1. [Introducción](#introducción)
2. [Arquitectura](#arquitectura)
3. [Tipos y Modelos](#tipos-y-modelos)
4. [Servicios Mock](#servicios-mock)
5. [Componentes](#componentes)
6. [Context API](#context-api)
7. [Páginas](#páginas)
8. [Flujo de Búsqueda](#flujo-de-búsqueda)
9. [Testing](#testing)
10. [Migración a Backend Real](#migración-a-backend-real)

---

## 🎯 Introducción

El **Módulo de Búsqueda** permite a los usuarios encontrar alojamientos usando filtros avanzados, ordenamiento y visualización de resultados. Está completamente implementado con datos MOCK para desarrollo y testing.

### ✨ Características Principales

- **Búsqueda por ubicación** con autocompletado
- **Selector de fechas** con validación
- **Gestión de huéspedes** (adultos, niños, bebés)
- **Filtros avanzados**:
  - Rango de precio
  - Tipo de propiedad
  - Número de habitaciones
  - Calificación mínima
  - Amenidades
  - Reserva instantánea
- **Ordenamiento** por precio, calificación y recomendaciones
- **Paginación** con "Ver más"
- **Tarjetas de propiedad** con carrusel de imágenes
- **Favoritos** integrados con autenticación

---

## 🏗️ Arquitectura

```
lib/search/
├── mock-properties-db.ts      # Base de datos de 20 propiedades
├── mock-locations-db.ts       # Base de datos de ubicaciones
├── mock-search-service.ts     # Servicio de búsqueda
└── search-context.tsx         # Context API para estado global

components/search/
├── SearchBar.tsx              # Barra de búsqueda principal
├── SearchBarHome.tsx          # Barra para home (redirección)
├── LocationInput.tsx          # Input con autocompletado
├── DateRangePicker.tsx        # Selector de fechas
├── GuestsSelector.tsx         # Contador de huéspedes
├── FilterPanel.tsx            # Panel lateral de filtros
├── filters/
│   ├── PriceFilter.tsx
│   ├── PropertyTypeFilter.tsx
│   ├── BedroomsFilter.tsx
│   ├── RatingFilter.tsx
│   ├── InstantBookFilter.tsx
│   └── AmenitiesFilter.tsx
├── SearchResults.tsx          # Contenedor de resultados
├── PropertyCard.tsx           # Tarjeta de propiedad
├── PropertyGrid.tsx           # Grid responsive
├── SortSelector.tsx           # Selector de ordenamiento
├── QuickFilters.tsx          # Filtros rápidos (home)
└── SearchSection.tsx          # Sección de búsqueda (home)

app/buscar/
└── page.tsx                   # Página de búsqueda

types/
└── search.ts                  # Interfaces TypeScript
```

---

## 📦 Tipos y Modelos

### Property (Propiedad)

```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  host: Host;
  location: Location;
  images: string[];
  propertyType: 'entire_place' | 'private_room' | 'shared_room';
  roomType: 'apartment' | 'house' | 'villa' | 'loft' | 'cabin' | 'hotel' | 'cottage' | 'castle';
  pricing: Pricing;
  capacity: Capacity;
  amenities: Amenity[];
  rating: Rating;
  availability: Availability;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### SearchQuery

```typescript
interface SearchQuery {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: {
    adults: number;
    children: number;
    infants: number;
  };
}
```

### SearchFilters

```typescript
interface SearchFilters {
  priceRange?: { min: number; max: number };
  propertyTypes?: PropertyType[];
  amenities?: Amenity[];
  minRating?: number;
  bedrooms?: number;
  instantBook?: boolean;
}
```

---

## 🔧 Servicios Mock

### MockSearchService

Ubicación: `lib/search/mock-search-service.ts`

#### Métodos Principales

```typescript
// Buscar propiedades con filtros, ordenamiento y paginación
static async searchProperties(params: Partial<SearchParams>): Promise<SearchResponse<SearchResults>>

// Buscar ubicaciones (autocompletado)
static async searchLocations(query: string): Promise<SearchResponse<LocationSuggestion[]>>

// Obtener propiedad por ID
static async getPropertyById(id: string): Promise<SearchResponse<Property>>

// Obtener propiedades destacadas
static async getFeaturedProperties(limit: number = 6): Promise<SearchResponse<Property[]>>
```

#### Lógica de Filtrado

1. **Por ubicación**: Busca en ciudad, país o región
2. **Por fechas**: Valida noches mínimas/máximas
3. **Por huéspedes**: Filtra por capacidad
4. **Filtros avanzados**: Aplica precio, tipo, amenidades, etc.
5. **Ordenamiento**: recommended, price_asc, price_desc, rating_desc
6. **Paginación**: Divide resultados en páginas

#### Ejemplo de Uso

```typescript
const response = await MockSearchService.searchProperties({
  query: {
    location: 'Barcelona',
    checkIn: new Date('2025-01-15'),
    checkOut: new Date('2025-01-20'),
    guests: { adults: 2, children: 0, infants: 0 }
  },
  filters: {
    priceRange: { min: 50, max: 200 },
    amenities: ['wifi', 'pool']
  },
  sortBy: 'price_asc',
  page: 1,
  perPage: 20
});

if (response.success) {
  console.log('Propiedades:', response.data.properties);
}
```

---

## 🎨 Componentes

### SearchBar

**Archivo**: `components/search/SearchBar.tsx`

Barra de búsqueda completa con ubicación, fechas y huéspedes.

```typescript
<SearchBar
  query={query}
  onQueryChange={updateQuery}
  onSearch={handleSearch}
  compact={false}
/>
```

**Props**:
- `query`: SearchQuery - Query actual
- `onQueryChange`: (query: SearchQuery) => void
- `onSearch`: () => void - Callback para ejecutar búsqueda
- `compact?`: boolean - Modo compacto

---

### LocationInput

**Archivo**: `components/search/LocationInput.tsx`

Input con autocompletado de ubicaciones.

**Características**:
- Debounce de 300ms para búsqueda
- Navegación con teclado (↑↓ Enter Esc)
- Cierra al hacer click fuera
- Muestra hasta 8 sugerencias

---

### DateRangePicker

**Archivo**: `components/search/DateRangePicker.tsx`

Selector de rango de fechas usando `react-day-picker`.

**Características**:
- Calendario dual (2 meses)
- Deshabilita fechas pasadas
- Calcula noches automáticamente
- Locale en español

---

### GuestsSelector

**Archivo**: `components/search/GuestsSelector.tsx`

Contador de huéspedes con categorías.

**Límites**:
- Adultos: 1-16
- Niños: 0-10
- Bebés: 0-5

---

### FilterPanel

**Archivo**: `components/search/FilterPanel.tsx`

Panel lateral (Sheet) con todos los filtros avanzados.

**Filtros Incluidos**:
- Rango de precio (€0-€500+)
- Tipo de alojamiento (completo, privado, compartido)
- Número de habitaciones (1-5+)
- Calificación mínima (3.5-4.8+)
- Reserva instantánea (checkbox)
- Amenidades (12 opciones)

**Características**:
- Contador de filtros activos
- Botón "Limpiar todo"
- Aplicación de filtros con callback

---

### PropertyCard

**Archivo**: `components/search/PropertyCard.tsx`

Tarjeta de propiedad con toda la información.

**Características**:
- Carrusel de imágenes con indicadores
- Botón de favoritos (requiere auth)
- Badges (Destacado, Instantánea)
- Rating y reviews
- Precio por noche
- Capacidad (huéspedes, habitaciones)
- Link a página de detalle

---

### SearchResults

**Archivo**: `components/search/SearchResults.tsx`

Contenedor principal de resultados.

**Características**:
- Muestra total de resultados
- Integra FilterPanel y SortSelector
- Grid responsive de propiedades
- Botón "Ver más" para paginación
- Estados de carga

---

## 🌐 Context API

### SearchProvider

**Archivo**: `lib/search/search-context.tsx`

Context global para manejar el estado de búsqueda.

#### Estado

```typescript
interface SearchState {
  query: SearchQuery;
  filters: SearchFilters;
  sortBy: SortOption;
  results: SearchResults | null;
  isLoading: boolean;
  error: string | null;
}
```

#### Métodos

```typescript
interface SearchContextType extends SearchState {
  updateQuery: (query: Partial<SearchQuery>) => void;
  updateFilters: (filters: SearchFilters) => void;
  updateSortBy: (sortBy: SortOption) => void;
  performSearch: () => Promise<void>;
  loadMore: () => Promise<void>;
  clearSearch: () => void;
}
```

#### Uso

```typescript
import { useSearch } from '@/lib/search/search-context';

function MyComponent() {
  const {
    query,
    results,
    isLoading,
    updateQuery,
    performSearch
  } = useSearch();

  // ... usar métodos y estado
}
```

---

## 📄 Páginas

### /buscar

**Archivo**: `app/buscar/page.tsx`

Página principal de búsqueda.

**Características**:
- Usa SearchProvider para estado global
- Lee parámetros de URL al montar
- Ejecuta búsqueda automática si hay params
- SearchBar en modo compacto
- Resultados con paginación

**Parámetros de URL soportados**:
- `location`: string
- `checkIn`: ISO Date string
- `checkOut`: ISO Date string
- `adults`: number

**Ejemplo**:
```
/buscar?location=Barcelona&checkIn=2025-01-15&checkOut=2025-01-20&adults=2
```

---

## 🔄 Flujo de Búsqueda

### 1. Desde la Home

```mermaid
Usuario → SearchBarHome → Configura query → Click Buscar → Redirige a /buscar con params
```

### 2. En página de búsqueda

```
Mount /buscar → Lee URL params → updateQuery() → performSearch() → 
MockSearchService.searchProperties() → Filtra/Ordena → Retorna resultados → 
Actualiza SearchContext → Re-render con resultados
```

### 3. Aplicar filtros

```
Usuario → Abre FilterPanel → Configura filtros → Click "Aplicar" → 
onFiltersChange() → performSearch() → Nuevos resultados
```

### 4. Cambiar ordenamiento

```
Usuario → SortSelector → Selecciona opción → updateSortBy() → 
performSearch() → Resultados reordenados
```

### 5. Ver más resultados

```
Usuario → Click "Ver más" → loadMore() → page + 1 → 
searchProperties() → Concatena resultados → Actualiza grid
```

---

## 🧪 Testing

### Testing Manual

#### 1. Búsqueda Básica

- [ ] Home → SearchSection → Introducir ubicación "Barcelona"
- [ ] Seleccionar fechas (hoy + 7 días → hoy + 14 días)
- [ ] Configurar 2 adultos
- [ ] Click buscar → Redirige a /buscar
- [ ] Verifica que aparecen resultados de Barcelona

#### 2. Filtros

- [ ] Abrir FilterPanel
- [ ] Cambiar precio a €50-€150
- [ ] Seleccionar "Alojamiento completo"
- [ ] Seleccionar amenidades: WiFi, Piscina
- [ ] Aplicar → Verifica filtrado correcto

#### 3. Ordenamiento

- [ ] Cambiar a "Precio: menor a mayor"
- [ ] Verifica que primer resultado es el más barato
- [ ] Cambiar a "Mejor valorados"
- [ ] Verifica ordenamiento por rating

#### 4. Paginación

- [ ] Si hay más de 20 resultados, aparece "Ver más"
- [ ] Click → Carga siguiente página
- [ ] Verifica que se añaden al grid existente

#### 5. Property Card

- [ ] Hover en imagen → Muestra flechas de navegación
- [ ] Click en flechas → Cambia imagen
- [ ] Click favorito (sin auth) → Muestra error
- [ ] Login → Click favorito → Añade/quita de favoritos

#### 6. QuickFilters

- [ ] Home → QuickFilters
- [ ] Click en "Villas"
- [ ] Redirige a /buscar con filtro aplicado

### Tests Automáticos (Futuro)

```typescript
// Ejemplo de tests unitarios

describe('MockSearchService', () => {
  it('debe filtrar por ubicación', async () => {
    const response = await MockSearchService.searchProperties({
      query: { location: 'Barcelona' }
    });
    expect(response.success).toBe(true);
    expect(response.data!.properties.every(p => 
      p.location.city === 'Barcelona'
    )).toBe(true);
  });

  it('debe filtrar por precio', async () => {
    const response = await MockSearchService.searchProperties({
      filters: { priceRange: { min: 50, max: 100 } }
    });
    expect(response.data!.properties.every(p => 
      p.pricing.basePrice >= 50 && p.pricing.basePrice <= 100
    )).toBe(true);
  });
});
```

---

## 🚀 Migración a Backend Real

### Paso 1: API Endpoints

Reemplazar `MockSearchService` con llamadas reales:

```typescript
// lib/search/search-service.ts

export class SearchService {
  static async searchProperties(params: Partial<SearchParams>) {
    const response = await fetch('/api/properties/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }

  static async searchLocations(query: string) {
    const response = await fetch(`/api/locations/search?q=${query}`);
    return response.json();
  }
}
```

### Paso 2: Backend API

```typescript
// app/api/properties/search/route.ts

export async function POST(request: Request) {
  const params = await request.json();
  
  // Lógica de búsqueda en base de datos
  const properties = await db.properties.findMany({
    where: {
      location: { contains: params.query.location },
      capacity: { gte: params.query.guests.adults },
      // ... más filtros
    }
  });

  return Response.json({
    success: true,
    data: {
      properties,
      total: properties.length,
      // ... más datos
    }
  });
}
```

### Paso 3: Actualizar SearchContext

```typescript
// Cambiar import
- import { MockSearchService } from './mock-search-service';
+ import { SearchService } from './search-service';

// Actualizar llamadas
- const response = await MockSearchService.searchProperties(params);
+ const response = await SearchService.searchProperties(params);
```

### Paso 4: Base de Datos

#### Schema Prisma

```prisma
model Property {
  id            String   @id @default(cuid())
  title         String
  description   String
  location      Location @relation(fields: [locationId], references: [id])
  propertyType  String
  roomType      String
  basePrice     Float
  capacity      Int
  bedrooms      Int
  bathrooms     Int
  amenities     String[]
  images        String[]
  rating        Float
  reviewCount   Int
  instantBook   Boolean
  featured      Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Paso 5: Testing

- [ ] Tests de integración con API real
- [ ] Tests de carga (1000+ propiedades)
- [ ] Tests de performance de búsqueda
- [ ] Tests de filtros complejos

---

## 📊 Métricas y KPIs

### Performance

- **Tiempo de búsqueda**: < 500ms (mock: ~300ms)
- **Tiempo de autocompletado**: < 200ms (mock: ~200ms)
- **Carga de imágenes**: Lazy loading habilitado

### UX

- **Resultados por página**: 20
- **Máximo de sugerencias**: 8
- **Debounce de búsqueda**: 300ms

### Datos Mock

- **Total propiedades**: 20
- **Ubicaciones**: 25 ciudades
- **Precio medio**: €150/noche
- **Rating medio**: 4.7/5

---

## 🛠️ Troubleshooting

### Problema: No aparecen sugerencias de ubicación

**Solución**:
- Verifica que escribes al menos 2 caracteres
- Revisa console logs de `MockSearchService.searchLocations()`
- Comprueba que `MOCK_LOCATIONS` tiene datos

### Problema: Filtros no funcionan

**Solución**:
- Verifica que haces click en "Aplicar filtros"
- Revisa que `performSearch()` se ejecuta
- Comprueba console logs de filtrado

### Problema: Imágenes no cargan

**Solución**:
- Verifica URLs de Unsplash en `mock-properties-db.ts`
- Revisa configuración de Next.js `next.config.js`:

```js
images: {
  domains: ['images.unsplash.com', 'i.pravatar.cc']
}
```

---

## 📚 Recursos Adicionales

- [Documentación Auth Module](./AUTH_DOCUMENTATION.md)
- [Milestone 1: Auth](./MILESTONE_1.md)
- [Milestone 2: Search](./MILESTONE_2.md)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Context API](https://react.dev/reference/react/useContext)

---

## ✅ Checklist de Implementación Completada

- [x] Tipos TypeScript definidos
- [x] Base de datos MOCK (20 propiedades)
- [x] Servicio de búsqueda con filtrado
- [x] Componente SearchBar
- [x] Input de ubicación con autocompletado
- [x] Selector de fechas
- [x] Selector de huéspedes
- [x] Panel de filtros avanzados
- [x] 6 tipos de filtros implementados
- [x] Tarjetas de propiedad
- [x] Grid responsive
- [x] Ordenamiento de resultados
- [x] Paginación con "Ver más"
- [x] Context API para estado global
- [x] Página /buscar funcional
- [x] Integración en home
- [x] QuickFilters para home
- [x] Integración con Auth (favoritos)
- [x] Documentación técnica completa

---

**Última actualización**: 14 Noviembre 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Producción (MOCK)

