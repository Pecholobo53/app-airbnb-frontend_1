# 🔄 FLUJO COMPLETO DE CHECKOUT Y URLs POSTERIORES

**Fecha:** 31 de Diciembre de 2024  
**Objetivo:** Documentar el flujo completo de checkout y las URLs a las que se redirige después de confirmar una reserva

---

## 📋 FLUJO COMPLETO DE COMPRA

### 1. Selección de Propiedad y Fechas
**URL:** `/propiedad/{propertyId}`

- Usuario selecciona fechas, huéspedes
- Click en "Reservar"
- Se valida disponibilidad
- Se crea reserva en borrador (status: `pending`)
- **Redirección:** `/checkout?id={bookingId}&propertyId={propertyId}&checkIn={date}&checkOut={date}&adults={number}`

---

### 2. Página de Checkout
**URL:** `/checkout?id={bookingId}` o `/checkout?propertyId={id}&checkIn={date}&checkOut={date}`

**Pasos del checkout:**
- **Paso 1:** Detalles de la reserva (resumen de propiedad, fechas, precios)
- **Paso 2:** Información de pago (datos del huésped, tarjeta, facturación)
- **Paso 3:** Confirmación (modal de éxito)

**URLs internas durante checkout:**
- Misma URL `/checkout` con diferentes estados
- Los datos se guardan en `sessionStorage` para persistencia

---

### 3. Confirmación de Reserva
**Acción:** Usuario completa formularios y confirma

**Proceso:**
1. Se valida la reserva
2. Se actualiza la reserva a status: `confirmed`
3. Se muestra modal de confirmación
4. Se guarda el `bookingId` en estado

**Modal de Confirmación:**
- Muestra ID de reserva
- Mensaje de éxito
- Botones de acción

---

## 🔗 URLs POSTERIORES AL CHECKOUT

Después de confirmar la reserva, el usuario puede ir a:

### 1. Ver Mi Reserva (Principal)
**URL:** `/mis-reservas` o `/dashboard/reservas`

**Acceso:**
- Botón "Ver mi reserva" en el modal de confirmación
- Redirección automática después de 8 segundos (opcional, deshabilitado actualmente)

**Contenido:**
- Lista de todas las reservas del usuario
- Detalles de cada reserva
- Estado de cada reserva (pending, confirmed, cancelled, completed)

---

### 2. Buscar Más Propiedades
**URL:** `/buscar`

**Acceso:**
- Botón "Buscar más" en el modal de confirmación
- Header de navegación

**Contenido:**
- Búsqueda de propiedades
- Filtros por ubicación, fechas, huéspedes
- Lista de propiedades disponibles

---

### 3. Página de Inicio
**URL:** `/`

**Acceso:**
- Botón "Inicio" en el modal de confirmación
- Logo de Airbnb en el header

**Contenido:**
- Página principal con propiedades destacadas
- Búsqueda rápida
- Categorías de experiencias

---

### 4. Dashboard de Usuario
**URL:** `/dashboard`

**Acceso:**
- Menú de usuario en el header
- Link directo desde navegación

**Contenido:**
- Estadísticas como huésped
- Estadísticas como anfitrión
- Próximos viajes
- Historial de viajes
- Solicitudes pendientes (si es anfitrión)

---

## 🎯 FLUJO DE NAVEGACIÓN DESPUÉS DE CONFIRMAR

```
Checkout (Paso 3: Confirmación)
    ↓
Modal de Confirmación
    ↓
┌─────────────────────────────────────┐
│  Usuario elige una opción:         │
├─────────────────────────────────────┤
│                                     │
│  1. "Ver mi reserva"                │
│     → /mis-reservas                 │
│                                     │
│  2. "Buscar más"                    │
│     → /buscar                       │
│                                     │
│  3. "Inicio"                        │
│     → /                             │
│                                     │
│  4. Cerrar modal                    │
│     → Permanece en /checkout        │
│     → Puede navegar manualmente     │
└─────────────────────────────────────┘
```

---

## 📍 RUTAS DEFINIDAS EN LA APLICACIÓN

Según `lib/constants.ts`:

```typescript
export const ROUTES = {
  HOME: '/',                    // Página principal
  LOGIN: '/login',              // Inicio de sesión
  REGISTRO: '/registro',        // Registro de usuario
  BUSCAR: '/buscar',            // Búsqueda de propiedades
  DASHBOARD: '/dashboard',      // Dashboard principal
  PERFIL: '/perfil',            // Perfil de usuario
  FAVORITOS: '/favoritos',      // Propiedades favoritas
  CONFIGURACION: '/configuracion', // Configuración
  MIS_RESERVAS: '/mis-reservas',    // Lista de reservas
  CHECKOUT: '/checkout',        // Página de checkout
  ADMIN: '/admin',              // Panel de administración
  ADMIN_USERS: '/admin/users',  // Gestión de usuarios
}
```

---

## 🔄 REDIRECCIONES AUTOMÁTICAS

### Actualmente Implementadas:
1. **Después de confirmar reserva:** 
   - ❌ **Deshabilitado** - El usuario decide desde el modal
   - Anteriormente: Redirección automática a `/mis-reservas` después de 8 segundos

### Recomendaciones:
- **Opción 1:** Mantener sin redirección automática (actual)
  - Usuario tiene control total
  - Puede revisar la confirmación antes de navegar
  
- **Opción 2:** Redirección automática opcional
  - Agregar checkbox "No volver a mostrar" en el modal
  - Redirigir después de X segundos si está habilitado

---

## 🐛 PROBLEMAS CONOCIDOS Y SOLUCIONES

### Problema: Bucle infinito en checkout
**Síntoma:** La página se queda en "Cargando checkout..." indefinidamente

**Causa:**
- `useEffect` se ejecuta múltiples veces
- Redirecciones causan recargas infinitas
- `isLoading` no se resetea correctamente

**Solución Implementada:**
- Uso de `useMemo` para extraer valores primitivos de `searchParams`
- Uso de `useRef` para evitar múltiples llamadas
- `window.location.href` en lugar de `router.push` para redirecciones críticas
- Asegurar que `setIsLoading(false)` se llama en todos los casos

---

## 📝 NOTAS TÉCNICAS

### Persistencia de Datos
- Los datos de checkout se guardan en `sessionStorage`
- Se limpian automáticamente después de confirmar
- Permiten recuperar el estado si se recarga la página

### Estados de Reserva
- **`pending`:** Reserva en borrador (creada pero no confirmada)
- **`confirmed`:** Reserva confirmada (después de completar checkout)
- **`cancelled`:** Reserva cancelada
- **`completed`:** Reserva completada (ya pasó el check-out)

---

**Última actualización:** 31 de Diciembre de 2024

