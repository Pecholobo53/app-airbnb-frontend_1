# 🗑️ PLAN DE ELIMINACIÓN DE MOCKS

> **Fecha**: 2025-01-XX  
> **Objetivo**: Eliminar todos los archivos mock y dejar solo implementación real

---

## ⚠️ ADVERTENCIA

**Al eliminar los mocks, las siguientes funcionalidades dejarán de funcionar hasta que se integren con API real:**

### Funcionalidades que se romperán:

1. **Favoritos** ❌
   - Página `/favoritos` no funcionará
   - Botón de favoritos en propiedades no funcionará
   - Archivos afectados:
     - `app/favoritos/page.tsx`
     - `components/favorites/FavoriteButton.tsx`

2. **Dashboard/Reservas** ❌
   - Página `/mis-reservas` no funcionará
   - Dashboard no mostrará datos
   - Archivos afectados:
     - `app/mis-reservas/page.tsx`
     - `lib/dashboard/dashboard-context.tsx`
     - `app/dashboard/page.tsx`

3. **Notificaciones** ❌
   - Menú de notificaciones no funcionará
   - No se mostrarán notificaciones
   - Archivos afectados:
     - `hooks/useNotifications.ts`
     - `components/notifications/NotificationItem.tsx`
     - `components/notifications/NotificationsMenu.tsx`

4. **Búsqueda de Propiedades** ❌
   - Página de detalle de propiedad no funcionará
   - Búsqueda de ubicaciones no funcionará
   - Reviews no se mostrarán
   - Propiedades similares no se mostrarán
   - Archivos afectados:
     - `app/propiedad/[id]/page.tsx`
     - `app/checkout/page.tsx`
     - `components/search/LocationInput.tsx`
     - `components/property/ReviewsList.tsx`
     - `components/property/SimilarProperties.tsx`
     - `components/PromotionsSection.tsx`

5. **Checkout** ❌
   - Proceso de checkout no funcionará
   - Archivos afectados:
     - `app/checkout/page.tsx`

---

## 📋 ARCHIVOS MOCK A ELIMINAR

### Módulo AUTH (Ya integrado - ✅ Puede eliminarse)
- ✅ `lib/auth/mock-users-db-stub.ts` - **ELIMINAR** (pero otros módulos lo usan)

### Módulo FAVORITES (No integrado - ⚠️ Se romperá)
- ⚠️ `lib/favorites/mock-favorites-db.ts` - **ELIMINAR** (se romperá)
- ⚠️ `lib/favorites/mock-favorites-service.ts` - **ELIMINAR** (se romperá)

### Módulo NOTIFICATIONS (No integrado - ⚠️ Se romperá)
- ⚠️ `lib/notifications/mock-notifications-db.ts` - **ELIMINAR** (se romperá)
- ⚠️ `lib/notifications/mock-notifications-service.ts` - **ELIMINAR** (se romperá)

### Módulo DASHBOARD (No integrado - ⚠️ Se romperá)
- ⚠️ `lib/dashboard/mock-dashboard-service.ts` - **ELIMINAR** (se romperá)
- ⚠️ `lib/dashboard/mock-bookings-db.ts` - **ELIMINAR** (se romperá)

### Módulo SEARCH (No integrado - ⚠️ Se romperá)
- ⚠️ `lib/search/mock-search-service.ts` - **ELIMINAR** (se romperá)
- ⚠️ `lib/search/mock-properties-db.ts` - **ELIMINAR** (se romperá)
- ⚠️ `lib/search/mock-reviews-db.ts` - **ELIMINAR** (se romperá)
- ⚠️ `lib/search/mock-locations-db.ts` - **ELIMINAR** (se romperá)

### Módulo CHECKOUT (No integrado - ⚠️ Se romperá)
- ⚠️ `lib/checkout/mock-checkout-service.ts` - **ELIMINAR** (se romperá)
- ⚠️ `lib/checkout/mock-checkout-db.ts` - **ELIMINAR** (se romperá)

---

## 🎯 OPCIONES

### Opción 1: Eliminar TODOS los mocks (Recomendado si quieres empezar limpio)
- ✅ Código más limpio
- ✅ Fuerza a integrar con API real
- ❌ Funcionalidades se romperán temporalmente

### Opción 2: Eliminar solo mocks de módulos ya integrados
- ✅ Solo eliminar `mock-users-db-stub.ts` (pero otros módulos lo necesitan)
- ⚠️ Mantener otros mocks hasta integrarlos

### Opción 3: Integrar módulos primero, luego eliminar mocks
- ✅ No se rompe nada
- ✅ Proceso más seguro
- ⏱️ Toma más tiempo

---

## 📝 RECOMENDACIÓN

**Recomiendo la Opción 1** si quieres un código limpio y estás dispuesto a que algunas funcionalidades no funcionen temporalmente hasta que las integres con API real.

Si eliges la Opción 1, después de eliminar los mocks, necesitarás:
1. Integrar módulo FAVORITES con API real
2. Integrar módulo NOTIFICATIONS con API real
3. Integrar módulo DASHBOARD con API real
4. Integrar módulo SEARCH con API real
5. Integrar módulo CHECKOUT con API real

---

## ✅ DECISIÓN

¿Procedo con la **Opción 1** (eliminar todos los mocks)?


