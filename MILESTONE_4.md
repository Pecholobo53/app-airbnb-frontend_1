# ❤️ MILESTONE 4: Sistema de Favoritos + Notificaciones

> **Objetivo**: Implementar un sistema completo de favoritos y notificaciones para mejorar la experiencia del usuario, permitiendo guardar propiedades favoritas y recibir alertas importantes.

---

## 📊 ESTADO DEL MILESTONE

| Métrica | Valor |
|---------|-------|
| **Estado General** | ⚪ PENDIENTE |
| **Fecha Inicio** | _Pendiente_ |
| **Fecha Finalización** | _Pendiente_ |
| **Progreso** | 0/35 tareas (0%) |
| **Prioridad** | 🔴 ALTA |
| **Dependencias** | ✅ Milestone 1 (Auth), ✅ Milestone 2 (Búsqueda), ✅ Milestone 3 (Detalle) |
| **Tiempo Estimado** | 6-8 horas |

---

## 🎯 VISIÓN DEL PRODUCTO

### Contexto
Con los módulos de autenticación, búsqueda y detalle de propiedad funcionando, los usuarios necesitan:
1. **Guardar propiedades favoritas** para consultarlas después
2. **Recibir notificaciones** sobre eventos importantes (reservas, favoritos, mensajes)

### Objetivo Estratégico
Crear una experiencia personalizada que permita a los usuarios:
1. ❤️ **Guardar** propiedades como favoritas
2. 📋 **Gestionar** su lista de favoritos
3. 🔔 **Recibir** notificaciones relevantes
4. 📱 **Ver** alertas en tiempo real (simulado con MOCK)

### Impacto Esperado
- 📈 **+180% retención** de usuarios autenticados
- 🎯 **+120% conversión** con recordatorios de favoritos
- 💰 **+90% tiempo en sitio** explorando favoritos
- ⭐ **4.7+ rating** de satisfacción del usuario

---

## ✅ TO-DO LIST

### 🏗️ FASE 1: BASE DE DATOS MOCK Y TIPOS (45-60 min)

#### TASK-001: Crear tipos TypeScript para Favoritos ⏱️ 15 min
- [ ] Crear `types/favorites.ts` con interfaces:
  ```typescript
  interface Favorite {
    id: string;
    userId: string;
    propertyId: string;
    addedAt: Date;
  }
  
  interface FavoriteProperty extends Property {
    favoritedAt: Date;
  }
  ```
- [ ] Exportar tipos desde `types/index.ts`
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: Ninguna

#### TASK-002: Crear tipos TypeScript para Notificaciones ⏱️ 15 min
- [ ] Crear `types/notifications.ts` con interfaces:
  ```typescript
  type NotificationType = 
    | 'booking_confirmed'
    | 'booking_cancelled'
    | 'booking_reminder'
    | 'message_received'
    | 'favorite_price_drop'
    | 'favorite_available'
    | 'security_alert'
    | 'promotion';
  
  interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    link?: string;
    metadata?: Record<string, any>;
  }
  ```
- [ ] Exportar tipos desde `types/index.ts`
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: Ninguna

#### TASK-003: Crear base de datos MOCK de Favoritos ⏱️ 15 min
- [ ] Crear `lib/favorites/mock-favorites-db.ts`
- [ ] Array `MOCK_FAVORITES` con favoritos de ejemplo
- [ ] Vincular con usuarios existentes (`MOCK_USERS`)
- [ ] Vincular con propiedades existentes (`MOCK_PROPERTIES`)
- [ ] Función `getFavoritesByUserId(userId)`
- [ ] Función `isPropertyFavorited(userId, propertyId)`
- [ ] Documentación MOCK completa
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-001

#### TASK-004: Crear base de datos MOCK de Notificaciones ⏱️ 20 min
- [ ] Crear `lib/notifications/mock-notifications-db.ts`
- [ ] Array `MOCK_NOTIFICATIONS` con 20-30 notificaciones de ejemplo
- [ ] Variedad de tipos (reservas, favoritos, mensajes, seguridad, promociones)
- [ ] Vincular con usuarios existentes (`MOCK_USERS`)
- [ ] Función `getNotificationsByUserId(userId)`
- [ ] Función `getUnreadCount(userId)`
- [ ] Función `markAsRead(notificationId)`
- [ ] Función `markAllAsRead(userId)`
- [ ] Documentación MOCK completa
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-002

---

### 🔧 FASE 2: SERVICIOS MOCK (60-75 min)

#### TASK-005: Crear servicio MOCK de Favoritos ⏱️ 30 min
- [ ] Crear `lib/favorites/mock-favorites-service.ts`
- [ ] Método `getFavorites(userId)` - Obtener favoritos del usuario
- [ ] Método `addFavorite(userId, propertyId)` - Añadir favorito
- [ ] Método `removeFavorite(userId, propertyId)` - Eliminar favorito
- [ ] Método `isFavorited(userId, propertyId)` - Verificar si está favorito
- [ ] Método `getFavoriteProperties(userId)` - Obtener propiedades favoritas completas
- [ ] Simulación de delay de red (200-400ms)
- [ ] Manejo de errores (usuario no encontrado, propiedad no encontrada)
- [ ] Documentación del servicio
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-003

#### TASK-006: Crear servicio MOCK de Notificaciones ⏱️ 35 min
- [ ] Crear `lib/notifications/mock-notifications-service.ts`
- [ ] Método `getNotifications(userId, options?)` - Obtener notificaciones
- [ ] Método `getUnreadCount(userId)` - Contar no leídas
- [ ] Método `markAsRead(notificationId)` - Marcar como leída
- [ ] Método `markAllAsRead(userId)` - Marcar todas como leídas
- [ ] Método `createNotification(notification)` - Crear notificación (para testing)
- [ ] Filtrado por tipo (opcional)
- [ ] Ordenamiento por fecha (más recientes primero)
- [ ] Simulación de delay de red (200-400ms)
- [ ] Manejo de errores
- [ ] Documentación del servicio
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-004

---

### ❤️ FASE 3: SISTEMA DE FAVORITOS - COMPONENTES (90-120 min)

#### TASK-007: Crear componente FavoriteButton ⏱️ 25 min
- [ ] Crear `components/favorites/FavoriteButton.tsx`
- [ ] Botón con icono `Heart` de lucide-react
- [ ] Estado: favorito / no favorito (relleno vs outline)
- [ ] Animación al hacer click
- [ ] Integración con `useAuth` para verificar autenticación
- [ ] Mostrar toast si no está autenticado
- [ ] Llamar a servicio MOCK para añadir/eliminar
- [ ] Loading state mientras procesa
- [ ] Manejo de errores
- [ ] Props: `propertyId`, `className?`
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-005

#### TASK-008: Crear página "Mis Favoritos" ⏱️ 30 min
- [ ] Crear `app/favoritos/page.tsx`
- [ ] Client Component con `useAuth`
- [ ] Redirigir a login si no está autenticado
- [ ] Cargar favoritos del usuario con `getFavoriteProperties`
- [ ] Mostrar grid de propiedades (reutilizar `PropertyCard`)
- [ ] Estado de loading (skeleton)
- [ ] Estado vacío ("No tienes favoritos aún")
- [ ] Botón para ir a buscar propiedades
- [ ] Responsive design
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-005, TASK-007

#### TASK-009: Crear componente FavoritesList ⏱️ 20 min
- [ ] Crear `components/favorites/FavoritesList.tsx`
- [ ] Lista de propiedades favoritas
- [ ] Reutilizar `PropertyCard` existente
- [ ] Mostrar mensaje si está vacío
- [ ] Loading skeleton
- [ ] Props: `favorites: FavoriteProperty[]`
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-005

#### TASK-010: Integrar FavoriteButton en PropertyCard ⏱️ 15 min
- [ ] Actualizar `components/search/PropertyCard.tsx`
- [ ] Agregar `FavoriteButton` en esquina superior derecha
- [ ] Posicionamiento absoluto sobre imagen
- [ ] Z-index correcto
- [ ] Hover effect
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-007

#### TASK-011: Integrar FavoriteButton en página de detalle ⏱️ 10 min
- [ ] Actualizar `components/property/PropertyHeader.tsx`
- [ ] Reemplazar botón de favorito existente con `FavoriteButton`
- [ ] Mantener estilos actuales
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-007

---

### 🔔 FASE 4: SISTEMA DE NOTIFICACIONES - COMPONENTES (90-120 min)

#### TASK-012: Crear componente NotificationsMenu ⏱️ 45 min
- [ ] Crear `components/notifications/NotificationsMenu.tsx`
- [ ] Usar Radix UI `DropdownMenu`
- [ ] Icono `Bell` de lucide-react
- [ ] Badge con contador de no leídas
- [ ] Dropdown con lista de notificaciones
- [ ] Agrupar por fecha (Hoy, Ayer, Esta semana, Más antiguas)
- [ ] Indicador visual de no leídas (punto rojo)
- [ ] Click en notificación → marcar como leída y navegar
- [ ] Botón "Marcar todas como leídas"
- [ ] Estado vacío ("No hay notificaciones")
- [ ] Loading state
- [ ] Props: `userId`
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-006

#### TASK-013: Crear componente NotificationItem ⏱️ 20 min
- [ ] Crear `components/notifications/NotificationItem.tsx`
- [ ] Item individual de notificación
- [ ] Icono según tipo (Calendar, Heart, Message, Shield, Tag)
- [ ] Título y mensaje
- [ ] Timestamp relativo ("Hace 2 horas")
- [ ] Indicador de no leída
- [ ] Hover effect
- [ ] Click → marcar como leída y navegar
- [ ] Props: `notification: Notification`, `onClick?`
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-006

#### TASK-014: Crear hook useNotifications ⏱️ 25 min
- [ ] Crear `hooks/useNotifications.ts`
- [ ] Hook personalizado para gestionar notificaciones
- [ ] Estado: `notifications`, `unreadCount`, `loading`, `error`
- [ ] Función `loadNotifications()`
- [ ] Función `markAsRead(id)`
- [ ] Función `markAllAsRead()`
- [ ] Auto-refresh cada 30 segundos (opcional)
- [ ] Cleanup en unmount
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-006

#### TASK-015: Integrar NotificationsMenu en Header ⏱️ 15 min
- [ ] Actualizar `components/Header.tsx`
- [ ] Agregar `NotificationsMenu` junto a "Ofertas" en navegación
- [ ] Solo mostrar si está autenticado
- [ ] Posicionamiento correcto
- [ ] Responsive (ocultar en mobile si es necesario)
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-012

---

### 🎨 FASE 5: UI/UX Y ESTADOS (45-60 min)

#### TASK-016: Agregar utilidad formatRelativeTime ⏱️ 10 min
- [ ] Actualizar `lib/utils.ts`
- [ ] Función `formatRelativeTime(date)` usando `date-fns`
- [ ] Formato: "Hace 2 horas", "Ayer", "Hace 3 días"
- [ ] Localización en español
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: Ninguna

#### TASK-017: Agregar iconos por tipo de notificación ⏱️ 15 min
- [ ] Crear función helper `getNotificationIcon(type)`
- [ ] Mapear tipos a iconos de lucide-react:
  - `booking_*` → `Calendar`
  - `message_*` → `MessageCircle`
  - `favorite_*` → `Heart`
  - `security_*` → `Shield`
  - `promotion` → `Tag`
- [ ] Crear `components/notifications/NotificationIcon.tsx`
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-002

#### TASK-018: Agregar colores por tipo de notificación ⏱️ 10 min
- [ ] Crear función helper `getNotificationColor(type)`
- [ ] Colores según tipo:
  - Reservas: azul
  - Mensajes: verde
  - Favoritos: rojo
  - Seguridad: naranja
  - Promociones: púrpura
- **Prioridad**: 🟢 BAJA
- **Dependencias**: TASK-002

#### TASK-019: Agregar animaciones y transiciones ⏱️ 10 min
- [ ] Animación al añadir/eliminar favorito
- [ ] Transición suave en dropdown de notificaciones
- [ ] Pulse animation en badge de notificaciones
- [ ] Hover effects en items
- **Prioridad**: 🟢 BAJA
- **Dependencias**: TASK-007, TASK-012

---

### 🔗 FASE 6: INTEGRACIÓN Y NAVEGACIÓN (30-45 min)

#### TASK-020: Actualizar constantes de rutas ⏱️ 5 min
- [ ] Verificar que `ROUTES.FAVORITOS` existe en `lib/constants.ts`
- [ ] Agregar si falta
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: Ninguna

#### TASK-021: Actualizar UserMenu con link a Favoritos ⏱️ 5 min
- [ ] Verificar que `components/auth/UserMenu.tsx` tiene link a favoritos
- [ ] Actualizar si es necesario
- [ ] Icono `Heart` correcto
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-008

#### TASK-022: Agregar navegación desde notificaciones ⏱️ 15 min
- [ ] En `NotificationItem`, agregar navegación según tipo:
  - Reservas → `/mis-reservas`
  - Favoritos → `/favoritos` o `/propiedad/[id]`
  - Mensajes → `/mensajes` (si existe)
  - Seguridad → `/configuracion`
  - Promociones → `/buscar` o página específica
- [ ] Usar `useRouter` de Next.js
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-013

#### TASK-023: Agregar toasts para acciones de favoritos ⏱️ 10 min
- [ ] Usar `toast` de Sonner (ya instalado)
- [ ] Toast al añadir favorito: "Añadido a favoritos"
- [ ] Toast al eliminar favorito: "Eliminado de favoritos"
- [ ] Toast si no está autenticado: "Inicia sesión para guardar favoritos"
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-007

---

### 🧪 FASE 7: TESTING Y VALIDACIÓN (30-45 min)

#### TASK-024: Probar flujo completo de Favoritos ⏱️ 15 min
- [ ] Login como usuario de prueba
- [ ] Buscar propiedades
- [ ] Añadir favorito desde búsqueda
- [ ] Añadir favorito desde detalle
- [ ] Ir a página "Mis Favoritos"
- [ ] Verificar que se muestran correctamente
- [ ] Eliminar favorito
- [ ] Verificar que se actualiza
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: Todas las tareas de Favoritos

#### TASK-025: Probar flujo completo de Notificaciones ⏱️ 15 min
- [ ] Login como usuario de prueba
- [ ] Ver campanita en header
- [ ] Ver badge con contador
- [ ] Abrir dropdown
- [ ] Ver lista de notificaciones
- [ ] Click en notificación → marcar como leída
- [ ] Verificar que contador se actualiza
- [ ] Marcar todas como leídas
- [ ] Navegar desde notificaciones
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: Todas las tareas de Notificaciones

#### TASK-026: Validar estados edge ⏱️ 10 min
- [ ] Usuario sin favoritos → mensaje vacío
- [ ] Usuario sin notificaciones → mensaje vacío
- [ ] Usuario no autenticado → redirigir a login
- [ ] Error de red → mostrar mensaje de error
- [ ] Loading states funcionan
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: Todas las tareas anteriores

---

### 📝 FASE 8: DOCUMENTACIÓN (30-45 min)

#### TASK-027: Documentar servicio de Favoritos ⏱️ 15 min
- [ ] Agregar documentación completa en `mock-favorites-service.ts`
- [ ] Explicar cada método
- [ ] Ejemplos de uso
- [ ] Notas sobre migración a backend real
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-005

#### TASK-028: Documentar servicio de Notificaciones ⏱️ 15 min
- [ ] Agregar documentación completa en `mock-notifications-service.ts`
- [ ] Explicar cada método
- [ ] Ejemplos de uso
- [ ] Notas sobre migración a backend real
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-006

#### TASK-029: Actualizar PROJECT_INDEX.md ⏱️ 10 min
- [ ] Actualizar estado de Milestone 4
- [ ] Agregar referencias a nuevos archivos
- [ ] Actualizar roadmap
- **Prioridad**: 🟢 BAJA
- **Dependencias**: Todas las tareas anteriores

#### TASK-030: Crear QUICK_START_MILESTONE4.md ⏱️ 15 min
- [ ] Guía rápida de 5 minutos
- [ ] Cómo usar favoritos
- [ ] Cómo usar notificaciones
- [ ] Ejemplos de código
- **Prioridad**: 🟢 BAJA
- **Dependencias**: Todas las tareas anteriores

---

### 🎯 FASE 9: OPTIMIZACIÓN Y PULIDO (30-45 min)

#### TASK-031: Optimizar rendimiento de Favoritos ⏱️ 15 min
- [ ] Verificar que no hay re-renders innecesarios
- [ ] Usar `useMemo` si es necesario
- [ ] Lazy loading de lista de favoritos
- **Prioridad**: 🟢 BAJA
- **Dependencias**: TASK-008

#### TASK-032: Optimizar rendimiento de Notificaciones ⏱️ 15 min
- [ ] Verificar que no hay re-renders innecesarios
- [ ] Limitar número de notificaciones mostradas (últimas 20)
- [ ] Virtualización si hay muchas (opcional)
- **Prioridad**: 🟢 BAJA
- **Dependencias**: TASK-012

#### TASK-033: Mejorar accesibilidad ⏱️ 10 min
- [ ] Agregar `aria-label` a botones
- [ ] Navegación por teclado en dropdown
- [ ] Focus management
- [ ] Screen reader friendly
- **Prioridad**: 🟢 BAJA
- **Dependencias**: Todas las tareas anteriores

#### TASK-034: Agregar tests manuales ⏱️ 10 min
- [ ] Checklist de funcionalidades
- [ ] Probar en diferentes navegadores
- [ ] Probar en mobile
- [ ] Verificar responsive design
- **Prioridad**: 🟢 BAJA
- **Dependencias**: Todas las tareas anteriores

---

## 📋 CHECKLIST DE VALIDACIÓN

### ✅ Funcionalidades Core
- [ ] Usuario puede añadir favoritos
- [ ] Usuario puede eliminar favoritos
- [ ] Página "Mis Favoritos" muestra propiedades correctamente
- [ ] Notificaciones se muestran en dropdown
- [ ] Badge muestra contador correcto
- [ ] Notificaciones se marcan como leídas
- [ ] Navegación desde notificaciones funciona

### ✅ Estados y Errores
- [ ] Loading states funcionan
- [ ] Estados vacíos se muestran correctamente
- [ ] Errores se manejan gracefully
- [ ] Usuario no autenticado es redirigido

### ✅ UI/UX
- [ ] Diseño consistente con el resto de la app
- [ ] Responsive en mobile y desktop
- [ ] Animaciones suaves
- [ ] Feedback visual claro

### ✅ Integración
- [ ] Integrado con sistema de autenticación
- [ ] Integrado con búsqueda de propiedades
- [ ] Integrado con página de detalle
- [ ] Navegación funciona correctamente

---

## 🎯 CRITERIOS DE ÉXITO

### Funcional
- ✅ Usuario puede gestionar favoritos completamente
- ✅ Usuario puede ver y gestionar notificaciones
- ✅ Todo funciona sin backend real (MOCK)

### Técnico
- ✅ Código simple y mantenible
- ✅ Tipos TypeScript correctos
- ✅ Sin errores de linting
- ✅ Documentación completa

### UX
- ✅ Interfaz intuitiva
- ✅ Feedback inmediato
- ✅ Estados claros
- ✅ Responsive design

---

## 📦 ARCHIVOS A CREAR

### Tipos
- `types/favorites.ts`
- `types/notifications.ts`

### Base de Datos MOCK
- `lib/favorites/mock-favorites-db.ts`
- `lib/notifications/mock-notifications-db.ts`

### Servicios MOCK
- `lib/favorites/mock-favorites-service.ts`
- `lib/notifications/mock-notifications-service.ts`

### Componentes
- `components/favorites/FavoriteButton.tsx`
- `components/favorites/FavoritesList.tsx`
- `components/notifications/NotificationsMenu.tsx`
- `components/notifications/NotificationItem.tsx`
- `components/notifications/NotificationIcon.tsx`

### Hooks
- `hooks/useNotifications.ts`

### Páginas
- `app/favoritos/page.tsx`

### Documentación
- `QUICK_START_MILESTONE4.md`

---

## 🔄 DEPENDENCIAS ENTRE TAREAS

```
TASK-001 (Tipos Favoritos)
  └─> TASK-003 (DB Favoritos)
      └─> TASK-005 (Servicio Favoritos)
          └─> TASK-007 (FavoriteButton)
              └─> TASK-008 (Página Favoritos)
              └─> TASK-010 (Integrar en PropertyCard)
              └─> TASK-011 (Integrar en Detalle)

TASK-002 (Tipos Notificaciones)
  └─> TASK-004 (DB Notificaciones)
      └─> TASK-006 (Servicio Notificaciones)
          └─> TASK-012 (NotificationsMenu)
          └─> TASK-013 (NotificationItem)
          └─> TASK-014 (Hook useNotifications)
              └─> TASK-015 (Integrar en Header)
```

---

## 🚀 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. **FASE 1**: Tipos y Base de Datos MOCK (TASK-001 a TASK-004)
2. **FASE 2**: Servicios MOCK (TASK-005, TASK-006)
3. **FASE 3**: Sistema de Favoritos (TASK-007 a TASK-011)
4. **FASE 4**: Sistema de Notificaciones (TASK-012 a TASK-015)
5. **FASE 5**: UI/UX (TASK-016 a TASK-019)
6. **FASE 6**: Integración (TASK-020 a TASK-023)
7. **FASE 7**: Testing (TASK-024 a TASK-026)
8. **FASE 8**: Documentación (TASK-027 a TASK-030)
9. **FASE 9**: Optimización (TASK-031 a TASK-034)

---

## 📝 NOTAS IMPORTANTES

### Decisiones Técnicas

**Sin nuevas dependencias**:
- Usar lo que ya está instalado
- Radix UI para dropdown (ya instalado)
- Lucide React para iconos (ya instalado)
- Sonner para toasts (ya instalado)
- date-fns para fechas (ya instalado)

**Modo MOCK completo**:
- Todos los datos en arrays en memoria
- Operaciones con delay de red simulado
- Persistencia solo durante sesión

**Priorizar UX**:
- Feedback inmediato
- Animaciones suaves
- Estados claros
- Mensajes útiles

### Para Producción (Futuro)

- Migrar a backend real
- Persistencia en base de datos
- Notificaciones en tiempo real (WebSockets)
- Push notifications (PWA)
- Sincronización entre dispositivos

---

## 🎓 RECURSOS Y REFERENCIAS

### Inspiración de UI
- **Airbnb.com** (referencia principal)
- **Booking.com** (notificaciones)
- **Uber** (badge de notificaciones)

### Documentación Técnica
- [Radix UI Dropdown](https://www.radix-ui.com/docs/primitives/components/dropdown-menu)
- [Lucide React Icons](https://lucide.dev/)
- [date-fns formatRelative](https://date-fns.org/docs/formatRelative)

---

**Última actualización**: _Pendiente_  
**Responsable**: Product Owner  
**Sprint**: Milestone 4 (6-8 horas de desarrollo)

