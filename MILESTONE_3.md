# 🎯 MILESTONE 3: Página de Detalle de Propiedad

> **Objetivo**: Implementar una página completa de detalle de propiedad con galería, información del host, reviews, calendario de disponibilidad y calculadora de precio.

---

## 📊 ESTADO DEL MILESTONE

| Métrica | Valor |
|---------|-------|
| **Estado General** | 🔵 EN PROGRESO |
| **Fecha Inicio** | _Pendiente_ |
| **Fecha Finalización** | _Pendiente_ |
| **Progreso** | 0/30 tareas (0%) |
| **Prioridad** | 🔴 ALTA |
| **Tiempo Estimado** | 8-10 horas |

---

## 🎯 OBJETIVOS DEL MILESTONE

### Objetivos Principales
1. ✅ Crear página dinámica `/propiedad/[id]`
2. ✅ Galería de imágenes fullscreen funcional
3. ✅ Información completa de la propiedad
4. ✅ Sección del host con datos
5. ✅ Sistema de reviews con calificaciones
6. ✅ Calendario de disponibilidad visual
7. ✅ Calculadora de precio con desglose
8. ✅ Integración con Milestone 1 (Auth) y 2 (Búsqueda)

### Objetivos Secundarios
- ✅ Botones de compartir y favoritos
- ✅ Propiedades similares
- ✅ Mapa de ubicación (simple)
- ✅ Responsive design completo
- ✅ Estados de loading y error

---

## ✅ TO-DO LIST

### 🏗️ FASE 1: FUNDACIÓN Y TIPOS (30-45 min)

#### TASK-001: Crear estructura de archivos ⏱️ 10 min
- [ ] Crear carpeta `app/propiedad/[id]/`
- [ ] Crear `app/propiedad/[id]/page.tsx`
- [ ] Crear `app/propiedad/[id]/loading.tsx`
- [ ] Crear `app/propiedad/[id]/error.tsx`
- [ ] Crear carpeta `components/property/`
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: Ninguna

#### TASK-002: Extender tipos TypeScript ⏱️ 15 min
- [ ] Actualizar `types/search.ts` con tipos adicionales:
  ```typescript
  // Tipos adicionales para detalle
  interface PropertyDetail extends Property {
    description: {
      space: string;
      guestAccess: string;
      otherThings: string;
    };
    rules: string[];
    cancellationPolicy: string;
    responseTime: string;
    responseRate: number;
  }
  
  interface Review {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    rating: number;
    comment: string;
    date: Date;
    helpful: number;
  }
  
  interface CalendarDay {
    date: Date;
    available: boolean;
    price?: number;
    minNights?: number;
  }
  
  interface PriceBreakdown {
    basePrice: number;
    nights: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    total: number;
  }
  ```
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-001

#### TASK-003: Extender Mock Database ⏱️ 20 min
- [ ] Actualizar `lib/search/mock-properties-db.ts`
- [ ] Agregar descripción completa a cada propiedad
- [ ] Agregar reglas de la casa
- [ ] Agregar política de cancelación
- [ ] Crear `lib/search/mock-reviews-db.ts` con reviews por propiedad
- [ ] Crear función `getPropertyById(id: string)`
- [ ] Crear función `getPropertyReviews(propertyId: string)`
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-002

---

### 🖼️ FASE 2: GALERÍA DE IMÁGENES (1.5-2 horas)

#### TASK-004: Componente PropertyGallery ⏱️ 45 min
- [ ] Crear `components/property/PropertyGallery.tsx`
- [ ] Grid de imágenes (1 grande + 4 pequeñas)
- [ ] Botón "Ver todas las fotos"
- [ ] Contador de fotos
- [ ] Responsive (mobile: carrusel)
- **Props**:
  ```typescript
  interface PropertyGalleryProps {
    images: string[];
    title: string;
    onOpenFullscreen: () => void;
  }
  ```
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-001, TASK-002

#### TASK-005: Modal Fullscreen ⏱️ 45 min
- [ ] Crear `components/property/ImageGalleryModal.tsx`
- [ ] Usar Radix Dialog
- [ ] Navegación con flechas (← →)
- [ ] Navegación con teclado
- [ ] Thumbnails en la parte inferior
- [ ] Contador "X de Y"
- [ ] Botón cerrar (ESC también)
- [ ] Zoom básico (opcional)
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-004

#### TASK-006: Integrar Galería ⏱️ 15 min
- [ ] Conectar PropertyGallery con Modal
- [ ] Estado para imagen actual
- [ ] Testing de navegación
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-004, TASK-005

---

### 📝 FASE 3: INFORMACIÓN DE PROPIEDAD (1.5-2 horas)

#### TASK-007: PropertyHeader Component ⏱️ 30 min
- [ ] Crear `components/property/PropertyHeader.tsx`
- [ ] Título de la propiedad
- [ ] Ubicación con icono
- [ ] Rating general + número de reviews
- [ ] Botón compartir
- [ ] Botón favorito (integrado con auth)
- [ ] Breadcrumbs (opcional)
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-003

#### TASK-008: PropertyInfo Component ⏱️ 30 min
- [ ] Crear `components/property/PropertyInfo.tsx`
- [ ] Tipo de alojamiento
- [ ] Capacidad (huéspedes, habitaciones, camas, baños)
- [ ] Descripción completa con "Leer más/menos"
- [ ] Iconos para cada dato
- **Props**:
  ```typescript
  interface PropertyInfoProps {
    property: PropertyDetail;
  }
  ```
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-002, TASK-003

#### TASK-009: HostSection Component ⏱️ 30 min
- [ ] Crear `components/property/HostSection.tsx`
- [ ] Avatar del host
- [ ] Nombre del host
- [ ] Badge "Superanfitrión" (si aplica)
- [ ] Fecha de registro
- [ ] Tasa de respuesta
- [ ] Tiempo de respuesta
- [ ] Botón "Contactar anfitrión" (futuro)
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-003

#### TASK-010: AmenitiesList Component ⏱️ 30 min
- [ ] Crear `components/property/AmenitiesList.tsx`
- [ ] Grid de amenidades con iconos
- [ ] Categorías (Esenciales, Seguridad, etc.)
- [ ] Botón "Ver todas" si >10 amenidades
- [ ] Modal con lista completa
- **Prioridad**: 🟢 MEDIA
- **Dependencias**: TASK-003

---

### ⭐ FASE 4: SISTEMA DE REVIEWS (1-1.5 horas)

#### TASK-011: ReviewsSection Component ⏱️ 20 min
- [ ] Crear `components/property/ReviewsSection.tsx`
- [ ] Header con calificación general
- [ ] Breakdown de calificaciones por categoría:
  - Limpieza
  - Comunicación
  - Llegada
  - Precisión
  - Ubicación
  - Relación calidad-precio
- [ ] Gráfico de barras simple
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-003

#### TASK-012: ReviewCard Component ⏱️ 20 min
- [ ] Crear `components/property/ReviewCard.tsx`
- [ ] Avatar usuario
- [ ] Nombre y fecha
- [ ] Calificación (estrellas)
- [ ] Comentario con "Leer más" si es largo
- [ ] Botón "Útil" (contador)
- **Props**:
  ```typescript
  interface ReviewCardProps {
    review: Review;
  }
  ```
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-002

#### TASK-013: ReviewsList Component ⏱️ 30 min
- [ ] Crear `components/property/ReviewsList.tsx`
- [ ] Paginación (6 reviews por página)
- [ ] Filtro por calificación
- [ ] Ordenamiento (Más recientes, Más útiles)
- [ ] Botón "Ver todas las reseñas" (abre modal)
- [ ] Estado de loading
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-011, TASK-012

---

### 📅 FASE 5: CALENDARIO Y PRECIOS (1.5-2 horas)

#### TASK-014: AvailabilityCalendar Component ⏱️ 45 min
- [ ] Crear `components/property/AvailabilityCalendar.tsx`
- [ ] Usar react-day-picker
- [ ] Marcar días no disponibles
- [ ] Precios por día (opcional, mostrar al hover)
- [ ] Selector de fechas (check-in, check-out)
- [ ] Validación de noches mínimas
- [ ] Navegación entre meses
- **Props**:
  ```typescript
  interface AvailabilityCalendarProps {
    propertyId: string;
    onDateSelect: (checkIn: Date, checkOut: Date) => void;
    unavailableDates: Date[];
    minNights: number;
  }
  ```
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-002

#### TASK-015: PriceCalculator Component ⏱️ 45 min
- [ ] Crear `components/property/PriceCalculator.tsx`
- [ ] Card sticky en desktop
- [ ] Precio por noche destacado
- [ ] Selector de fechas (usa AvailabilityCalendar)
- [ ] Selector de huéspedes (reutilizar GuestsSelector)
- [ ] Desglose de precios:
  - Precio base × noches
  - Tarifa de limpieza
  - Tarifa de servicio (10%)
  - Impuestos (estimado)
  - **Total en grande**
- [ ] Botón "Reservar" (redirige a Milestone 4)
- [ ] Validación de capacidad
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-014

#### TASK-016: Lógica de Cálculo de Precios ⏱️ 30 min
- [ ] Crear `lib/pricing/calculate-price.ts`
- [ ] Función `calculatePriceBreakdown()`
- [ ] Cálculo de noches
- [ ] Aplicar descuentos si aplica (semanal, mensual)
- [ ] Calcular tarifa de servicio
- [ ] Calcular impuestos
- [ ] Tests de casos edge
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-002

---

### 🗺️ FASE 6: EXTRAS Y COMPLEMENTOS (1-1.5 horas)

#### TASK-017: PropertyMap Component ⏱️ 30 min
- [ ] Crear `components/property/PropertyMap.tsx`
- [ ] Usar iframe de Google Maps (simple) o div placeholder
- [ ] Mostrar ubicación aproximada
- [ ] Radio de área (no mostrar dirección exacta)
- [ ] Link "Ver en Google Maps"
- **Prioridad**: 🟢 BAJA
- **Dependencias**: TASK-003

#### TASK-018: PropertyRules Component ⏱️ 20 min
- [ ] Crear `components/property/PropertyRules.tsx`
- [ ] Lista de reglas de la casa
- [ ] Iconos para cada regla
- [ ] Política de cancelación
- [ ] Información de seguridad
- **Prioridad**: 🟢 MEDIA
- **Dependencias**: TASK-003

#### TASK-019: SimilarProperties Component ⏱️ 30 min
- [ ] Crear `components/property/SimilarProperties.tsx`
- [ ] Carrusel horizontal de propiedades
- [ ] Reutilizar PropertyCard
- [ ] Filtrar por ubicación similar
- [ ] Máximo 6 propiedades
- [ ] Navegación con flechas
- **Prioridad**: 🟢 BAJA
- **Dependencias**: TASK-003

#### TASK-020: ShareButton Component ⏱️ 15 min
- [ ] Crear `components/property/ShareButton.tsx`
- [ ] Usar Radix Popover
- [ ] Copiar link
- [ ] Compartir en redes (mock)
- [ ] Toast de confirmación
- **Prioridad**: 🟢 BAJA
- **Dependencias**: Ninguna

---

### 📱 FASE 7: PÁGINA PRINCIPAL Y LAYOUT (1-1.5 horas)

#### TASK-021: Página `/propiedad/[id]` ⏱️ 45 min
- [ ] Implementar `app/propiedad/[id]/page.tsx`
- [ ] Obtener datos con `getPropertyById()`
- [ ] Layout de 2 columnas (info + precio sticky)
- [ ] Breadcrumbs
- [ ] Integrar todos los componentes:
  - PropertyGallery
  - PropertyHeader
  - PropertyInfo
  - HostSection
  - AmenitiesList
  - ReviewsSection
  - PropertyMap
  - PropertyRules
  - SimilarProperties
- [ ] Estados de loading
- [ ] Manejo de errores (404 si no existe)
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TODAS las anteriores

#### TASK-022: Loading State ⏱️ 15 min
- [ ] Crear `app/propiedad/[id]/loading.tsx`
- [ ] Skeleton de galería
- [ ] Skeleton de información
- [ ] Skeleton de reviews
- [ ] Usar componentes Skeleton de Shadcn
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-021

#### TASK-023: Error State ⏱️ 15 min
- [ ] Crear `app/propiedad/[id]/error.tsx`
- [ ] Mensaje de error amigable
- [ ] Botón "Volver a buscar"
- [ ] Botón "Intentar de nuevo"
- [ ] 404 personalizado si propiedad no existe
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-021

#### TASK-024: Responsive Design ⏱️ 30 min
- [ ] Desktop: Layout 2 columnas (8/4)
- [ ] Tablet: Stack vertical
- [ ] Mobile: Stack vertical con precio sticky bottom
- [ ] Galería responsive (grid → carrusel)
- [ ] Ajustes de padding/margin
- [ ] Testing en diferentes tamaños
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-021

---

### 🔗 FASE 8: INTEGRACIÓN (30-45 min)

#### TASK-025: Integrar con Búsqueda ⏱️ 15 min
- [ ] PropertyCard redirige a `/propiedad/[id]`
- [ ] Usar Link de Next.js
- [ ] Prefetch automático
- [ ] Back button funciona correctamente
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-021

#### TASK-026: Integrar con Auth ⏱️ 15 min
- [ ] Botón favorito requiere login
- [ ] Guardar favoritos en contexto de usuario
- [ ] Toast al agregar/quitar favorito
- [ ] Sincronizar estado con PropertyCard
- **Prioridad**: 🟡 ALTA
- **Dependencias**: TASK-007, Milestone 1

#### TASK-027: Integrar con Constants ⏱️ 15 min
- [ ] Usar `APP_CONFIG` para límites
- [ ] Usar `UI_LABELS` para textos
- [ ] Usar `formatPrice()` para precios
- [ ] Usar `formatDate()` para fechas
- [ ] Centralizar mensajes de error/éxito
- **Prioridad**: 🟡 ALTA
- **Dependencias**: lib/constants.ts

---

### 🧪 FASE 9: TESTING Y DOCUMENTACIÓN (1 hora)

#### TASK-028: Testing Manual Completo ⏱️ 30 min
- [ ] Testing de flujo completo:
  1. Buscar propiedad
  2. Hacer click en PropertyCard
  3. Ver galería fullscreen
  4. Navegar entre imágenes
  5. Leer descripción completa
  6. Ver reviews
  7. Seleccionar fechas
  8. Calcular precio
  9. Agregar a favoritos
  10. Compartir link
- [ ] Testing responsive (mobile, tablet, desktop)
- [ ] Testing de estados de error
- [ ] Testing de loading states
- [ ] Testing de validaciones
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-021

#### TASK-029: Verificar Linting ⏱️ 10 min
- [ ] Ejecutar `npm run lint`
- [ ] Corregir errores
- [ ] Verificar tipos TypeScript
- [ ] Sin warnings
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TODAS

#### TASK-030: Documentación ⏱️ 20 min
- [ ] Crear `MILESTONE_3_COMPLETADO.md`
- [ ] Documentar componentes nuevos
- [ ] Screenshots de la página
- [ ] Guía de testing
- [ ] Actualizar README si es necesario
- **Prioridad**: 🟢 MEDIA
- **Dependencias**: TASK-028, TASK-029

---

## 📁 ESTRUCTURA DE ARCHIVOS A CREAR

```
/app
  /propiedad/[id]/
    page.tsx              # Página principal de detalle
    loading.tsx           # Loading state
    error.tsx             # Error state

/components
  /property/
    PropertyGallery.tsx           # Grid de imágenes
    ImageGalleryModal.tsx         # Modal fullscreen
    PropertyHeader.tsx            # Título, ubicación, rating
    PropertyInfo.tsx              # Info básica
    HostSection.tsx               # Sección del anfitrión
    AmenitiesList.tsx             # Lista de amenidades
    ReviewsSection.tsx            # Header de reviews
    ReviewCard.tsx                # Tarjeta de review
    ReviewsList.tsx               # Lista paginada
    AvailabilityCalendar.tsx      # Calendario
    PriceCalculator.tsx           # Calculadora sticky
    PropertyMap.tsx               # Mapa de ubicación
    PropertyRules.tsx             # Reglas de la casa
    SimilarProperties.tsx         # Carrusel de similares
    ShareButton.tsx               # Botón compartir

/lib
  /search/
    mock-reviews-db.ts            # Reviews mock
  /pricing/
    calculate-price.ts            # Lógica de cálculo

/types
  search.ts (actualizar)          # Tipos adicionales
```

**Total**: ~18 archivos nuevos

---

## 🎨 DISEÑO Y UI

### Paleta de Colores (Airbnb)
```css
--primary: #FF385C (rosa Airbnb)
--primary-dark: #E31C5F
--text: #222222
--text-light: #717171
--border: #DDDDDD
--background: #FFFFFF
```

### Componentes UI a Usar
- ✅ Radix Dialog (Modal fullscreen)
- ✅ Radix Popover (Compartir, Calendario)
- ✅ react-day-picker (Calendario)
- ✅ Lucide Icons (Todos los iconos)
- ✅ Sonner (Toasts)
- ✅ Skeleton (Loading states)

### Layout Desktop
```
+------------------------------------------+
|  Header con breadcrumbs                  |
+------------------------------------------+
|                                          |
|  [Gallery Grid - 5 fotos]                |
|                                          |
+------------------------------------------+
|  Info (8 cols)         |  Price (4 cols) |
|  - Header              |  [Sticky Card]   |
|  - Property Info       |  - Precio        |
|  - Host Section        |  - Calendario    |
|  - Amenidades          |  - Huéspedes     |
|  - Reviews             |  - Desglose      |
|  - Map                 |  - Botón         |
|  - Rules               |                  |
|  - Similar Properties  |                  |
+------------------------+------------------+
```

---

## 🔧 STACK TECNOLÓGICO

### Ya Instalado (NO agregar nada nuevo)
- ✅ TypeScript 5.2.2
- ✅ Next.js 13.5.1 (App Router)
- ✅ React 18.2.0
- ✅ Tailwind CSS 3.3.3
- ✅ Radix UI
- ✅ React Day Picker
- ✅ Lucide React
- ✅ Sonner
- ✅ date-fns

---

## ⚠️ REGLAS IMPORTANTES (.cursorrules)

### DEBES
1. ✅ Usar TypeScript SIMPLE (no generics complejos)
2. ✅ Componentes < 100 líneas (dividir si crece)
3. ✅ Props tipadas pero simples
4. ✅ Usar `lib/constants.ts` para valores
5. ✅ Manejo de errores robusto
6. ✅ Estados de loading y error
7. ✅ Responsive design
8. ✅ 'use client' SOLO cuando necesites hooks

### NO DEBES
1. ❌ Instalar NINGUNA dependencia nueva
2. ❌ Usar Context API (usa props y useState)
3. ❌ Tipos TypeScript complejos
4. ❌ Optimizaciones prematuras (memo, callback)
5. ❌ CSS Modules o styled-components
6. ❌ Testing automático

---

## 📊 CRITERIOS DE ACEPTACIÓN

### Funcionalidad
- [ ] Usuario puede ver todas las fotos en fullscreen
- [ ] Usuario puede navegar entre fotos con teclado
- [ ] Usuario puede leer descripción completa
- [ ] Usuario puede ver información del host
- [ ] Usuario puede ver todas las amenidades
- [ ] Usuario puede leer reviews con paginación
- [ ] Usuario puede seleccionar fechas en calendario
- [ ] Usuario puede calcular precio total
- [ ] Usuario puede agregar a favoritos (si está autenticado)
- [ ] Usuario puede compartir la propiedad
- [ ] Usuario puede ver propiedades similares
- [ ] Usuario puede regresar a búsqueda

### Técnica
- [ ] 0 errores de TypeScript
- [ ] 0 errores de linting
- [ ] Todos los componentes < 100 líneas
- [ ] Usa constantes de lib/constants.ts
- [ ] Manejo de errores en todos los componentes
- [ ] Loading states implementados
- [ ] Responsive design funcional
- [ ] Navegación con Link de Next.js

### UX/UI
- [ ] Loading state suave (skeleton)
- [ ] Error state amigable
- [ ] Animaciones suaves (transitions)
- [ ] Hover states claros
- [ ] Feedback visual en interacciones
- [ ] Textos e iconos alineados correctamente
- [ ] Contraste adecuado (accesibilidad)

---

## ⏱️ ESTIMACIÓN DE TIEMPO

### Por Fase
```
FASE 1: Fundación         → 30-45 min
FASE 2: Galería           → 1.5-2 horas
FASE 3: Información       → 1.5-2 horas
FASE 4: Reviews           → 1-1.5 horas
FASE 5: Calendario/Precio → 1.5-2 horas
FASE 6: Extras            → 1-1.5 horas
FASE 7: Página            → 1-1.5 horas
FASE 8: Integración       → 30-45 min
FASE 9: Testing/Docs      → 1 hora
```

### Total
- **Optimista**: 7-8 horas
- **Realista**: 8-10 horas  ⭐ (recomendado)
- **Conservador**: 10-12 horas

### Distribución Recomendada
```
Día 1 (4-5 horas):
├─ Fases 1-3: Setup + Galería + Info
└─ Commit intermedio

Día 2 (4-5 horas):
├─ Fases 4-9: Reviews + Calendario + Testing
└─ Commit final
```

---

## 🚀 DEFINICIÓN DE "DONE"

Para considerar el Milestone 3 COMPLETADO:

1. ✅ **Todas las 30 tareas completadas**
2. ✅ **0 errores de linting**
3. ✅ **0 errores de TypeScript**
4. ✅ **Testing manual exitoso**
5. ✅ **Responsive design funcional**
6. ✅ **Integración con Milestone 1 y 2**
7. ✅ **Commit y push a GitHub**
8. ✅ **Documentación actualizada**

---

## 🔗 DEPENDENCIAS

### Del Proyecto
- ✅ Milestone 1 (Auth) - Para favoritos
- ✅ Milestone 2 (Búsqueda) - Para datos de propiedades
- ✅ lib/constants.ts - Para configuración
- ✅ lib/utils.ts - Para funciones helper

### Técnicas
- ✅ Next.js App Router
- ✅ TypeScript
- ✅ Radix UI
- ✅ Tailwind CSS
- ✅ react-day-picker

---

## 🎯 SIGUIENTE PASO

Una vez completado Milestone 3:
→ **Milestone 4: Sistema de Reservas**

---

## 📝 NOTAS IMPORTANTES

1. **Simplicidad primero**: Implementa funcionalidad básica antes de agregar extras
2. **Testing continuo**: Prueba cada componente al terminarlo
3. **Commits frecuentes**: No esperes a terminar todo para hacer commit
4. **Reutilizar código**: Usa componentes existentes cuando sea posible
5. **Preguntar antes de agregar**: Si necesitas algo nuevo, pregunta primero

---

**Fecha de Creación**: 15 Noviembre 2025  
**Autor**: Product Owner  
**Versión**: 1.0

---

🚀 **¡Listo para comenzar!** Sigue las tareas en orden y marca cada una al completarla.

