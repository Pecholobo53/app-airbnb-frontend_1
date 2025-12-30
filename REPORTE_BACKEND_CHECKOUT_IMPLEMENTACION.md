# 📋 Reporte para Backend: Implementación del Sistema de Checkout

**Fecha:** 30 de Diciembre de 2025  
**Versión:** 2.0  
**Estado:** Implementación Completa - API Real Integrada

---

## 🎯 OBJETIVO DEL REPORTE

Este reporte proporciona contexto completo al equipo de backend sobre la implementación del sistema de checkout en el frontend, incluyendo:
- Endpoints utilizados y cómo se usan
- Flujos de datos y estados de reserva
- Manejo de errores y validaciones
- Requisitos para comunicación fluida sin errores

---

## 📡 ENDPOINTS UTILIZADOS

### 1. **POST /api/bookings/validate** ✅

**Uso en Frontend:**
- **Componente:** `PriceCalculator.tsx` (página de detalle)
- **Componente:** `app/checkout/page.tsx` (página de checkout)
- **Propósito:** Validar disponibilidad antes de crear reserva

**Request Body:**
```json
{
  "propertyId": "string",
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "guests": number
}
```

**Response Esperado:**
```json
{
  "success": true,
  "data": {
    "available": boolean,
    "message": "string (opcional)"
  }
}
```

**Casos de Uso:**
1. **Validación en tiempo real** (PriceCalculator): Cuando el usuario selecciona fechas, se valida automáticamente (con debounce de 500ms)
2. **Validación antes de crear borrador**: Antes de crear reserva en estado 'pending'
3. **Validación antes de confirmar**: Última verificación antes de finalizar la reserva

**Manejo de Errores:**
- Si `available: false`, se muestra mensaje al usuario
- Si hay error de red, se permite continuar pero con advertencia
- Códigos de error esperados: `NOT_AVAILABLE`, `VALIDATION_ERROR`, `NETWORK_ERROR`

---

### 2. **POST /api/bookings** ✅

**Uso en Frontend:**
- **Componente:** `PriceCalculator.tsx` (crear borrador desde página de detalle)
- **Componente:** `app/checkout/page.tsx` (crear borrador desde parámetros de query)
- **Componente:** `app/checkout/page.tsx` (finalizar reserva)
- **Propósito:** Crear reserva en estado 'pending' (borrador) o 'confirmed' (finalizada)

**Request Body:**
```json
{
  "propertyId": "string",
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "guests": number,
  "guestInfo": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "paymentMethod": "string" // 'pending' para borrador, 'card' para finalizada
}
```

**Response Esperado:**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "string",
      "propertyId": "string",
      "checkIn": "ISO date string",
      "checkOut": "ISO date string",
      "guests": number,
      "guestInfo": {
        "name": "string",
        "email": "string",
        "phone": "string"
      },
      "status": "pending" | "confirmed" | "cancelled" | "completed",
      "createdAt": "ISO date string",
      "totalPrice": number (opcional),
      "currency": "string" (opcional)
    }
  }
}
```

**Estados de Reserva:**
- **`pending`**: Reserva en borrador (creada desde página de detalle o parámetros de query)
- **`confirmed`**: Reserva finalizada (después de completar checkout)

**Flujos de Creación:**

#### Flujo A: Desde Página de Detalle
1. Usuario selecciona fechas → `validateBooking()` → `createBooking()` con `status: 'pending'`
2. Redirige a `/checkout?id={bookingId}`

#### Flujo B: Desde Parámetros de Query
1. Usuario accede a `/checkout?propertyId=...&checkIn=...&checkOut=...`
2. Frontend crea reserva en borrador automáticamente
3. Redirige internamente a `/checkout?id={bookingId}` (flujo unificado)

#### Flujo C: Finalizar Reserva
1. Usuario completa formularios en checkout
2. `validateBooking()` (última verificación)
3. `createBooking()` con información completa y `status: 'confirmed'`

**Manejo de Errores:**
- **401 UNAUTHORIZED**: "Tu sesión expiró. Por favor, inicia sesión de nuevo."
- **409 CONFLICT**: "Las fechas seleccionadas ya están reservadas."
- **422 VALIDATION_ERROR**: "Los datos proporcionados no son válidos."
- **500 SERVER_ERROR**: "Error en el servidor. Por favor, intenta más tarde."

---

### 3. **GET /api/bookings/:id** ✅

**Uso en Frontend:**
- **Componente:** `app/checkout/page.tsx` (cargar checkout desde ID)
- **Propósito:** Obtener detalles de una reserva existente

**Request:**
- **URL:** `/api/bookings/{bookingId}`
- **Headers:** `Authorization: Bearer {token}`

**Response Esperado:**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "string",
      "propertyId": "string",
      "checkIn": "ISO date string",
      "checkOut": "ISO date string",
      "guests": number,
      "guestInfo": {
        "name": "string",
        "email": "string",
        "phone": "string"
      },
      "status": "pending" | "confirmed" | "cancelled" | "completed",
      "createdAt": "ISO date string",
      "totalPrice": number,
      "currency": "string"
    }
  }
}
```

**Casos de Uso:**
- Cargar checkout desde ID de reserva (flujo unificado)
- Prellenar formularios con datos de reserva existente
- Mostrar resumen de reserva en checkout

**Manejo de Errores:**
- **404 NOT_FOUND**: "Reserva no encontrada"
- **401 UNAUTHORIZED**: Redirige a login

---

### 4. **GET /api/properties/:id** ✅

**Uso en Frontend:**
- **Componente:** `app/checkout/page.tsx` (cargar propiedad para checkout)
- **Propósito:** Obtener detalles de la propiedad para mostrar en checkout

**Request:**
- **URL:** `/api/properties/{propertyId}`
- **Headers:** Opcional (endpoint público)

**Response Esperado:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "pricing": {
      "basePrice": number,
      "currency": "string",
      "cleaningFee": number,
      "serviceFee": number
    },
    "capacity": {
      "guests": number
    },
    // ... otros campos de propiedad
  }
}
```

---

### 5. **GET /api/properties/:id/availability** ✅

**Uso en Frontend:**
- **Componente:** `AvailabilityCalendar.tsx` (mostrar fechas bloqueadas)
- **Propósito:** Obtener fechas no disponibles para mostrar en calendario

**Request:**
- **URL:** `/api/properties/{propertyId}/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD`
- **Query Params:** Opcionales (checkIn, checkOut)

**Response Esperado:**
```json
{
  "success": true,
  "data": {
    "blockedDates": ["YYYY-MM-DD", ...],
    "availableDates": ["YYYY-MM-DD", ...],
    "minNights": number,
    "maxNights": number,
    "instantBook": boolean
  }
}
```

**Nota:** Si `blockedDates` está vacío, el frontend genera fechas bloqueadas al azar para testing (usando propertyId como seed para consistencia).

---

## 🔄 FLUJOS DE DATOS

### Flujo 1: Crear Reserva desde Página de Detalle

```
Usuario selecciona fechas
    ↓
PriceCalculator.validateBooking() → POST /api/bookings/validate
    ↓ (si disponible)
PriceCalculator.createBooking() → POST /api/bookings (status: 'pending')
    ↓
Redirige a /checkout?id={bookingId}
    ↓
CheckoutPage.loadCheckoutData()
    ↓
getBookingById() → GET /api/bookings/{id}
    ↓
PropertyService.getPropertyById() → GET /api/properties/{propertyId}
    ↓
Muestra checkout con datos prellenados
```

### Flujo 2: Crear Reserva desde Parámetros de Query

```
Usuario accede a /checkout?propertyId=...&checkIn=...&checkOut=...
    ↓
CheckoutPage.loadCheckoutData()
    ↓
validateBooking() → POST /api/bookings/validate
    ↓ (si disponible)
createBooking() → POST /api/bookings (status: 'pending')
    ↓
Redirige internamente a /checkout?id={bookingId}
    ↓
Continúa con Flujo 1 (cargar desde ID)
```

### Flujo 3: Finalizar Reserva

```
Usuario completa formularios en checkout
    ↓
handleConfirmBooking()
    ↓
validateBooking() → POST /api/bookings/validate (última verificación)
    ↓ (si disponible)
createBooking() → POST /api/bookings (status: 'confirmed')
    ↓
Muestra confirmación con ID de reserva
    ↓
Redirige a /mis-reservas
```

---

## 🔐 AUTENTICACIÓN

**Token Storage:**
- **Primario:** `sessionStorage['airbnb_session']` → `accessToken`
- **Fallback:** `localStorage['token']` o `localStorage['authToken']`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Endpoints que Requieren Autenticación:**
- ✅ `POST /api/bookings` (crear reserva)
- ✅ `GET /api/bookings/:id` (obtener reserva)
- ✅ `POST /api/bookings/validate` (puede requerir autenticación según implementación)

**Manejo de Token Expirado:**
- Si recibe `401 UNAUTHORIZED`, el frontend muestra: "Tu sesión expiró. Por favor, inicia sesión de nuevo."
- Redirige a `/login` con `returnUrl` para volver después

---

## ⚠️ MANEJO DE ERRORES

### Códigos de Error Esperados

| Código HTTP | Código Error | Mensaje al Usuario |
|------------|--------------|-------------------|
| 401 | `UNAUTHORIZED` | "Tu sesión expiró. Por favor, inicia sesión de nuevo." |
| 403 | `FORBIDDEN` | "No tienes permisos para realizar esta acción." |
| 404 | `NOT_FOUND` | "Recurso no encontrado." |
| 409 | `CONFLICT` | "Las fechas seleccionadas ya están reservadas." |
| 422 | `VALIDATION_ERROR` | "Los datos proporcionados no son válidos." |
| 429 | `RATE_LIMIT` | "Demasiadas solicitudes. Por favor, espera un momento." |
| 500 | `SERVER_ERROR` | "Error en el servidor. Por favor, intenta más tarde." |
| - | `NETWORK_ERROR` | "Error de conexión. Verifica tu internet e intenta de nuevo." |

### Estructura de Error Esperada

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo del error"
  }
}
```

**O alternativamente:**
```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Mensaje descriptivo del error"
}
```

---

## 📊 ESTADOS DE RESERVA

### Estados Utilizados en Frontend

1. **`pending`** (Borrador)
   - Reserva creada pero no finalizada
   - Usuario puede completar información en checkout
   - Se crea automáticamente al seleccionar fechas

2. **`confirmed`** (Confirmada)
   - Reserva finalizada y pagada
   - Usuario completó todo el proceso de checkout
   - Se muestra en "Mis Reservas"

3. **`cancelled`** (Cancelada)
   - Reserva cancelada por usuario o sistema
   - Se muestra en historial

4. **`completed`** (Completada)
   - Reserva finalizada y estadía completada
   - Se muestra en historial

---

## 🔍 VALIDACIONES REALIZADAS EN FRONTEND

### Antes de Crear Reserva en Borrador:
1. ✅ Usuario autenticado
2. ✅ Fechas válidas (checkIn < checkOut)
3. ✅ Número de huéspedes válido (1 <= guests <= capacity)
4. ✅ Disponibilidad verificada con API

### Antes de Finalizar Reserva:
1. ✅ Reserva en borrador existe
2. ✅ Información de huésped completa (nombre, email, teléfono)
3. ✅ Información de pago completa (tarjeta, facturación)
4. ✅ Disponibilidad verificada nuevamente (última verificación)
5. ✅ Datos de tarjeta válidos (número, titular, expiración, CVV)

---

## 🧪 TESTING Y FECHAS BLOQUEADAS

**Fechas Bloqueadas para Testing:**
- Si el endpoint `/api/properties/:id/availability` no devuelve `blockedDates` o está vacío, el frontend genera **3-8 fechas bloqueadas al azar** en los próximos 60 días
- Se usa `propertyId` como seed para que sea consistente por propiedad
- Esto permite visualizar fechas no disponibles en el calendario durante desarrollo/testing

**Nota:** En producción, el backend debe devolver las fechas bloqueadas reales desde la base de datos.

---

## 📝 REQUISITOS PARA COMUNICACIÓN FLUIDA

### 1. **Consistencia de Formatos de Fecha**
- **Request:** `YYYY-MM-DD` (ISO date string sin tiempo)
- **Response:** ISO date string completo o `YYYY-MM-DD`
- **Ejemplo:** `"2026-01-06"` o `"2026-01-06T00:00:00.000Z"`

### 2. **Estructura de Respuesta Consistente**
- Todas las respuestas deben incluir `success: boolean`
- Datos en `data: {...}` o directamente en la raíz (frontend maneja ambos)
- Errores en `error: { code, message }` o `{ code, message }` en la raíz

### 3. **Validación de Disponibilidad**
- El endpoint `/api/bookings/validate` debe verificar:
  - Que las fechas no estén en el pasado
  - Que checkOut > checkIn
  - Que no haya conflictos con reservas existentes
  - Que el número de huéspedes no exceda la capacidad

### 4. **Creación de Reserva en Borrador**
- El endpoint `/api/bookings` debe aceptar `paymentMethod: 'pending'` para crear borradores
- Las reservas en borrador deben poder actualizarse (aunque el frontend actualmente no implementa `PATCH /api/bookings/:id`)
- Las reservas en borrador deben tener un `status: 'pending'`

### 5. **Manejo de Errores Específicos**
- Usar códigos de error descriptivos (no solo códigos HTTP)
- Incluir mensajes de error claros y accionables
- Para errores de validación (422), incluir detalles de campos específicos si es posible

### 6. **Rate Limiting**
- Si se implementa rate limiting, devolver `429` con mensaje claro
- El frontend maneja `429` con mensaje: "Demasiadas solicitudes. Por favor, espera un momento."

### 7. **CORS y Headers**
- Permitir `Authorization: Bearer {token}` en headers
- Permitir `Content-Type: application/json`
- Configurar CORS correctamente para el dominio del frontend

---

## 🚨 PROBLEMAS CONOCIDOS Y SOLUCIONES

### Problema 1: Token Expirado Durante Checkout
**Solución Backend:**
- Verificar token antes de cada operación crítica
- Devolver `401` con mensaje claro si el token expiró
- El frontend redirige a login automáticamente

### Problema 2: Fechas No Disponibles Entre Validación y Confirmación
**Solución Backend:**
- Considerar usar transacciones para bloquear fechas temporalmente
- O implementar "reserva temporal" que bloquea fechas por X minutos
- El frontend valida justo antes de crear (última verificación)

### Problema 3: Reservas Duplicadas
**Solución Backend:**
- Verificar si existe reserva en borrador para las mismas fechas antes de crear nueva
- O implementar limpieza automática de borradores antiguos (>24 horas)
- El frontend actualmente no verifica duplicados (se puede implementar)

---

## 📈 MÉTRICAS Y MONITOREO

**Eventos que el Frontend Podría Enviar (futuro):**
- `checkout_started` - Usuario inicia checkout
- `checkout_step_1_completed` - Usuario completa paso 1
- `checkout_step_2_completed` - Usuario completa paso 2
- `checkout_confirmed` - Reserva confirmada
- `checkout_abandoned` - Usuario abandona checkout

**Logs del Frontend:**
- Todos los logs incluyen prefijos como `[PRICE CALCULATOR]`, `[CHECKOUT]`, `[BOOKING SERVICE]`
- Incluyen información de contexto (propertyId, bookingId, userId)
- Útiles para debugging en producción

---

## 🔄 PRÓXIMAS MEJORAS PLANEADAS

### Frontend (No Requiere Cambios en Backend):
1. Actualización de reserva en borrador (`PATCH /api/bookings/:id`)
2. Validación de tarjeta en tiempo real
3. Persistencia de datos del checkout en sessionStorage

### Backend (Recomendaciones):
1. Endpoint para actualizar reserva (`PATCH /api/bookings/:id`)
2. Endpoint para limpiar borradores antiguos (tarea programada)
3. Endpoint para verificar si existe reserva en borrador para fechas específicas
4. Transacciones para evitar race conditions en creación de reservas

---

## 📞 CONTACTO Y SOPORTE

**Para Dudas o Problemas:**
- Revisar logs del frontend en consola del navegador
- Verificar estructura de respuestas con ejemplos en este reporte
- Comunicar cambios en endpoints o estructuras de datos con anticipación

---

**Reporte generado el:** 30 de Diciembre de 2025  
**Última actualización:** 30 de Diciembre de 2025  
**Versión:** 2.0

