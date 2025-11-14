# 🚀 QUICK START - MILESTONE 2

> **Guía rápida para iniciar el Módulo de Búsqueda**

---

## 📋 RESUMEN EJECUTIVO

**Milestone 2: Módulo de Búsqueda y Filtros (MOCK)**

| Métrica | Valor |
|---------|-------|
| **Tareas totales** | 28 |
| **Tiempo estimado** | 11 horas |
| **Prioridad** | 🔴 ALTA |
| **Dependencias** | ✅ Milestone 1 completado |
| **Archivos a crear** | ~20 |

---

## 🎯 OBJETIVO

Implementar un sistema completo de búsqueda de alojamientos que permita:
- 🔍 Buscar por ubicación con autocompletado
- 📅 Seleccionar fechas de check-in/check-out
- 👥 Especificar número de huéspedes
- 🎛️ Filtrar por precio, tipo, amenidades, rating
- 📊 Ver resultados en grid responsive
- 🔄 Ordenar resultados

---

## 📂 ARCHIVOS A CREAR (VISTA RÁPIDA)

### 📁 Types (1 archivo)
```
types/search.ts                    # Interfaces de búsqueda
```

### 📁 Servicios (3 archivos)
```
lib/search/mock-properties-db.ts   # 20-30 propiedades MOCK
lib/search/mock-locations-db.ts    # Ciudades populares
lib/search/mock-search-service.ts  # Servicio de búsqueda
```

### 📁 Componentes de Búsqueda (4 archivos)
```
components/search/SearchBar.tsx           # Barra principal
components/search/LocationInput.tsx       # Input ubicación
components/search/DateRangePicker.tsx     # Selector fechas
components/search/GuestsSelector.tsx      # Selector huéspedes
```

### 📁 Componentes de Filtros (6 archivos)
```
components/search/FilterPanel.tsx         # Container filtros
components/search/PriceRangeFilter.tsx    # Slider precio
components/search/PropertyTypeFilter.tsx  # Checkboxes tipo
components/search/AmenitiesFilter.tsx     # Grid amenidades
components/search/RatingFilter.tsx        # Radio buttons rating
components/search/BedroomsFilter.tsx      # Selector habitaciones
```

### 📁 Componentes de Resultados (4 archivos)
```
components/search/SearchResults.tsx       # Container resultados
components/search/PropertyCard.tsx        # Card individual
components/search/SearchResultsGrid.tsx   # Grid responsive
components/search/SortDropdown.tsx        # Ordenamiento
```

### 📁 Páginas (1-2 archivos)
```
app/buscar/page.tsx                       # Página búsqueda
lib/search/search-context.tsx             # Context búsqueda
```

---

## 🏗️ FASES DE IMPLEMENTACIÓN

### FASE 1: Base de Datos MOCK (1.75h)
1. Crear tipos TypeScript
2. Crear 20-30 propiedades realistas
3. Crear array de ubicaciones
4. Implementar servicio de búsqueda

**Resultado**: Datos listos para buscar

### FASE 2: Búsqueda Principal (2.25h)
1. SearchBar (container)
2. LocationInput (autocompletado)
3. DateRangePicker (calendario)
4. GuestsSelector (contadores)

**Resultado**: Búsqueda básica funcional

### FASE 3: Filtros Avanzados (2.25h)
1. FilterPanel (container)
2. PriceRangeFilter
3. PropertyTypeFilter
4. AmenitiesFilter
5. RatingFilter
6. BedroomsFilter

**Resultado**: Todos los filtros funcionando

### FASE 4: Visualización (2.25h)
1. SearchResults (container)
2. PropertyCard (diseño atractivo)
3. SearchResultsGrid (responsive)
4. SortDropdown
5. Paginación

**Resultado**: Resultados visuales completos

### FASE 5: Integración (1.05h)
1. Página /buscar
2. SearchContext
3. Integración con home
4. QuickFilters
5. URL params

**Resultado**: Todo conectado

### FASE 6: Testing (1.5h)
1. Testing manual completo
2. Documentación

**Resultado**: Milestone completado

---

## 📊 ESTRUCTURA DE DATOS PRINCIPAL

```typescript
// Property (modelo de alojamiento)
interface Property {
  id: string;
  title: string;
  location: {
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  images: string[];
  propertyType: 'entire_place' | 'private_room' | 'shared_room';
  pricing: {
    basePrice: number; // Por noche en €
    currency: 'EUR';
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  amenities: string[]; // ['wifi', 'kitchen', 'pool', ...]
  rating: {
    overall: number; // 0-5
    reviewCount: number;
  };
  host: {
    name: string;
    isSuperhost: boolean;
  };
}
```

---

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

### 🔴 CRÍTICAS (Hacer Primero)
1. Base de datos MOCK con propiedades
2. SearchBar completo
3. Filtro de precio
4. PropertyCard atractivo
5. Grid de resultados
6. Página /buscar

### 🟡 MEDIAS (Hacer Después)
1. Filtros adicionales (amenidades, rating, bedrooms)
2. Ordenamiento de resultados
3. QuickFilters en home
4. Paginación

### ⚪ BAJAS (Opcional)
1. Vista de mapa
2. Toggle lista/mapa

---

## 🚦 CHECKPOINTS DE PROGRESO

### Checkpoint 1: Datos Listos (Day 1)
- [ ] `types/search.ts` creado
- [ ] `mock-properties-db.ts` con 20+ propiedades
- [ ] `mock-search-service.ts` funcional
- [ ] Puedo hacer búsquedas básicas en consola

### Checkpoint 2: Búsqueda Básica (Day 2)
- [ ] SearchBar visible en home
- [ ] LocationInput con autocompletado funciona
- [ ] DateRangePicker selecciona fechas
- [ ] GuestsSelector cuenta huéspedes
- [ ] Búsqueda redirige a /buscar

### Checkpoint 3: Filtros Funcionando (Day 3-4)
- [ ] FilterPanel visible en /buscar
- [ ] PriceRangeFilter funciona
- [ ] PropertyTypeFilter funciona
- [ ] Al menos 3 filtros más implementados
- [ ] Filtros actualizan resultados

### Checkpoint 4: Resultados Visuales (Day 4-5)
- [ ] PropertyCard diseñado y atractivo
- [ ] Grid responsive funciona
- [ ] Resultados se muestran correctamente
- [ ] SortDropdown cambia orden
- [ ] Loading states implementados

### Checkpoint 5: Integración (Day 5-6)
- [ ] SearchContext funcional
- [ ] URL params funcionan
- [ ] Todo integrado y conectado
- [ ] Testing manual completado
- [ ] ✅ Milestone 2 COMPLETADO

---

## 💡 CONSEJOS PARA DESARROLLO

### 1. Empieza por los Datos
Antes de crear componentes, asegúrate de tener:
- ✅ Tipos TypeScript definidos
- ✅ 20+ propiedades MOCK con datos realistas
- ✅ Servicio de búsqueda que funcione en consola

### 2. Componentes Incrementales
No intentes crear todo a la vez:
- Crea SearchBar simple primero
- Añade LocationInput
- Luego DatePicker
- Finalmente GuestsSelector

### 3. Testing Continuo
Prueba cada componente inmediatamente:
```bash
npm run dev
# Abre http://localhost:3000
# Verifica cada funcionalidad
```

### 4. Usa Componentes Existentes
Aprovecha lo que ya tienes:
- `Button`, `Input`, `Label` de Shadcn/UI
- `Popover` para dropdowns
- `Slider` para precio
- `Checkbox` para filtros

### 5. Skeleton Loaders
Implementa loading states desde el inicio:
```typescript
{isLoading ? (
  <SearchResultsSkeleton />
) : (
  <SearchResultsGrid results={results} />
)}
```

---

## 🧪 DATOS DE PRUEBA

### Ubicaciones Sugeridas
```
- Barcelona, España
- Madrid, España
- Valencia, España
- Lisboa, Portugal
- París, Francia
- Roma, Italia
- Londres, Reino Unido
- Berlín, Alemania
- Ámsterdam, Países Bajos
- Dubrovnik, Croacia
```

### Rangos de Precio
```
- Económico: €30-€60/noche
- Medio: €61-€120/noche
- Premium: €121-€250/noche
- Lujo: €251+/noche
```

### Amenidades Comunes
```
- wifi (WiFi gratuito)
- kitchen (Cocina)
- pool (Piscina)
- ac (Aire acondicionado)
- parking (Estacionamiento gratuito)
- gym (Gimnasio)
- beach_access (Acceso a playa)
- mountain_view (Vista a montaña)
- pet_friendly (Acepta mascotas)
- washer (Lavadora)
```

---

## 🎨 REFERENCIAS DE DISEÑO

### Inspiración Visual
- **Airbnb.com** → Búsqueda y filtros
- **Booking.com** → Grid de resultados
- **VRBO** → Property cards

### Colores Clave
```css
--primary: #FF385C       /* Botón de búsqueda */
--text-primary: #222222  /* Texto principal */
--text-secondary: #717171 /* Texto secundario */
--border: #DDDDDD        /* Bordes */
```

### Imágenes
- **Unsplash**: https://unsplash.com/s/photos/airbnb
- **Placeholder**: https://placehold.co/600x400
- **Pravatar** (avatars): https://i.pravatar.cc/150

---

## 📚 DOCUMENTACIÓN DISPONIBLE

1. **`MILESTONE_2.md`** 📋
   - Plan completo de 28 tareas
   - Historias de usuario detalladas
   - Especificaciones técnicas
   - Wireframes y diseños

2. **Este archivo** ⚡
   - Guía rápida de inicio
   - Checkpoints de progreso
   - Consejos prácticos

---

## 🚀 COMANDOS ÚTILES

```bash
# Iniciar desarrollo
npm run dev

# Verificar errores
npm run lint

# Compilar TypeScript
npm run build

# Ver estructura del proyecto
tree -L 3 -I 'node_modules|.next|out'
```

---

## ❓ PREGUNTAS FRECUENTES

### ¿Por qué 11 horas estimadas?
Es una estimación conservadora. Con el código base del Milestone 1, podrías completarlo más rápido.

### ¿Puedo cambiar el orden de las tareas?
Sí, pero respeta las dependencias. Empieza siempre por los datos MOCK.

### ¿Es necesario el mapa?
No, es opcional (Fase 5). Enfócate en búsqueda y filtros primero.

### ¿Cuántas propiedades MOCK necesito?
Mínimo 20 para probar bien. Ideal: 30-50.

### ¿Puedo usar librerías adicionales?
Trata de usar lo ya instalado. Si necesitas algo específico (ej: mapa), evalúa primero.

---

## ✅ CHECKLIST DE INICIO

Antes de comenzar, asegúrate:

- [ ] Milestone 1 completado y funcionando
- [ ] Servidor de desarrollo corriendo (`npm run dev`)
- [ ] Sin errores de lint
- [ ] Git actualizado (commit del Milestone 1)
- [ ] Tiempo estimado disponible (2-3 días enfocado)
- [ ] Leíste `MILESTONE_2.md` completo
- [ ] Entiendes la estructura de datos

---

## 🎉 AL COMPLETAR

Una vez terminado el Milestone 2, tendrás:

✅ Sistema completo de búsqueda de alojamientos  
✅ Filtros avanzados funcionales  
✅ Grid de resultados atractivo y responsive  
✅ Integración con home  
✅ URL params para compartir búsquedas  
✅ Base sólida para Milestone 3 (Detalle de propiedad)  

---

**¿Listo para empezar?** → Abre `MILESTONE_2.md` y comienza con TASK-001! 🚀

**Tiempo total estimado**: 11 horas  
**Complejidad**: Media-Alta  
**Diversión**: ⭐⭐⭐⭐⭐

