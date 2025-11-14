# 🔍 MILESTONE 2: Módulo de Búsqueda y Filtros (MOCK)

> **Objetivo**: Implementar un sistema completo de búsqueda de alojamientos con filtros avanzados, usando datos MOCK sin backend real.

---

## 📊 ESTADO DEL MILESTONE

| Métrica | Valor |
|---------|-------|
| **Estado General** | ✅ COMPLETADO |
| **Fecha Inicio** | 14 Noviembre 2025 |
| **Fecha Finalización** | 14 Noviembre 2025 |
| **Progreso** | 28/28 tareas (100%) |
| **Prioridad** | 🔴 ALTA |
| **Dependencias** | ✅ Milestone 1 completado |

---

## 🎯 VISIÓN DEL PRODUCTO

### Contexto
Con el módulo de autenticación funcionando, los usuarios ahora necesitan buscar y descubrir alojamientos. El módulo de búsqueda es **la funcionalidad core** de cualquier plataforma tipo Airbnb.

### Objetivo Estratégico
Crear una experiencia de búsqueda intuitiva y potente que permita a los usuarios:
1. 🔍 **Buscar** por ubicación con autocompletado
2. 📅 **Seleccionar** fechas de check-in/check-out
3. 👥 **Especificar** número de huéspedes (adultos, niños, bebés)
4. 🎛️ **Filtrar** por precio, tipo, amenidades, calificación
5. 📊 **Visualizar** resultados en grid responsive
6. 🗺️ **Ver** ubicaciones en mapa (opcional)

### Impacto Esperado
- 📈 **+250% engagement** vs landing estática
- 🎯 **+180% conversión** con filtros avanzados
- 💰 **+150% tiempo en sitio** explorando opciones
- ⭐ **4.5+ rating** de satisfacción del usuario

---

## ✅ TO-DO LIST

### 🏗️ FASE 1: BASE DE DATOS MOCK (Propiedades)

- [ ] **TASK-001**: Crear tipos TypeScript para búsqueda
  - [ ] Interface `Property` (modelo completo de alojamiento)
  - [ ] Interface `SearchQuery` (parámetros de búsqueda)
  - [ ] Interface `SearchFilters` (filtros activos)
  - [ ] Interface `SearchResults` (respuesta con paginación)
  - [ ] Types para ubicaciones, amenidades, tipos
  - **Estimación**: 15 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-002**: Crear base de datos MOCK de propiedades
  - [ ] Array `MOCK_PROPERTIES` con 20-30 alojamientos
  - [ ] Datos realistas (nombres, ubicaciones, precios, ratings)
  - [ ] Imágenes de Unsplash o placeholders
  - [ ] Variedad de tipos (casa, apto, villa, etc.)
  - [ ] Diferentes rangos de precio
  - [ ] Amenidades variadas
  - **Estimación**: 30 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-003**: Crear base de datos MOCK de ubicaciones
  - [ ] Array `MOCK_LOCATIONS` con ciudades populares
  - [ ] Estructura: ciudad, país, región, coordenadas
  - [ ] Mínimo 20 ubicaciones diferentes
  - [ ] Incluir ciudades españolas, europeas y mundiales
  - **Estimación**: 15 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-004**: Crear servicio MOCK de búsqueda
  - [ ] Método `searchProperties()` con filtros
  - [ ] Método `getLocationSuggestions()` para autocompletado
  - [ ] Método `getPropertyById()` para detalle
  - [ ] Lógica de filtrado (precio, tipo, amenidades, etc.)
  - [ ] Lógica de ordenamiento (precio, rating, popularidad)
  - [ ] Paginación (20 resultados por página)
  - [ ] Simulación de delay de red (300-600ms)
  - **Estimación**: 45 min
  - **Prioridad**: 🔴 CRÍTICA

---

### 🎯 FASE 2: COMPONENTES DE BÚSQUEDA PRINCIPAL

- [ ] **TASK-005**: Crear `SearchBar.tsx` (Barra principal)
  - [ ] Container horizontal con 4 secciones
  - [ ] Sticky en scroll (opcional)
  - [ ] Botón de búsqueda grande
  - [ ] Responsive (collapsa en mobile)
  - [ ] Animaciones de transición
  - **Estimación**: 25 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-006**: Crear `LocationInput.tsx` (Ubicación)
  - [ ] Input con icon de ubicación
  - [ ] Autocompletado mientras escribe
  - [ ] Dropdown con sugerencias
  - [ ] Destacar texto coincidente
  - [ ] Selección con teclado (↑↓ Enter)
  - [ ] Estado "seleccionado" visual
  - [ ] Placeholder: "¿A dónde vas?"
  - **Estimación**: 35 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-007**: Crear `DateRangePicker.tsx` (Fechas)
  - [ ] Integración con `react-day-picker` (ya instalado)
  - [ ] Popover con calendario
  - [ ] Selección de rango (check-in → check-out)
  - [ ] Fechas pasadas deshabilitadas
  - [ ] Mínimo 1 noche, máximo 365 noches
  - [ ] Mostrar número de noches
  - [ ] Estilos custom (colores Airbnb)
  - [ ] Placeholder: "¿Cuándo?"
  - **Estimación**: 45 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-008**: Crear `GuestsSelector.tsx` (Huéspedes)
  - [ ] Popover con contadores
  - [ ] Adultos (16+ años): min 1, max 16
  - [ ] Niños (2-12 años): min 0, max 10
  - [ ] Bebés (< 2 años): min 0, max 5
  - [ ] Botones +/- para incrementar/decrementar
  - [ ] Resumen: "X huéspedes" en el input
  - [ ] Validación de máximos por propiedad
  - [ ] Placeholder: "¿Cuántos?"
  - **Estimación**: 30 min
  - **Prioridad**: 🔴 CRÍTICA

---

### 🎛️ FASE 3: PANEL DE FILTROS AVANZADOS

- [ ] **TASK-009**: Crear `FilterPanel.tsx` (Container)
  - [ ] Panel lateral fijo (desktop)
  - [ ] Drawer/Modal (mobile)
  - [ ] Botón "Filtros" con badge de count
  - [ ] Scroll independiente
  - [ ] Botón "Limpiar todo"
  - [ ] Botón "Aplicar filtros"
  - **Estimación**: 20 min
  - **Prioridad**: 🟡 MEDIA

- [ ] **TASK-010**: Crear `PriceRangeFilter.tsx`
  - [ ] Slider de doble extremo (min-max)
  - [ ] Inputs numéricos editables
  - [ ] Rango sugerido: €0 - €500+
  - [ ] Histograma de distribución (opcional)
  - [ ] Formato de moneda (€)
  - [ ] Validación (min < max)
  - **Estimación**: 30 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-011**: Crear `PropertyTypeFilter.tsx`
  - [ ] Checkboxes múltiples
  - [ ] Tipos: Casa completa, Habitación privada, Habitación compartida
  - [ ] Iconos visuales por tipo
  - [ ] Contador de resultados por tipo
  - [ ] Selección múltiple permitida
  - **Estimación**: 20 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-012**: Crear `AmenitiesFilter.tsx`
  - [ ] Grid de amenidades con iconos
  - [ ] Checkboxes: WiFi, Cocina, AC, Estacionamiento, Piscina, Gym, etc.
  - [ ] Sección colapsable "Mostrar más"
  - [ ] Mínimo 15 amenidades
  - [ ] Búsqueda de amenidad (si muchas)
  - [ ] Badge con count de seleccionadas
  - **Estimación**: 35 min
  - **Prioridad**: 🟡 MEDIA

- [ ] **TASK-013**: Crear `RatingFilter.tsx`
  - [ ] Radio buttons con estrellas
  - [ ] Opciones: Cualquiera, 3.5+, 4.0+, 4.5+
  - [ ] Mostrar count de resultados
  - [ ] Iconos de estrellas visuales
  - **Estimación**: 15 min
  - **Prioridad**: 🟡 MEDIA

- [ ] **TASK-014**: Crear `BedroomsFilter.tsx`
  - [ ] Botones de selección rápida: Any, 1, 2, 3, 4, 5+
  - [ ] Solo selección única
  - [ ] Iconos de cama
  - **Estimación**: 15 min
  - **Prioridad**: 🟡 MEDIA

---

### 📊 FASE 4: VISUALIZACIÓN DE RESULTADOS

- [ ] **TASK-015**: Crear `SearchResults.tsx` (Container)
  - [ ] Layout: Sidebar (filtros) + Main (resultados)
  - [ ] Responsive (filtros arriba en mobile)
  - [ ] Header con count: "X alojamientos encontrados"
  - [ ] Loading skeleton mientras busca
  - [ ] Empty state si sin resultados
  - [ ] Error state si falla búsqueda
  - **Estimación**: 25 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-016**: Crear `PropertyCard.tsx` (Card de propiedad)
  - [ ] Imagen principal con carousel (opcional)
  - [ ] Botón ❤️ favorito (superior derecha)
  - [ ] Badge de "Superhost" si aplica
  - [ ] Título del alojamiento
  - [ ] Ubicación (ciudad, país)
  - [ ] Rating con estrellas + número de reviews
  - [ ] Tipo de propiedad
  - [ ] Precio por noche destacado
  - [ ] Hover effect con elevación
  - [ ] Click → redirige a detalle
  - **Estimación**: 40 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-017**: Crear `SearchResultsGrid.tsx`
  - [ ] Grid responsive: 1 col mobile, 2 tablet, 3-4 desktop
  - [ ] Gap adecuado entre cards
  - [ ] Integración con PropertyCard
  - [ ] Skeleton loaders (8 cards)
  - [ ] Animación de entrada (fade in)
  - **Estimación**: 20 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-018**: Crear `SortDropdown.tsx`
  - [ ] Dropdown en header de resultados
  - [ ] Opciones: Recomendados, Precio ↑, Precio ↓, Mejor valorados
  - [ ] Icono de ordenamiento
  - [ ] Aplicación inmediata al cambiar
  - [ ] Estado visual del orden activo
  - **Estimación**: 20 min
  - **Prioridad**: 🟡 MEDIA

- [ ] **TASK-019**: Implementar paginación o infinite scroll
  - [ ] Opción A: Paginación clásica (números de página)
  - [ ] Opción B: Infinite scroll con Intersection Observer
  - [ ] Loading state al cargar más
  - [ ] Botón "Cargar más" como fallback
  - [ ] Scroll to top al cambiar página
  - **Estimación**: 30 min
  - **Prioridad**: 🟡 MEDIA

---

### 🗺️ FASE 5: VISTA DE MAPA (OPCIONAL)

- [ ] **TASK-020**: Crear `MapView.tsx` (Componente de mapa)
  - [ ] Integración con Leaflet o alternativa simple
  - [ ] Markers por cada propiedad
  - [ ] Popup con info básica al hover
  - [ ] Click en marker → destacar card
  - [ ] Sincronización con filtros
  - [ ] Zoom y pan funcional
  - **Estimación**: 60 min
  - **Prioridad**: ⚪ BAJA (Nice to have)

- [ ] **TASK-021**: Crear toggle Lista/Mapa
  - [ ] Botón toggle "Mostrar mapa" / "Ocultar mapa"
  - [ ] Vista split 60/40 (lista/mapa)
  - [ ] Vista full mapa con cards flotantes
  - [ ] Responsive (mapa abajo en mobile)
  - [ ] Persistencia de preferencia
  - **Estimación**: 25 min
  - **Prioridad**: ⚪ BAJA (Nice to have)

---

### 📄 FASE 6: PÁGINA DE BÚSQUEDA

- [ ] **TASK-022**: Crear `app/buscar/page.tsx`
  - [ ] Page component principal
  - [ ] Integración de SearchBar en header
  - [ ] Integración de FilterPanel
  - [ ] Integración de SearchResults
  - [ ] Metadata SEO
  - [ ] Parámetros de URL (query params)
  - [ ] Estado inicial desde URL
  - **Estimación**: 30 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-023**: Crear context/hook de búsqueda
  - [ ] `SearchContext` con estado global
  - [ ] `useSearch()` hook personalizado
  - [ ] Manejo de query, filters, results
  - [ ] Persistencia en URL (query params)
  - [ ] Debounce en búsquedas (500ms)
  - [ ] Loading states
  - **Estimación**: 35 min
  - **Prioridad**: 🔴 CRÍTICA

---

### 🔗 FASE 7: INTEGRACIÓN CON HOME

- [ ] **TASK-024**: Modificar `HeroSection.tsx`
  - [ ] Añadir SearchBar completo
  - [ ] CTA "Buscar" redirige a /buscar con params
  - [ ] Diseño integrado con hero
  - [ ] Animación de entrada
  - **Estimación**: 20 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-025**: Crear componente `QuickFilters.tsx`
  - [ ] Chips/badges en home para búsquedas rápidas
  - [ ] Ejemplos: "Playa", "Montaña", "Ciudad", "Económico"
  - [ ] Click redirige a /buscar con filtro aplicado
  - [ ] Scroll horizontal en mobile
  - **Estimación**: 20 min
  - **Prioridad**: 🟡 MEDIA

- [ ] **TASK-026**: Modificar `PromotionsSection.tsx`
  - [ ] Integrar con datos reales de MOCK_PROPERTIES
  - [ ] Click en card → va a /buscar o /propiedad/[id]
  - [ ] Mantener diseño actual
  - **Estimación**: 15 min
  - **Prioridad**: 🟡 MEDIA

---

### 🧪 FASE 8: TESTING Y DOCUMENTACIÓN

- [ ] **TASK-027**: Testing manual completo
  - [ ] Búsqueda por ubicación con autocompletado
  - [ ] Selección de fechas (diferentes rangos)
  - [ ] Selección de huéspedes (diferentes combinaciones)
  - [ ] Cada filtro individualmente
  - [ ] Combinación de múltiples filtros
  - [ ] Ordenamiento de resultados
  - [ ] Paginación/infinite scroll
  - [ ] Responsive en mobile, tablet, desktop
  - [ ] Performance (búsquedas rápidas)
  - [ ] Estados de loading y error
  - **Estimación**: 60 min
  - **Prioridad**: 🔴 CRÍTICA

- [ ] **TASK-028**: Crear documentación
  - [ ] `SEARCH_DOCUMENTATION.md` con guía completa
  - [ ] Ejemplos de uso de componentes
  - [ ] Estructura de datos MOCK
  - [ ] API de búsqueda documentada
  - [ ] Troubleshooting común
  - [ ] Screenshots/wireframes
  - **Estimación**: 30 min
  - **Prioridad**: 🟡 MEDIA

---

## 📈 MÉTRICAS DE PROGRESO

### Por Fase
- **FASE 1 - Base de Datos MOCK**: 0/4 tareas (0%)
- **FASE 2 - Búsqueda Principal**: 0/4 tareas (0%)
- **FASE 3 - Filtros Avanzados**: 0/6 tareas (0%)
- **FASE 4 - Resultados**: 0/5 tareas (0%)
- **FASE 5 - Mapa (Opcional)**: 0/2 tareas (0%)
- **FASE 6 - Página**: 0/2 tareas (0%)
- **FASE 7 - Integración**: 0/3 tareas (0%)
- **FASE 8 - Testing**: 0/2 tareas (0%)

### Por Prioridad
- **🔴 CRÍTICA**: 0/16 tareas
- **🟡 MEDIA**: 0/10 tareas
- **⚪ BAJA**: 0/2 tareas

### Tiempo Estimado Total
- **Total**: ~11 horas de desarrollo
- **Por fase**:
  - Fase 1: 1h 45min
  - Fase 2: 2h 15min
  - Fase 3: 2h 15min
  - Fase 4: 2h 15min
  - Fase 5: 1h 25min (opcional)
  - Fase 6: 1h 05min
  - Fase 7: 55min
  - Fase 8: 1h 30min

---

## 🎯 HISTORIAS DE USUARIO DETALLADAS

### Epic 1: Búsqueda Básica

**US-SEARCH-001**: Como usuario, quiero buscar alojamientos por ciudad
- **Prioridad**: 🔴 ALTA
- **Story Points**: 8
- **Criterios de Aceptación**:
  - ✅ Input de búsqueda visible en home y página de búsqueda
  - ✅ Autocompletado muestra ciudades mientras escribo
  - ✅ Puedo seleccionar ciudad con mouse o teclado
  - ✅ Búsqueda se ejecuta al seleccionar ciudad
  - ✅ Resultados muestran propiedades en esa ciudad
  - ✅ Loading state durante búsqueda
  - ✅ Mensaje si no hay resultados

**US-SEARCH-002**: Como usuario, quiero seleccionar fechas de mi estadía
- **Prioridad**: 🔴 ALTA
- **Story Points**: 8
- **Criterios de Aceptación**:
  - ✅ Calendario visual al hacer click
  - ✅ Puedo seleccionar check-in y check-out
  - ✅ Fechas pasadas deshabilitadas
  - ✅ Se muestra número de noches
  - ✅ Validación: check-out > check-in
  - ✅ Rango mínimo: 1 noche, máximo: 365 noches
  - ✅ Formato de fecha legible (ej: "15 Nov - 20 Nov")

**US-SEARCH-003**: Como usuario, quiero especificar cuántos huéspedes somos
- **Prioridad**: 🔴 ALTA
- **Story Points**: 5
- **Criterios de Aceptación**:
  - ✅ Selector con categorías: Adultos, Niños, Bebés
  - ✅ Botones +/- para cada categoría
  - ✅ Mínimo 1 adulto requerido
  - ✅ Máximos razonables por categoría
  - ✅ Resumen visible: "X huéspedes"
  - ✅ Filtro se aplica a resultados

### Epic 2: Filtros Avanzados

**US-SEARCH-004**: Como usuario, quiero filtrar por rango de precio
- **Prioridad**: 🔴 ALTA
- **Story Points**: 5
- **Criterios de Aceptación**:
  - ✅ Slider de doble extremo fácil de usar
  - ✅ Inputs numéricos editables
  - ✅ Rango inicial: €0 - €500+
  - ✅ Actualización en tiempo real de resultados
  - ✅ Contador: "X alojamientos en este rango"

**US-SEARCH-005**: Como usuario, quiero filtrar por tipo de alojamiento
- **Prioridad**: 🟡 MEDIA
- **Story Points**: 3
- **Criterios de Aceptación**:
  - ✅ Checkboxes: Casa completa, Habitación privada, Habitación compartida
  - ✅ Iconos visuales por tipo
  - ✅ Selección múltiple permitida
  - ✅ Contador de resultados por tipo

**US-SEARCH-006**: Como usuario, quiero filtrar por amenidades
- **Prioridad**: 🟡 MEDIA
- **Story Points**: 5
- **Criterios de Aceptación**:
  - ✅ Lista de amenidades comunes con checkboxes
  - ✅ Iconos representativos (WiFi, Piscina, etc.)
  - ✅ Sección "Mostrar más" colapsable
  - ✅ Mínimo 15 amenidades disponibles
  - ✅ Badge con número de amenidades seleccionadas

**US-SEARCH-007**: Como usuario, quiero filtrar por calificación mínima
- **Prioridad**: 🟡 MEDIA
- **Story Points**: 3
- **Criterios de Aceptación**:
  - ✅ Radio buttons: Cualquiera, 3.5+, 4.0+, 4.5+
  - ✅ Estrellas visuales
  - ✅ Contador de resultados por rating

**US-SEARCH-008**: Como usuario, quiero filtrar por número de habitaciones
- **Prioridad**: 🟡 MEDIA
- **Story Points**: 2
- **Criterios de Aceptación**:
  - ✅ Botones de selección rápida: Any, 1, 2, 3, 4, 5+
  - ✅ Solo una selección activa
  - ✅ Icono de cama visible

### Epic 3: Visualización de Resultados

**US-SEARCH-009**: Como usuario, quiero ver resultados en formato grid
- **Prioridad**: 🔴 ALTA
- **Story Points**: 8
- **Criterios de Aceptación**:
  - ✅ Grid responsive (1-4 columnas según pantalla)
  - ✅ Cards atractivas con imagen, título, precio, rating
  - ✅ Botón de favorito en cada card
  - ✅ Hover effect (elevación)
  - ✅ Click lleva a detalle de propiedad
  - ✅ Loading skeletons mientras carga

**US-SEARCH-010**: Como usuario, quiero ordenar resultados
- **Prioridad**: 🟡 MEDIA
- **Story Points**: 3
- **Criterios de Aceptación**:
  - ✅ Dropdown con opciones de ordenamiento
  - ✅ Opciones: Recomendados, Precio ↑↓, Rating
  - ✅ Aplicación inmediata al cambiar
  - ✅ Estado visual del orden activo

**US-SEARCH-011**: Como usuario, quiero ver la ubicación en un mapa
- **Prioridad**: ⚪ BAJA
- **Story Points**: 13
- **Criterios de Aceptación**:
  - ✅ Toggle "Mostrar mapa"
  - ✅ Vista split: Lista + Mapa
  - ✅ Markers en ubicaciones
  - ✅ Click en marker destaca card correspondiente
  - ✅ Sincronización con filtros

**US-SEARCH-012**: Como usuario, quiero ver más resultados sin perder mi lugar
- **Prioridad**: 🟡 MEDIA
- **Story Points**: 5
- **Criterios de Aceptación**:
  - ✅ Paginación o infinite scroll
  - ✅ Loading state al cargar más
  - ✅ No se pierde scroll position
  - ✅ Indicador de "X de Y resultados"

### Epic 4: Experiencia de Usuario

**US-SEARCH-013**: Como usuario, quiero ver sugerencias de búsqueda rápidas
- **Prioridad**: 🟡 MEDIA
- **Story Points**: 3
- **Criterios de Aceptación**:
  - ✅ Chips/badges en home: "Playa", "Montaña", etc.
  - ✅ Click aplica filtro y busca
  - ✅ Diseño atractivo y visible

**US-SEARCH-014**: Como usuario, quiero ver un mensaje claro si no hay resultados
- **Prioridad**: 🔴 ALTA
- **Story Points**: 2
- **Criterios de Aceptación**:
  - ✅ Ilustración o icono amigable
  - ✅ Mensaje: "No encontramos alojamientos con estos filtros"
  - ✅ Sugerencia: "Intenta ajustar tus filtros"
  - ✅ Botón "Limpiar filtros"

**US-SEARCH-015**: Como usuario, quiero que mi búsqueda se guarde en la URL
- **Prioridad**: 🟡 MEDIA
- **Story Points**: 5
- **Criterios de Aceptación**:
  - ✅ Parámetros de búsqueda en URL
  - ✅ Puedo compartir link con búsqueda específica
  - ✅ Al recargar página, mantiene búsqueda
  - ✅ Botón atrás del navegador funciona correctamente

---

## 🎨 ESPECIFICACIONES DE DISEÑO

### Paleta de Colores (Airbnb)
```css
--primary: #FF385C      /* Rojo Airbnb para CTAs */
--primary-dark: #E31C5F /* Hover states */
--text-primary: #222222 /* Texto principal */
--text-secondary: #717171 /* Texto secundario */
--border: #DDDDDD       /* Bordes */
--background: #FFFFFF   /* Fondo cards */
--background-gray: #F7F7F7 /* Fondo alternativo */
```

### Tipografía
- **Fuente**: DM Sans (ya configurada)
- **Títulos**: 600-700 weight
- **Cuerpo**: 400-500 weight
- **Tamaños**:
  - Título card: 16px
  - Precio: 18px (bold)
  - Rating: 14px
  - Descripción: 14px

### Espaciado
- **Gap entre cards**: 24px (desktop), 16px (mobile)
- **Padding cards**: 16px
- **Margin secciones**: 48px (vertical)

### Animaciones
- **Hover card**: `transform: translateY(-4px)` + `box-shadow: 0 8px 16px rgba(0,0,0,0.12)`
- **Transición**: `all 0.2s ease`
- **Loading**: Skeleton pulse animation

---

## 📐 WIREFRAMES (DESCRIPCIÓN TEXTUAL)

### Página de Búsqueda (`/buscar`)

```
┌─────────────────────────────────────────────────────────────────┐
│  Header con SearchBar Sticky                                    │
│  [📍 Barcelona] [📅 15-20 Nov] [👥 2 huésp.] [🔍 Buscar]       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┬───────────────────────────────────────────────────┐
│             │                                                   │
│  FILTROS    │  Barcelona - 156 alojamientos                     │
│             │  Ordenar: [Recomendados ▼]                        │
│  💰 Precio  │                                                   │
│  €0 ═●══●ō€500 │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│             │  │ [IMG]   │ │ [IMG]   │ │ [IMG]   │        │
│  🏠 Tipo    │  │ ❤️      │ │ ❤️      │ │ ❤️      │        │
│  ☑ Casa     │  │ Villa    │ │ Apartam. │ │ Loft    │        │
│  ☐ Hab.priv.│  │ €89/noche│ │ €75/noche│ │ €140/no.│        │
│  ☐ Hab.comp.│  │ ⭐ 4.8   │ │ ⭐ 4.9   │ │ ⭐ 4.7   │        │
│             │  └─────────┘ └─────────┘ └─────────┘        │
│  ✨ Amenid. │                                                   │
│  ☑ WiFi     │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  ☑ Cocina   │  │ ...     │ │ ...     │ │ ...     │        │
│  ☐ Piscina  │  └─────────┘ └─────────┘ └─────────┘        │
│  ☐ AC       │                                                   │
│             │  [Cargar más resultados]                          │
│  ⭐ Calif.  │                                                   │
│  ● 4.0+     │                                                   │
│  ○ 4.5+     │                                                   │
│             │                                                   │
│  🛏️ Habitac.│                                                   │
│  [Any][1][2]│                                                   │
│             │                                                   │
│ [Limpiar]   │                                                   │
└─────────────┴───────────────────────────────────────────────────┘
```

### SearchBar en Hero

```
┌────────────────────────────────────────────────────────────┐
│                   HERO SECTION                              │
│                                                            │
│  Encuentra tu próxima aventura                             │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [📍 Ubicación]  [📅 Fechas]  [👥 Huéspedes]  [🔍]   │ │
│  │                                                       │ │
│  │ ¿A dónde vas?   ¿Cuándo?     ¿Cuántos?       Buscar  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  🏖️ Playa  🏔️ Montaña  🏙️ Ciudad  💰 Económico          │
└────────────────────────────────────────────────────────────┘
```

### Property Card (Detalle)

```
┌───────────────────────┐
│     [Imagen Principal] │
│                        │
│         ❤️             │
│    SUPERHOST           │
└───────────────────────┘
Villa Mediterránea
📍 Barcelona, España
⭐ 4.85 (124 reviews)
🏠 Casa completa
────────────────────────
€89 / noche
```

---

## 🗄️ ESTRUCTURA DE DATOS MOCK

### Property (Modelo de Alojamiento)

```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  host: {
    id: string;
    name: string;
    isSuperhost: boolean;
    avatar: string;
  };
  location: {
    city: string;
    country: string;
    region: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  propertyType: 'entire_place' | 'private_room' | 'shared_room';
  roomType: 'apartment' | 'house' | 'villa' | 'loft' | 'cabin' | 'hotel';
  pricing: {
    basePrice: number; // Por noche
    currency: 'EUR' | 'USD';
    cleaningFee?: number;
    serviceFee?: number;
    discounts?: {
      weekly?: number;
      monthly?: number;
    };
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  amenities: string[]; // ['wifi', 'kitchen', 'pool', 'ac', 'parking', ...]
  rating: {
    overall: number; // 0-5
    reviewCount: number;
    breakdown?: {
      cleanliness: number;
      accuracy: number;
      communication: number;
      location: number;
      checkIn: number;
      value: number;
    };
  };
  availability: {
    minNights: number;
    maxNights: number;
    instantBook: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Ejemplo de Propiedad

```typescript
{
  id: 'prop-001',
  title: 'Villa Mediterránea con Vista al Mar',
  description: 'Hermosa villa con impresionantes vistas al Mediterráneo...',
  host: {
    id: 'host-001',
    name: 'María García',
    isSuperhost: true,
    avatar: 'https://i.pravatar.cc/150?img=45'
  },
  location: {
    city: 'Barcelona',
    country: 'España',
    region: 'Cataluña',
    address: 'Barceloneta, Barcelona',
    coordinates: { lat: 41.3874, lng: 2.1901 }
  },
  images: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
  ],
  propertyType: 'entire_place',
  roomType: 'villa',
  pricing: {
    basePrice: 89,
    currency: 'EUR',
    cleaningFee: 25,
    serviceFee: 15
  },
  capacity: {
    guests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2
  },
  amenities: ['wifi', 'kitchen', 'pool', 'ac', 'parking', 'beach_access', 'bbq'],
  rating: {
    overall: 4.85,
    reviewCount: 124,
    breakdown: {
      cleanliness: 4.9,
      accuracy: 4.8,
      communication: 4.9,
      location: 4.7,
      checkIn: 4.8,
      value: 4.9
    }
  },
  availability: {
    minNights: 2,
    maxNights: 30,
    instantBook: true
  },
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-11-01')
}
```

---

## ✅ CRITERIOS DE ACEPTACIÓN DEL MILESTONE

### Funcionales
- ✅ Usuario puede buscar por ubicación con autocompletado
- ✅ Usuario puede seleccionar fechas de check-in/check-out
- ✅ Usuario puede especificar número de huéspedes
- ✅ Usuario puede filtrar por precio (rango)
- ✅ Usuario puede filtrar por tipo de propiedad
- ✅ Usuario puede filtrar por amenidades
- ✅ Usuario puede filtrar por calificación
- ✅ Usuario puede filtrar por número de habitaciones
- ✅ Usuario puede ordenar resultados
- ✅ Resultados se muestran en grid responsive
- ✅ Cards muestran información completa y atractiva
- ✅ Búsqueda funciona con múltiples filtros combinados
- ✅ Parámetros persisten en URL (compartible)
- ✅ Paginación o infinite scroll funciona
- ✅ Loading states en todas las búsquedas

### Técnicos
- ✅ 0 errores de TypeScript
- ✅ 0 errores de ESLint
- ✅ Base de datos MOCK con mínimo 20 propiedades
- ✅ Todos los componentes responsive
- ✅ Búsqueda con debounce (no spam de requests)
- ✅ Código documentado y limpio
- ✅ Performance: búsquedas <500ms

### UX/UI
- ✅ Diseño consistente con Airbnb
- ✅ Animaciones suaves
- ✅ Feedback visual en cada acción
- ✅ Empty states amigables
- ✅ Error states informativos
- ✅ Accesibilidad básica (teclado, screen readers)

---

## 📊 MÉTRICAS DE ÉXITO

### KPIs de Búsqueda
- **Uso de búsqueda**: >85% de visitantes la usan
- **Tiempo hasta primera búsqueda**: <15 segundos
- **Refinamientos (filtros)**: >50% usuarios aplican al menos 1 filtro
- **Clicks en resultados**: CTR >20%
- **Búsquedas sin resultados**: <3%

### KPIs de Performance
- **Tiempo de búsqueda**: <500ms
- **Lighthouse score**: >90
- **Bounce rate en /buscar**: <30%

### KPIs de Negocio
- **Engagement**: Tiempo en búsqueda +180%
- **Conversión a detalle**: >25% clicks en cards
- **Retención**: >60% vuelven a buscar

---

## 🚨 RIESGOS Y MITIGACIONES

### Riesgos Técnicos

**R1: Complejidad del sistema de filtros**
- **Impacto**: 🔴 ALTO
- **Probabilidad**: 🟡 MEDIA
- **Mitigación**: 
  - Implementar filtros uno a uno
  - Testing incremental
  - Usar librerías probadas (react-day-picker, radix-ui)

**R2: Performance con muchos resultados**
- **Impacto**: 🟡 MEDIO
- **Probabilidad**: 🟡 MEDIA
- **Mitigación**:
  - Paginación de 20 resultados
  - Virtualización si necesario
  - Debounce en búsquedas
  - Skeleton loaders

**R3: Consistencia de datos MOCK**
- **Impacto**: 🟢 BAJO
- **Probabilidad**: 🟡 MEDIA
- **Mitigación**:
  - Validar estructura de datos
  - Generar datos con script
  - Tests de integridad

### Dependencias

1. ✅ **Milestone 1 completado** (Auth) - Para usuarios autenticados puedan guardar búsquedas
2. ✅ **react-day-picker** ya instalado - Para selector de fechas
3. ✅ **Radix UI** ya instalado - Para popovers, dropdowns, etc.
4. ⚠️ **Librería de mapas** (Opcional) - Leaflet o react-map-gl

---

## 🎯 DEFINICIÓN DE DONE (DoD)

Para cada tarea:

1. ✅ **Código**
   - TypeScript sin errores
   - Componente funcional y tested manualmente
   - Code review aprobado

2. ✅ **Diseño**
   - Implementación fiel a especificaciones
   - Responsive (mobile, tablet, desktop)
   - Animaciones suaves

3. ✅ **Funcionalidad**
   - Búsqueda/filtro funciona correctamente
   - Estados de loading, error, empty implementados
   - Integración con otros componentes

4. ✅ **Documentación**
   - Componente documentado (JSDoc)
   - Props explicados
   - Ejemplos de uso

---

## 🗓️ ROADMAP Y SPRINTS

### Sprint 3 (Semana 1) - Fundación
**Días 1-2**:
- TASK-001 a TASK-004 (Base de datos y servicios)
- Objetivo: Tener datos MOCK completos

**Días 3-5**:
- TASK-005 a TASK-008 (SearchBar y componentes)
- Objetivo: Búsqueda básica funcional

### Sprint 4 (Semana 2) - Filtros
**Días 1-3**:
- TASK-009 a TASK-014 (Panel de filtros)
- Objetivo: Todos los filtros implementados

**Días 4-5**:
- TASK-015 a TASK-019 (Visualización de resultados)
- Objetivo: Grid funcional con ordenamiento

### Sprint 5 (Días adicionales) - Integración
**Días 1-2**:
- TASK-022 a TASK-026 (Página e integraciones)
- Objetivo: Todo conectado

**Día 3**:
- TASK-027 a TASK-028 (Testing y docs)
- Objetivo: Milestone completado

---

## 🚀 SIGUIENTES PASOS POST-MILESTONE 2

Una vez completado Milestone 2:

### Milestone 3: Página de Detalle de Propiedad
- Vista completa de una propiedad
- Galería de imágenes
- Reviews de usuarios
- Sistema de reservas (MOCK)
- Integración con auth y búsqueda

### Milestone 4: Sistema de Favoritos
- Guardar propiedades favoritas
- Página "Mis Favoritos"
- Sincronización con cuenta de usuario

### Milestone 5: Integración con Backend Real
- Migrar de MOCK a API real
- Base de datos real (Supabase/Firebase)
- Search engine (Algolia/Elasticsearch)

---

## 📝 NOTAS IMPORTANTES

### Decisiones Técnicas

**Sin nuevas dependencias grandes**:
- Usar lo que ya está instalado cuando sea posible
- react-day-picker para fechas (ya instalado)
- Radix UI para popovers (ya instalado)
- Lucide React para iconos (ya instalado)

**Modo MOCK completo**:
- Todos los datos en arrays en memoria
- Filtrado y ordenamiento en frontend
- Simular delay de red para realismo

**Priorizar UX**:
- Loading states en todo
- Animaciones suaves
- Feedback inmediato
- Mensajes claros

### Para Producción (Futuro)

- Reemplazar MOCK con API real
- Implementar búsqueda server-side
- Añadir search engine (Algolia)
- Optimizar imágenes (CDN)
- Implementar caching
- Añadir analytics tracking

---

## 📞 RECURSOS Y REFERENCIAS

### Inspiración de UI
- **Airbnb.com** (referencia principal)
- **Booking.com** (filtros avanzados)
- **VRBO** (visualización de resultados)

### Documentación Técnica
- [react-day-picker](https://react-day-picker.js.org/)
- [Radix UI Popover](https://www.radix-ui.com/docs/primitives/components/popover)
- [Unsplash API](https://unsplash.com/developers) (para imágenes)

### Datos de Ejemplo
- Ciudades: Barcelona, Madrid, Valencia, Sevilla, Lisboa, Porto, París, Roma, Londres, Berlín, Ámsterdam, etc.
- Precios: €30-€500 por noche (variedad)
- Amenidades: WiFi, Kitchen, Pool, AC, Parking, Gym, Beach, Mountain, etc.

---

**Última actualización**: 14 de Noviembre, 2025  
**Responsable**: Product Owner  
**Sprint**: Sprint 3-5 (7-10 días de desarrollo)  
**Estado**: 🔵 PLANIFICADO - Listo para iniciar

---

**¿Listo para comenzar el Milestone 2?** 🚀

