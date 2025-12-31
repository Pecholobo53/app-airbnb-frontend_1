# ❤️ MILESTONE 7: Módulo de Favoritos - Integración con API REST

> **Objetivo**: Reemplazar el servicio MOCK de favoritos con integración real a la API REST del backend, manteniendo toda la funcionalidad existente y siguiendo el mismo patrón de otros servicios (auth, bookings, properties).

---

## 📊 ESTADO DEL MILESTONE

| Métrica | Valor |
|---------|-------|
| **Estado General** | ⚪ PENDIENTE |
| **Fecha Inicio** | _Pendiente_ |
| **Fecha Finalización** | _Pendiente_ |
| **Progreso** | 0/5 tareas (0%) |
| **Prioridad** | 🟡 MEDIA |
| **Dependencias** | ✅ Milestone 1 (Auth), ✅ Milestone 2 (Búsqueda), ✅ Milestone 3 (Detalle) |
| **Tiempo Estimado** | 3-4 horas |

---

## 🎯 VISIÓN DEL PRODUCTO

### Contexto
El módulo de favoritos actualmente funciona con datos MOCK. Los usuarios pueden:
- Ver sus propiedades favoritas en `/favoritos`
- Añadir/eliminar favoritos desde cualquier propiedad
- Ver el estado de favorito en tiempo real

Sin embargo, estos datos se pierden al recargar la página porque están en memoria. Necesitamos:
1. **Persistir favoritos** en el backend
2. **Sincronizar favoritos** entre dispositivos
3. **Mantener favoritos** después de cerrar sesión y volver a iniciar

### Objetivo Estratégico
Migrar el módulo de favoritos de MOCK a API REST real, permitiendo:
1. ❤️ **Persistencia** de favoritos en base de datos
2. 🔄 **Sincronización** entre dispositivos
3. 🚀 **Mejor rendimiento** con caché y optimizaciones
4. 🛡️ **Validación** en backend de permisos y datos
5. 📊 **Estadísticas** de favoritos (opcional, futuro)

### Impacto Esperado
- ✅ **100% persistencia** de favoritos
- 🔄 **Sincronización** entre dispositivos
- ⚡ **Mejor UX** con feedback inmediato
- 🛡️ **Seguridad** mejorada con validación backend

---

## ✅ TO-DO LIST

### 🏗️ FASE 1: SERVICIO API REST (60-75 min)

#### TASK-001: Crear servicio de favoritos con API REST ⏱️ 60 min
- [ ] Crear `lib/favorites/favorites-service.ts` (nuevo archivo)
- [ ] Implementar función `apiRequest<T>()` helper (similar a booking-service.ts)
  - Manejo de autenticación con token
  - Manejo de errores HTTP (400, 401, 403, 404, 429, 500)
  - Parsing de respuestas JSON
  - Logging para debugging
- [ ] Implementar método `getFavorites(userId: string)`
  - Endpoint: `GET /api/favorites?userId={userId}`
  - Retorna: `ApiResponse<Favorite[]>`
  - Manejo de errores específicos
- [ ] Implementar método `getFavoriteProperties(userId: string)`
  - Endpoint: `GET /api/favorites?userId={userId}&includeProperties=true`
  - O alternativamente: `GET /api/favorites/properties?userId={userId}`
  - Retorna: `ApiResponse<FavoriteProperty[]>`
  - Manejo de propiedades no encontradas
- [ ] Implementar método `addFavorite(userId: string, propertyId: string)`
  - Endpoint: `POST /api/favorites`
  - Body: `{ userId, propertyId }`
  - Retorna: `ApiResponse<Favorite>`
  - Validación de duplicados (409 Conflict)
- [ ] Implementar método `removeFavorite(userId: string, propertyId: string)`
  - Endpoint: `DELETE /api/favorites/{favoriteId}` o `DELETE /api/favorites?userId={userId}&propertyId={propertyId}`
  - Retorna: `ApiResponse<void>` o `ApiResponse<{ success: boolean }>`
  - Manejo de favorito no encontrado (404)
- [ ] Implementar método `isFavorited(userId: string, propertyId: string)`
  - Endpoint: `GET /api/favorites/check?userId={userId}&propertyId={propertyId}`
  - Retorna: `ApiResponse<{ isFavorited: boolean }>`
  - Optimización: cachear resultado si es posible
- [ ] Documentar todos los métodos con JSDoc
- [ ] Exportar clase `FavoritesService` como default export
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: Ninguna
- **Criterios de Aceptación**:
  - [ ] Todos los métodos implementados
  - [ ] Manejo de errores completo
  - [ ] Logging para debugging
  - [ ] Tipos TypeScript correctos
  - [ ] Sin errores de linting

---

### 🔄 FASE 2: MIGRACIÓN DE COMPONENTES (45-60 min)

#### TASK-002: Actualizar FavoriteButton para usar API real ⏱️ 25 min
- [ ] Abrir `components/favorites/FavoriteButton.tsx`
- [ ] Reemplazar import de `MockFavoritesService` por `FavoritesService`
- [ ] Actualizar llamadas a métodos:
  - `MockFavoritesService.isFavorited()` → `FavoritesService.isFavorited()`
  - `MockFavoritesService.addFavorite()` → `FavoritesService.addFavorite()`
  - `MockFavoritesService.removeFavorite()` → `FavoritesService.removeFavorite()`
- [ ] Verificar manejo de errores:
  - Mostrar toast de error si falla
  - Revertir estado si falla (optimistic update)
- [ ] Verificar estados de loading:
  - Mostrar spinner mientras verifica estado inicial
  - Deshabilitar botón mientras procesa acción
- [ ] Probar en diferentes escenarios:
  - Usuario no autenticado
  - Propiedad no encontrada
  - Favorito ya existe
  - Error de red
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-001
- **Criterios de Aceptación**:
  - [ ] Botón funciona con API real
  - [ ] Manejo de errores correcto
  - [ ] Feedback visual adecuado
  - [ ] Sin errores en consola

#### TASK-003: Actualizar página de favoritos para usar API real ⏱️ 20 min
- [ ] Abrir `app/favoritos/page.tsx`
- [ ] Reemplazar import de `MockFavoritesService` por `FavoritesService`
- [ ] Actualizar método `loadFavorites()`:
  - `MockFavoritesService.getFavoriteProperties()` → `FavoritesService.getFavoriteProperties()`
- [ ] Verificar manejo de errores:
  - Mostrar mensaje de error si falla
  - Botón "Intentar de nuevo" funcional
- [ ] Verificar estados:
  - Loading mientras carga
  - Empty state si no hay favoritos
  - Error state si falla
- [ ] Probar recarga de página (debe mantener favoritos)
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-001
- **Criterios de Aceptación**:
  - [ ] Página carga favoritos desde API
  - [ ] Manejo de errores correcto
  - [ ] Estados visuales correctos
  - [ ] Persistencia entre recargas

---

### 🧹 FASE 3: LIMPIEZA Y OPTIMIZACIÓN (30-45 min)

#### TASK-004: Eliminar código MOCK de favoritos ⏱️ 20 min
- [ ] Verificar que `FavoritesService` funciona correctamente
- [ ] Buscar todos los imports de `MockFavoritesService`:
  ```bash
  grep -r "MockFavoritesService" --include="*.ts" --include="*.tsx"
  ```
- [ ] Eliminar archivos MOCK (opcional, mantener como backup):
  - `lib/favorites/mock-favorites-service.ts` (mover a `_deprecated/` o eliminar)
  - `lib/favorites/mock-favorites-db.ts` (mover a `_deprecated/` o eliminar)
- [ ] Actualizar documentación si es necesario
- [ ] Verificar que no hay referencias rotas
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-001, TASK-002, TASK-003
- **Criterios de Aceptación**:
  - [ ] No hay imports de MockFavoritesService
  - [ ] Archivos MOCK eliminados o movidos
  - [ ] Sin errores de compilación
  - [ ] Sin referencias rotas

#### TASK-005: Optimizaciones y mejoras ⏱️ 25 min
- [ ] Agregar caché local para `isFavorited()` (opcional)
  - Usar `useState` o `useMemo` para cachear resultado
  - Invalidar caché cuando se añade/elimina favorito
- [ ] Optimizar `getFavoriteProperties()`:
  - Verificar si el endpoint soporta paginación
  - Implementar paginación si es necesario
- [ ] Agregar retry logic para errores de red (opcional):
  - Reintentar automáticamente si falla por timeout
  - Máximo 2-3 reintentos
- [ ] Mejorar feedback visual:
  - Animación al añadir/eliminar favorito
  - Toast de éxito/error más informativo
- [ ] Verificar accesibilidad:
  - Aria-labels en botones
  - Keyboard navigation
- [ ] Testing manual completo:
  - Añadir favorito desde detalle de propiedad
  - Eliminar favorito desde detalle de propiedad
  - Ver lista de favoritos
  - Verificar sincronización entre pestañas
- **Prioridad**: 🟢 BAJA
- **Dependencias**: TASK-001, TASK-002, TASK-003
- **Criterios de Aceptación**:
  - [ ] Optimizaciones implementadas
  - [ ] Mejoras de UX aplicadas
  - [ ] Testing manual completo
  - [ ] Sin regresiones

---

## 📋 ESPECIFICACIONES TÉCNICAS

### Endpoints API Esperados

Según la documentación Postman (`docs/API_Rest_documentation.json`), los endpoints son:

1. **POST /api/favorites** - Agregar a Favoritos
   - Body: `{ propertyId: string }` (userId se obtiene del token)
   - Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
   - Response: `{ success: true, data: { favorite: Favorite } }`
   - Status: 201 Created
   - Errores: 401 (Unauthorized), 409 (Conflict - ya existe)

2. **GET /api/favorites?page={page}&limit={limit}** - Obtener Favoritos
   - Query params: `page` (opcional, default: 1), `limit` (opcional, default: 20)
   - Headers: `Authorization: Bearer {token}`
   - Response: `{ success: true, data: { favorites: Favorite[] } }`
   - Status: 200 OK
   - Errores: 401 (Unauthorized)

3. **GET /api/favorites/:propertyId** - Verificar si es Favorito
   - Path param: `propertyId`
   - Headers: `Authorization: Bearer {token}`
   - Response: `{ success: true, data: { favorite: Favorite } }` (si existe) o 404 (si no existe)
   - Status: 200 OK (si existe) o 404 Not Found (si no existe)

4. **DELETE /api/favorites/:propertyId** - Eliminar de Favoritos
   - Path param: `propertyId`
   - Headers: `Authorization: Bearer {token}`
   - Response: `{ success: true }` o 204 No Content
   - Status: 200 OK o 204 No Content
   - Errores: 401 (Unauthorized), 404 (Not Found)

### Estructura de Respuesta API

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

### Tipos TypeScript

Los tipos ya existen en `types/favorites.ts`:
- `Favorite` - Relación usuario-propiedad
- `FavoriteProperty` - Propiedad con info de favorito

No se requieren cambios en los tipos.

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐    ┌──────────────────────────┐ │
│  │ FavoriteButton    │───▶│  FavoritesService         │ │
│  │ (Component)       │    │  (API Client)             │ │
│  └──────────────────┘    └──────────────┬─────────────┘ │
│                                         │                │
│  ┌──────────────────┐                  │                │
│  │ FavoritesPage    │──────────────────┘                │
│  │ (Page)           │                                    │
│  └──────────────────┘                                    │
│                                                          │
└──────────────────────────────┬──────────────────────────┘
                               │
                               │ HTTP REST
                               │
┌──────────────────────────────▼──────────────────────────┐
│                    BACKEND (Express)                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  POST   /api/favorites          (Agregar)              │
│  GET    /api/favorites           (Obtener)              │
│  GET    /api/favorites/check    (Verificar)           │
│  DELETE /api/favorites           (Eliminar)             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 NOTAS DE IMPLEMENTACIÓN

### Patrón a Seguir

El servicio debe seguir el mismo patrón que `booking-service.ts`:

1. **Función `apiRequest<T>()` helper:**
   - Manejo de autenticación
   - Manejo de errores HTTP
   - Parsing de respuestas
   - Logging

2. **Clase `FavoritesService` con métodos estáticos:**
   - `getFavorites(userId)`
   - `getFavoriteProperties(userId)`
   - `addFavorite(userId, propertyId)`
   - `removeFavorite(userId, propertyId)`
   - `isFavorited(userId, propertyId)`

3. **Manejo de errores consistente:**
   - Códigos de error específicos
   - Mensajes de error claros
   - Logging para debugging

### Autenticación

- Usar `getAuthToken()` helper (similar a booking-service.ts)
- Incluir token en header `Authorization: Bearer <token>`
- Manejar errores 401 (Unauthorized) y 403 (Forbidden)

### Optimizaciones

1. **Caché local para `isFavorited()`:**
   - Cachear resultado en estado del componente
   - Invalidar cuando se añade/elimina favorito

2. **Optimistic Updates:**
   - Actualizar UI inmediatamente
   - Revertir si falla la petición

3. **Debounce para acciones rápidas:**
   - Evitar múltiples clicks rápidos
   - Deshabilitar botón mientras procesa

---

## ✅ CHECKLIST DE VALIDACIÓN

### Funcionalidad Básica
- [ ] Añadir favorito desde detalle de propiedad
- [ ] Eliminar favorito desde detalle de propiedad
- [ ] Ver lista de favoritos en `/favoritos`
- [ ] Verificar estado de favorito en tiempo real
- [ ] Persistencia entre recargas de página

### Manejo de Errores
- [ ] Error 401 (Unauthorized) - Redirigir a login
- [ ] Error 404 (Not Found) - Mostrar mensaje apropiado
- [ ] Error 409 (Conflict) - Mostrar que ya está en favoritos
- [ ] Error de red - Mostrar mensaje y botón de reintento
- [ ] Error 429 (Too Many Requests) - Mostrar mensaje y esperar

### Estados Visuales
- [ ] Loading state mientras verifica estado inicial
- [ ] Loading state mientras procesa acción
- [ ] Empty state cuando no hay favoritos
- [ ] Error state cuando falla la carga
- [ ] Feedback visual al añadir/eliminar (toast)

### Testing
- [ ] Testing manual completo
- [ ] Verificar en diferentes navegadores
- [ ] Verificar en móvil (responsive)
- [ ] Verificar sincronización entre pestañas
- [ ] Verificar persistencia después de logout/login

---

## 🚀 ORDEN DE IMPLEMENTACIÓN

1. **TASK-001** - Crear servicio API REST (base del milestone)
2. **TASK-002** - Actualizar FavoriteButton (componente más usado)
3. **TASK-003** - Actualizar página de favoritos (completa funcionalidad)
4. **TASK-004** - Limpiar código MOCK (mantener código limpio)
5. **TASK-005** - Optimizaciones (mejoras opcionales)

---

## 📚 REFERENCIAS

### Archivos a Revisar
- `lib/bookings/booking-service.ts` - Patrón de servicio API
- `lib/auth/auth-service.ts` - Manejo de autenticación
- `lib/properties/property-service.ts` - Estructura de servicio
- `components/favorites/FavoriteButton.tsx` - Componente a actualizar
- `app/favoritos/page.tsx` - Página a actualizar
- `types/favorites.ts` - Tipos TypeScript

### Documentación Backend
- Ver imagen compartida con endpoints de Postman
- Endpoints esperados:
  - POST /api/favorites
  - GET /api/favorites
  - GET /api/favorites/check
  - DELETE /api/favorites

---

## 🎯 CRITERIOS DE ÉXITO

El Milestone 7 se considera **COMPLETADO** cuando:

1. ✅ Todos los favoritos se persisten en el backend
2. ✅ Los favoritos se sincronizan entre dispositivos
3. ✅ No hay código MOCK de favoritos en uso
4. ✅ Todos los componentes funcionan con API real
5. ✅ Manejo de errores completo y robusto
6. ✅ Testing manual completo sin errores
7. ✅ Código limpio y bien documentado

---

**Última actualización:** 31 de Diciembre, 2024  
**Estado:** ⚪ PENDIENTE

