# 🔔 MILESTONE 8: Módulo de Notificaciones - Integración con API REST

> **Objetivo**: Reemplazar el servicio MOCK de notificaciones con integración real a la API REST del backend, manteniendo toda la funcionalidad existente y siguiendo el mismo patrón de otros servicios (auth, bookings, favorites).

---

## 📊 ESTADO DEL MILESTONE

| Métrica | Valor |
|---------|-------|
| **Estado General** | ⚪ PENDIENTE |
| **Fecha Inicio** | _Pendiente_ |
| **Fecha Finalización** | _Pendiente_ |
| **Progreso** | 0/5 tareas (0%) |
| **Prioridad** | 🟡 MEDIA |
| **Dependencias** | ✅ Milestone 1 (Auth) |
| **Tiempo Estimado** | 4-5 horas |

---

## 🎯 VISIÓN DEL PRODUCTO

### Contexto
El módulo de notificaciones actualmente funciona con datos MOCK. Los usuarios pueden:
- Ver notificaciones en el menú de notificaciones (icono de campana)
- Ver contador de notificaciones no leídas
- Marcar notificaciones como leídas
- Marcar todas como leídas
- Eliminar notificaciones

Sin embargo, estos datos se pierden al recargar la página porque están en memoria. Necesitamos:
1. **Persistir notificaciones** en el backend
2. **Sincronizar notificaciones** entre dispositivos
3. **Mantener notificaciones** después de cerrar sesión y volver a iniciar
4. **Notificaciones en tiempo real** (futuro: WebSockets)

### Objetivo Estratégico
Migrar el módulo de notificaciones de MOCK a API REST real, permitiendo:
1. 🔔 **Persistencia** de notificaciones en base de datos
2. 🔄 **Sincronización** entre dispositivos
3. 📊 **Contador en tiempo real** de notificaciones no leídas
4. 🛡️ **Validación** en backend de permisos y datos
5. ⚡ **Mejor UX** con actualizaciones automáticas

### Impacto Esperado
- ✅ **100% persistencia** de notificaciones
- 🔄 **Sincronización** entre dispositivos
- ⚡ **Mejor UX** con contador actualizado
- 🛡️ **Seguridad** mejorada con validación backend

---

## ✅ TO-DO LIST

### 🏗️ FASE 1: SERVICIO API REST (75-90 min)

#### TASK-001: Crear servicio de notificaciones con API REST ⏱️ 75 min
- [ ] Crear `lib/notifications/notifications-service.ts` (nuevo archivo)
- [ ] Implementar función `apiRequest<T>()` helper (similar a favorites-service.ts)
  - Manejo de autenticación con token
  - Manejo de errores HTTP (400, 401, 403, 404, 429, 500)
  - Parsing de respuestas JSON
  - Logging para debugging
- [ ] Implementar método `getNotifications(options?)`
  - Endpoint: `GET /api/notifications?page={page}&limit={limit}&read={read}`
  - Query params: `page` (opcional), `limit` (opcional), `read` (opcional: true/false)
  - Retorna: `ApiResponse<NotificationsResponse>`
  - Manejo de errores específicos
- [ ] Implementar método `getUnreadCount()`
  - Endpoint: `GET /api/notifications/unread-count`
  - Retorna: `ApiResponse<{ unreadCount: number }>`
  - Manejo de errores específicos
- [ ] Implementar método `markAsRead(notificationId: string)`
  - Endpoint: `PUT /api/notifications/:id/read`
  - Path param: `id` (notificationId)
  - Retorna: `ApiResponse<Notification>`
  - Manejo de notificación no encontrada (404)
- [ ] Implementar método `markAllAsRead()`
  - Endpoint: `PUT /api/notifications/mark-all-read`
  - Retorna: `ApiResponse<{ count: number }>` o `ApiResponse<{ success: boolean }>`
  - Manejo de errores específicos
- [ ] Implementar método `deleteNotification(notificationId: string)`
  - Endpoint: `DELETE /api/notifications/:id`
  - Path param: `id` (notificationId)
  - Retorna: `ApiResponse<void>` o `ApiResponse<{ success: boolean }>`
  - Manejo de notificación no encontrada (404)
- [ ] Documentar todos los métodos con JSDoc
- [ ] Exportar clase `NotificationsService` como default export
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: Ninguna
- **Criterios de Aceptación**:
  - [ ] Todos los métodos implementados
  - [ ] Manejo de errores completo
  - [ ] Logging para debugging
  - [ ] Tipos TypeScript correctos
  - [ ] Sin errores de linting

---

### 🔄 FASE 2: MIGRACIÓN DE COMPONENTES (60-75 min)

#### TASK-002: Actualizar hook useNotifications para usar API real ⏱️ 30 min
- [ ] Abrir `hooks/useNotifications.ts`
- [ ] Reemplazar import de `MockNotificationsService` por `NotificationsService`
- [ ] Actualizar método `loadNotifications()`:
  - `MockNotificationsService.getNotifications()` → `NotificationsService.getNotifications()`
  - Eliminar parámetro `userId` (se obtiene del token)
  - Pasar `options` correctamente (page, limit, read)
- [ ] Actualizar método `markAsRead()`:
  - `MockNotificationsService.markAsRead()` → `NotificationsService.markAsRead()`
- [ ] Actualizar método `markAllAsRead()`:
  - `MockNotificationsService.markAllAsRead()` → `NotificationsService.markAllAsRead()`
  - Eliminar parámetro `userId` (se obtiene del token)
- [ ] Verificar manejo de errores:
  - Mostrar mensaje de error si falla
  - Revertir estado si falla (optimistic update)
- [ ] Verificar estados de loading:
  - Mantener estados de loading correctos
  - Actualizar `unreadCount` correctamente
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-001
- **Criterios de Aceptación**:
  - [ ] Hook funciona con API real
  - [ ] Manejo de errores correcto
  - [ ] Estados de loading correctos
  - [ ] Sin errores en consola

#### TASK-003: Actualizar NotificationsMenu para usar API real ⏱️ 25 min
- [ ] Abrir `components/notifications/NotificationsMenu.tsx`
- [ ] Verificar que use el hook `useNotifications` actualizado
- [ ] Verificar que el contador de no leídas se actualice correctamente
- [ ] Verificar que las notificaciones se muestren correctamente
- [ ] Verificar manejo de errores:
  - Mostrar mensaje de error si falla la carga
  - Mostrar estado vacío si no hay notificaciones
- [ ] Verificar estados:
  - Loading mientras carga
  - Empty state si no hay notificaciones
  - Error state si falla
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-001, TASK-002
- **Criterios de Aceptación**:
  - [ ] Menú carga notificaciones desde API
  - [ ] Contador de no leídas funciona correctamente
  - [ ] Manejo de errores correcto
  - [ ] Estados visuales correctos

#### TASK-004: Actualizar NotificationIcon para usar API real ⏱️ 20 min
- [ ] Abrir `components/notifications/NotificationIcon.tsx`
- [ ] Verificar que use el hook `useNotifications` para obtener `unreadCount`
- [ ] Verificar que el badge muestre el contador correcto
- [ ] Verificar que se actualice automáticamente cuando cambie el contador
- [ ] Verificar manejo de errores:
  - Mostrar 0 si falla la carga (fallback seguro)
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-001, TASK-002
- **Criterios de Aceptación**:
  - [ ] Icono muestra contador correcto
  - [ ] Se actualiza automáticamente
  - [ ] Manejo de errores correcto

---

### 🧹 FASE 3: LIMPIEZA Y OPTIMIZACIÓN (30-45 min)

#### TASK-005: Eliminar código MOCK de notificaciones ⏱️ 20 min
- [ ] Verificar que `NotificationsService` funciona correctamente
- [ ] Buscar todos los imports de `MockNotificationsService`:
  ```bash
  grep -r "MockNotificationsService" --include="*.ts" --include="*.tsx"
  ```
- [ ] Eliminar archivos MOCK (opcional, mantener como backup):
  - `lib/notifications/mock-notifications-service.ts` (mover a `_deprecated/` o eliminar)
  - `lib/notifications/mock-notifications-db.ts` (mover a `_deprecated/` o eliminar)
- [ ] Actualizar documentación si es necesario
- [ ] Verificar que no hay referencias rotas
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-001, TASK-002, TASK-003, TASK-004
- **Criterios de Aceptación**:
  - [ ] No hay imports de MockNotificationsService
  - [ ] Archivos MOCK eliminados o movidos
  - [ ] Sin errores de compilación
  - [ ] Sin referencias rotas

---

## 📋 ESPECIFICACIONES TÉCNICAS

### Endpoints API Esperados

Según la documentación Postman (`docs/API_Rest_documentation.json`), los endpoints son:

1. **GET /api/notifications?page={page}&limit={limit}&read={read}** - Obtener Notificaciones
   - Query params: `page` (opcional, default: 1), `limit` (opcional, default: 20), `read` (opcional: true/false)
   - Headers: `Authorization: Bearer {token}`
   - Response: `{ success: true, data: { notifications: Notification[], total: number, page: number, limit: number } }`
   - Status: 200 OK
   - Errores: 401 (Unauthorized)

2. **GET /api/notifications/unread-count** - Obtener Contador de No Leídas
   - Headers: `Authorization: Bearer {token}`
   - Response: `{ success: true, data: { unreadCount: number } }`
   - Status: 200 OK
   - Errores: 401 (Unauthorized)

3. **PUT /api/notifications/:id/read** - Marcar como Leída
   - Path param: `id` (notificationId)
   - Headers: `Authorization: Bearer {token}`
   - Response: `{ success: true, data: { notification: Notification } }`
   - Status: 200 OK
   - Errores: 401 (Unauthorized), 404 (Not Found)

4. **PUT /api/notifications/mark-all-read** - Marcar Todas como Leídas
   - Headers: `Authorization: Bearer {token}`
   - Response: `{ success: true, data: { count: number } }` o `{ success: true }`
   - Status: 200 OK
   - Errores: 401 (Unauthorized)

5. **DELETE /api/notifications/:id** - Eliminar Notificación
   - Path param: `id` (notificationId)
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
    code?: string;
    message: string;
  };
}
```

### Tipos TypeScript

Los tipos ya existen en `types/notifications.ts`:
- `Notification` - Notificación individual
- `NotificationType` - Tipos de notificación
- `GetNotificationsOptions` - Opciones para obtener notificaciones
- `NotificationsResponse` - Respuesta con notificaciones y metadata

No se requieren cambios en los tipos.

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐    ┌──────────────────────────┐ │
│  │ NotificationIcon │───▶│  NotificationsService    │ │
│  │ (Component)      │    │  (API Client)            │ │
│  └──────────────────┘    └──────────────┬─────────────┘ │
│                                         │                │
│  ┌──────────────────┐                  │                │
│  │ NotificationsMenu│──────────────────┘                │
│  │ (Component)      │                                    │
│  └──────────────────┘                                    │
│                                                          │
│  ┌──────────────────┐                                    │
│  │ useNotifications │───▶ NotificationsService          │
│  │ (Hook)           │                                    │
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
│  GET    /api/notifications          (Obtener)           │
│  GET    /api/notifications/unread-count (Contador)      │
│  PUT    /api/notifications/:id/read (Marcar leída)     │
│  PUT    /api/notifications/mark-all-read (Todas leídas)│
│  DELETE /api/notifications/:id     (Eliminar)          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 NOTAS DE IMPLEMENTACIÓN

### Patrón a Seguir

El servicio debe seguir el mismo patrón que `favorites-service.ts`:

1. **Función `apiRequest<T>()` helper:**
   - Manejo de autenticación
   - Manejo de errores HTTP
   - Parsing de respuestas
   - Logging

2. **Clase `NotificationsService` con métodos estáticos:**
   - `getNotifications(options?)`
   - `getUnreadCount()`
   - `markAsRead(notificationId)`
   - `markAllAsRead()`
   - `deleteNotification(notificationId)`

3. **Manejo de errores consistente:**
   - Códigos de error específicos
   - Mensajes de error claros
   - Logging para debugging

### Autenticación

- Usar `getAuthToken()` helper (similar a favorites-service.ts)
- Incluir token en header `Authorization: Bearer <token>`
- Manejar errores 401 (Unauthorized) y 403 (Forbidden)

### Optimizaciones

1. **Caché local para `unreadCount`:**
   - Cachear resultado en estado del componente
   - Invalidar cuando se marca como leída o se elimina

2. **Optimistic Updates:**
   - Actualizar UI inmediatamente
   - Revertir si falla la petición

3. **Polling opcional:**
   - Refrescar notificaciones cada X segundos (opcional)
   - O usar WebSockets en el futuro

---

## ✅ CHECKLIST DE VALIDACIÓN

### Funcionalidad Básica
- [ ] Obtener notificaciones funciona correctamente
- [ ] Contador de no leídas funciona correctamente
- [ ] Marcar como leída funciona correctamente
- [ ] Marcar todas como leídas funciona correctamente
- [ ] Eliminar notificación funciona correctamente
- [ ] Persistencia entre recargas de página

### Manejo de Errores
- [ ] Error 401 (Unauthorized) - Redirigir a login o mostrar mensaje
- [ ] Error 404 (Not Found) - Mostrar mensaje apropiado
- [ ] Error de red - Mostrar mensaje y permitir reintento
- [ ] Optimistic updates se revierten si falla la petición

### Estados Visuales
- [ ] Loading state mientras carga notificaciones
- [ ] Loading state mientras procesa acción
- [ ] Empty state cuando no hay notificaciones
- [ ] Error state cuando falla la carga
- [ ] Badge con contador de no leídas visible y actualizado

### Consola y Red
- [ ] Sin errores de consola (console.error)
- [ ] Sin advertencias de React (hydration)
- [ ] Todas las peticiones HTTP tienen status 2xx (excepto errores esperados)
- [ ] Headers de autenticación presentes en todas las peticiones
- [ ] Logs de debugging presentes y claros

---

## 🚀 ORDEN DE IMPLEMENTACIÓN

1. **TASK-001** - Crear servicio API REST (base del milestone)
2. **TASK-002** - Actualizar hook useNotifications (lógica central)
3. **TASK-003** - Actualizar NotificationsMenu (componente principal)
4. **TASK-004** - Actualizar NotificationIcon (contador)
5. **TASK-005** - Limpiar código MOCK (mantener código limpio)

---

## 📚 REFERENCIAS

### Archivos a Revisar
- `lib/favorites/favorites-service.ts` - Patrón de servicio API
- `lib/bookings/booking-service.ts` - Manejo de autenticación
- `lib/auth/auth-service.ts` - Estructura de servicio
- `hooks/useNotifications.ts` - Hook a actualizar
- `components/notifications/NotificationsMenu.tsx` - Componente a actualizar
- `components/notifications/NotificationIcon.tsx` - Componente a actualizar
- `types/notifications.ts` - Tipos TypeScript

### Documentación Backend
- Ver `docs/API_Rest_documentation.json` (líneas 2321-2532)
- Endpoints esperados:
  - GET /api/notifications?page={page}&limit={limit}&read={read}
  - GET /api/notifications/unread-count
  - PUT /api/notifications/:id/read
  - PUT /api/notifications/mark-all-read
  - DELETE /api/notifications/:id

---

## 🎯 CRITERIOS DE ÉXITO

El Milestone 8 se considera **COMPLETADO** cuando:

1. ✅ Todas las notificaciones se persisten en el backend
2. ✅ Las notificaciones se sincronizan entre dispositivos
3. ✅ No hay código MOCK de notificaciones en uso
4. ✅ Todos los componentes funcionan con API real
5. ✅ Manejo de errores completo y robusto
6. ✅ Contador de no leídas funciona en tiempo real
7. ✅ Testing manual completo sin errores
8. ✅ Código limpio y bien documentado

---

**Última actualización:** 31 de Diciembre, 2024  
**Estado:** ⚪ PENDIENTE

