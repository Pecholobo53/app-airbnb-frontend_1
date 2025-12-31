# 📋 REPORTE BACKEND - IMPLEMENTACIÓN MÓDULO CHECKOUT

**Fecha:** 31 de Diciembre, 2024  
**Proyecto:** Airbnb Frontend  
**Prioridad:** 🔴 CRÍTICA  
**Estado:** Pendiente de Implementación

---

## 🎯 OBJETIVO

Este documento especifica **TODOS** los endpoints de API REST que el backend debe implementar para que el módulo de checkout funcione correctamente. El checkout permite a los usuarios crear, actualizar y confirmar reservas.

---

## ⚠️ PROBLEMAS ACTUALES

1. **Error 403 Forbidden** al obtener reservas recién creadas
2. **Error 429 Too Many Requests** por rate limiting muy estricto
3. **Página de checkout se queda en bucle de carga** y no puede avanzar a pagos
4. **Falta sincronización** de permisos después de crear reserva

---

## 📡 ENDPOINTS REQUERIDOS

### 1. POST /api/bookings/validate

**Descripción:** Valida si una reserva es posible antes de crearla.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}  // Opcional
```

**Request Body:**
```json
{
  "propertyId": "string (ObjectId)",
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "guests": number
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "available": true,
    "message": "Las fechas están disponibles"
  }
}
```

**Response Not Available (200 OK):**
```json
{
  "success": true,
  "data": {
    "available": false,
    "message": "Las fechas seleccionadas no están disponibles",
    "reason": "CONFLICT"
  }
}
```

**Response Error (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Las fechas de check-in deben ser anteriores a check-out"
  }
}
```

**Validaciones Requeridas:**
- `checkIn` y `checkOut` son fechas válidas en formato ISO (YYYY-MM-DD)
- `checkIn` < `checkOut`
- `guests` > 0 y no excede capacidad máxima de la propiedad
- Verificar que no haya reservas confirmadas o pendientes en el rango de fechas
- Verificar que la propiedad existe y está activa

**Lógica de Negocio:**
1. Validar formato y rango de fechas
2. Obtener propiedad y verificar que existe
3. Validar capacidad de huéspedes
4. Buscar reservas conflictivas en el rango de fechas
5. Retornar `available: true/false`

---

### 2. POST /api/bookings

**Descripción:** Crea una nueva reserva. Puede crearse en estado `pending` (borrador) o `confirmed` (confirmada).

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}  // REQUERIDO
```

**Request Body:**
```json
{
  "propertyId": "string (ObjectId)",
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "guests": number,
  "guestInfo": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "paymentMethod": "string"  // 'pending', 'card', 'paypal', 'bank_transfer'
}
```

**Response Success (201 Created):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "6954e9a62f77822bca5c8202",
      "propertyId": "6951575b171ec464a14d3516",
      "guestId": "695238bd142a50e9602d2534",
      "checkIn": "2026-01-26",
      "checkOut": "2026-01-28",
      "guests": 2,
      "guestInfo": {
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "phone": "+34612345678"
      },
      "status": "pending",
      "paymentMethod": "pending",
      "totalPrice": 150.00,
      "currency": "EUR",
      "createdAt": "2024-12-31T10:00:00.000Z",
      "updatedAt": "2024-12-31T10:00:00.000Z"
    }
  }
}
```

**Response Error (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token de autenticación inválido o expirado"
  }
}
```

**Response Error (409 Conflict):**
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Las fechas seleccionadas no están disponibles"
  }
}
```

**Validaciones Requeridas:**
- Token JWT válido y no expirado
- `propertyId` es ObjectId válido
- `checkIn` y `checkOut` son fechas válidas
- `guests` es número positivo
- `guestInfo` tiene `name`, `email`, y `phone` válidos
- `paymentMethod` es uno de los valores permitidos
- Validar disponibilidad usando lógica de `/validate`
- Verificar capacidad de la propiedad

**⚠️ CRÍTICO - Asignación de guestId:**
```javascript
// El guestId DEBE ser el userId del token JWT
const booking = await Booking.create({
  propertyId: request.propertyId,
  guestId: req.user.id,  // CRÍTICO: Del token JWT decodificado
  checkIn: request.checkIn,
  checkOut: request.checkOut,
  guests: request.guests,
  guestInfo: request.guestInfo,
  status: request.paymentMethod === 'pending' ? 'pending' : 'confirmed',
  paymentMethod: request.paymentMethod,
  totalPrice: calculatePrice(...),
  currency: property.currency || 'EUR',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

**Lógica de Negocio:**
1. Validar autenticación (token JWT)
2. Validar datos del request
3. Validar disponibilidad (usar lógica de `/validate`)
4. Obtener propiedad y calcular precio total
5. **CRÍTICO:** Asignar `guestId` = `userId` del token
6. Crear reserva en BD
7. Retornar reserva creada

---

### 3. GET /api/bookings/:id

**Descripción:** Obtiene el detalle de una reserva específica.

**Headers:**
```
Authorization: Bearer {token}  // REQUERIDO
```

**URL Parameters:**
- `id`: ID de la reserva (ObjectId)

**Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "6954e9a62f77822bca5c8202",
      "propertyId": "6951575b171ec464a14d3516",
      "guestId": "695238bd142a50e9602d2534",
      "checkIn": "2026-01-26",
      "checkOut": "2026-01-28",
      "guests": 2,
      "guestInfo": {
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "phone": "+34612345678"
      },
      "status": "pending",
      "paymentMethod": "pending",
      "totalPrice": 150.00,
      "currency": "EUR",
      "createdAt": "2024-12-31T10:00:00.000Z",
      "updatedAt": "2024-12-31T10:00:00.000Z"
    }
  }
}
```

**Response Error (403 Forbidden):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permisos para ver esta reserva"
  }
}
```

**Response Error (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "La reserva no existe"
  }
}
```

**⚠️ CRÍTICO - Autorización:**
El usuario debe poder ver la reserva si:
- Es el `guestId` de la reserva, O
- Es el `hostId` de la propiedad, O
- Tiene rol `admin`

**Middleware de Autorización CORRECTO:**
```javascript
async function authorizeBookingAccess(req, res, next) {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id; // Del token JWT decodificado
    
    // Obtener reserva
    const booking = await Booking.findById(bookingId)
      .populate('propertyId', 'hostId');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'La reserva no existe' }
      });
    }
    
    // Verificar autorización
    const isGuest = booking.guestId.toString() === userId.toString();
    const isHost = booking.propertyId?.hostId?.toString() === userId.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (isGuest || isHost || isAdmin) {
      req.booking = booking;
      next();
    } else {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'No tienes permisos para ver esta reserva' }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Error al verificar permisos' }
    });
  }
}
```

**⚠️ PROBLEMA ACTUAL:**
Después de crear una reserva, cuando el frontend intenta obtenerla, recibe **403 Forbidden**.

**Causa:**
- Comparación incorrecta de ObjectIds
- `guestId` no se asigna correctamente al crear
- Cache de permisos no se actualiza

**Solución:**
1. Usar comparación correcta: `booking.guestId.toString() === userId.toString()`
2. Asegurar que `guestId` se asigna al crear: `guestId: req.user.id`
3. No usar cache de permisos o invalidarlo después de crear

**Lógica de Negocio:**
1. Validar autenticación (token JWT)
2. Obtener reserva de BD
3. Verificar autorización (guestId, hostId, o admin)
4. Retornar reserva completa

---

### 4. PATCH /api/bookings/:id

**Descripción:** Actualiza una reserva existente. Útil para actualizar borradores con información del huésped, método de pago, etc.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}  // REQUERIDO
```

**URL Parameters:**
- `id`: ID de la reserva (ObjectId)

**Request Body (todos los campos opcionales):**
```json
{
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "guests": number,
  "guestInfo": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "paymentMethod": "string",
  "status": "pending" | "confirmed" | "cancelled" | "completed"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "6954e9a62f77822bca5c8202",
      "propertyId": "6951575b171ec464a14d3516",
      "guestId": "695238bd142a50e9602d2534",
      "checkIn": "2026-01-26",
      "checkOut": "2026-01-28",
      "guests": 2,
      "guestInfo": {
        "name": "Juan Pérez Actualizado",
        "email": "juan.nuevo@example.com",
        "phone": "+34612345679"
      },
      "status": "pending",
      "paymentMethod": "card",
      "totalPrice": 150.00,
      "currency": "EUR",
      "createdAt": "2024-12-31T10:00:00.000Z",
      "updatedAt": "2024-12-31T10:05:00.000Z"
    }
  }
}
```

**Response Error (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "No se puede cambiar las fechas de una reserva confirmada"
  }
}
```

**Validaciones Requeridas:**
- Token JWT válido
- Solo el `guestId` puede actualizar (o admin)
- Si `status: "confirmed"`, no se pueden cambiar fechas ni número de huéspedes
- Si se actualizan fechas, validar disponibilidad (excluyendo esta reserva)
- Si se actualiza número de huéspedes, validar capacidad

**Lógica de Negocio:**
1. Validar autenticación
2. Obtener reserva de BD
3. Verificar autorización (solo guestId o admin)
4. Validar que no se cambien fechas en reservas confirmadas
5. Si se actualizan fechas, validar disponibilidad
6. Actualizar reserva en BD
7. Retornar reserva actualizada

---

### 5. GET /api/bookings

**Descripción:** Obtiene todas las reservas del usuario autenticado. Permite filtrar por estado y paginar.

**Headers:**
```
Authorization: Bearer {token}  // REQUERIDO
```

**Query Parameters:**
- `status` (opcional): `pending` | `confirmed` | `cancelled` | `completed`
- `page` (opcional): número de página (default: 1)
- `limit` (opcional): número de resultados por página (default: 20)

**Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "6954e9a62f77822bca5c8202",
        "propertyId": "6951575b171ec464a14d3516",
        "guestId": "695238bd142a50e9602d2534",
        "checkIn": "2026-01-26",
        "checkOut": "2026-01-28",
        "guests": 2,
        "status": "confirmed",
        "totalPrice": 150.00,
        "currency": "EUR",
        "createdAt": "2024-12-31T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

**Validaciones Requeridas:**
- Token JWT válido
- Solo retornar reservas donde `guestId` = `userId` del token
- `status` debe ser uno de los valores permitidos
- `page` y `limit` deben ser números positivos

**Lógica de Negocio:**
1. Validar autenticación
2. Filtrar reservas por `guestId` = `userId` del token
3. Aplicar filtro de `status` si se proporciona
4. Aplicar paginación
5. Retornar lista de reservas con información de paginación

---

### 6. DELETE /api/bookings/:id

**Descripción:** Cancela una reserva existente. Cambia el estado a `cancelled`.

**Headers:**
```
Authorization: Bearer {token}  // REQUERIDO
```

**URL Parameters:**
- `id`: ID de la reserva (ObjectId)

**Response Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Reserva cancelada exitosamente"
  }
}
```

**Validaciones Requeridas:**
- Token JWT válido
- Solo el `guestId` puede cancelar (o admin)
- No se puede cancelar una reserva ya cancelada
- No se puede cancelar una reserva completada

**Lógica de Negocio:**
1. Validar autenticación
2. Obtener reserva de BD
3. Verificar autorización (solo guestId o admin)
4. Validar estado (no cancelada, no completada)
5. Cambiar `status` a `cancelled`
6. Guardar en BD
7. Retornar mensaje de éxito

---

## 🔄 FLUJOS DE DATOS

### Flujo 1: Crear Borrador y Completar Checkout

```
1. Usuario selecciona fechas → POST /api/bookings/validate
   ✅ { available: true }
   
2. Usuario click "Reservar" → POST /api/bookings
   Body: { ..., paymentMethod: "pending" }
   ✅ { booking: { id: "...", status: "pending" } }
   
3. Frontend redirige a /checkout?id={bookingId}
   
4. Frontend carga reserva → GET /api/bookings/{bookingId}
   ⚠️ PROBLEMA: Recibe 403 Forbidden
   ✅ SOLUCIÓN: Backend debe permitir acceso inmediato
   
5. Usuario completa info → PATCH /api/bookings/{bookingId}
   Body: { guestInfo: { ... } }
   ✅ { booking: { ... } }
   
6. Usuario confirma → PATCH /api/bookings/{bookingId}
   Body: { paymentMethod: "card", status: "confirmed" }
   ✅ { booking: { status: "confirmed" } }
```

### Flujo 2: Checkout Directo con Parámetros (Fallback)

```
1. Usuario selecciona fechas
   
2. Frontend intenta crear borrador → POST /api/bookings
   ❌ Error: 404 Not Found (endpoint no existe)
   
3. Frontend fallback → Redirige a /checkout?propertyId=...&checkIn=...
   
4. Frontend carga propiedad → GET /api/properties/{propertyId}
   ✅ { property: { ... } }
   
5. Usuario completa info y confirma → POST /api/bookings
   Body: { ..., paymentMethod: "card" }
   ✅ { booking: { id: "...", status: "confirmed" } }
```

---

## 🐛 ERRORES CRÍTICOS Y SOLUCIONES

### Error 1: 403 Forbidden al Obtener Reserva Recién Creada

**Síntoma:**
```
POST /api/bookings → 201 Created
GET /api/bookings/{id} → 403 Forbidden
```

**Causa:**
- Middleware de autorización no verifica correctamente `booking.guestId === userId`
- Comparación incorrecta de ObjectIds
- Cache de permisos no se actualiza

**Solución:**
1. **Asegurar que `guestId` se asigna correctamente:**
   ```javascript
   const booking = await Booking.create({
     guestId: req.user.id, // Del token JWT
     // ... otros campos
   });
   ```

2. **Usar comparación correcta de ObjectIds:**
   ```javascript
   // ✅ CORRECTO
   if (booking.guestId.toString() === userId.toString()) {
     // Permitir acceso
   }
   
   // ❌ INCORRECTO
   if (booking.guestId === userId) {
     // Puede fallar
   }
   ```

3. **No usar cache de permisos o invalidarlo después de crear**

### Error 2: 429 Too Many Requests

**Síntoma:**
```
POST /api/bookings/validate → 429 Too Many Requests
POST /api/bookings → 429 Too Many Requests
```

**Causa:**
- Rate limiting muy estricto
- No hay diferenciación por endpoint
- No hay diferenciación por usuario autenticado

**Solución:**
1. **Aumentar límites para endpoints críticos:**
   - `/api/bookings/validate`: 100 requests/minuto por usuario
   - `/api/bookings` (POST): 20 requests/minuto por usuario
   - `/api/bookings/:id` (GET): 60 requests/minuto por usuario

2. **Implementar rate limiting por usuario autenticado:**
   - No usar límite global
   - Cada usuario tiene su propio límite

3. **Agregar headers informativos:**
   ```
   X-RateLimit-Limit: 100
   X-RateLimit-Remaining: 95
   X-RateLimit-Reset: 1609459200
   ```

### Error 3: Página de Checkout en Bucle de Carga

**Síntoma:**
- La página `/checkout` se queda cargando indefinidamente
- No puede avanzar a la página de pagos

**Causa:**
- `GET /api/bookings/{id}` devuelve 403, causando reintentos
- Timeout de 5 segundos no es suficiente

**Solución:**
1. **Resolver el 403** (ver Error 1)
2. Asegurar que los endpoints responden en menos de 2 segundos
3. Implementar caché de respuestas para reducir peticiones

---

## 📊 MODELO DE DATOS

### Booking Schema

```javascript
{
  _id: ObjectId,
  propertyId: ObjectId,      // Referencia a Property
  guestId: ObjectId,         // Referencia a User (CRÍTICO: debe coincidir con userId del token)
  checkIn: Date,            // ISO date string (YYYY-MM-DD)
  checkOut: Date,            // ISO date string (YYYY-MM-DD)
  guests: Number,            // Número total de huéspedes
  guestInfo: {
    name: String,
    email: String,
    phone: String
  },
  status: String,           // 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentMethod: String,     // 'pending' | 'card' | 'paypal' | 'bank_transfer'
  totalPrice: Number,
  currency: String,          // 'EUR' | 'USD' | etc.
  createdAt: Date,
  updatedAt: Date
}
```

**Validaciones del Modelo:**
- `guestId` debe existir en Users y ser el mismo que `userId` del token
- `propertyId` debe existir en Properties y estar activa
- `checkIn` < `checkOut`
- `status` solo puede cambiar: `pending` → `confirmed` → `completed` o `pending`/`confirmed` → `cancelled`

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Endpoints Críticos

- [ ] **POST /api/bookings/validate**
  - [ ] Validar formato de fechas
  - [ ] Validar que checkIn < checkOut
  - [ ] Validar capacidad de huéspedes
  - [ ] Verificar disponibilidad (sin conflictos)
  - [ ] Retornar `{ available: true/false }`
  - [ ] Manejar errores 400, 404

- [ ] **POST /api/bookings**
  - [ ] Validar autenticación (token JWT)
  - [ ] Validar datos del request
  - [ ] Validar disponibilidad
  - [ ] **CRÍTICO:** Asignar `guestId` = `userId` del token
  - [ ] Calcular precio total
  - [ ] Crear reserva en BD
  - [ ] Retornar reserva creada
  - [ ] Manejar errores 400, 401, 403, 409

- [ ] **GET /api/bookings/:id**
  - [ ] Validar autenticación (token JWT)
  - [ ] **CRÍTICO:** Verificar autorización:
    - [ ] `booking.guestId.toString() === userId.toString()` → Permitir
    - [ ] `booking.propertyId.hostId.toString() === userId.toString()` → Permitir
    - [ ] `user.role === 'admin'` → Permitir
    - [ ] Otros casos → 403 Forbidden
  - [ ] Retornar reserva completa
  - [ ] Manejar errores 401, 403, 404
  - [ ] **CRÍTICO:** Asegurar que funciona inmediatamente después de crear

- [ ] **PATCH /api/bookings/:id**
  - [ ] Validar autenticación (token JWT)
  - [ ] Verificar autorización (solo guestId o admin)
  - [ ] Validar que no se cambien fechas en reservas confirmadas
  - [ ] Si se cambian fechas, validar disponibilidad
  - [ ] Actualizar reserva en BD
  - [ ] Retornar reserva actualizada
  - [ ] Manejar errores 400, 401, 403, 404, 409

### Endpoints Secundarios

- [ ] **GET /api/bookings**
  - [ ] Validar autenticación (token JWT)
  - [ ] Filtrar por `guestId` = `userId` del token
  - [ ] Filtrar por `status` (opcional)
  - [ ] Implementar paginación
  - [ ] Retornar lista con paginación
  - [ ] Manejar errores 401

- [ ] **DELETE /api/bookings/:id**
  - [ ] Validar autenticación (token JWT)
  - [ ] Verificar autorización (solo guestId o admin)
  - [ ] Cambiar status a `cancelled` (no eliminar físicamente)
  - [ ] Retornar mensaje de éxito
  - [ ] Manejar errores 401, 403, 404

### Mejoras de Rate Limiting

- [ ] Aumentar límites para endpoints críticos
- [ ] Implementar rate limiting por usuario autenticado
- [ ] Diferenciar límites por endpoint:
  - [ ] `/validate`: 100 requests/minuto por usuario
  - [ ] `/bookings` (POST): 20 requests/minuto por usuario
  - [ ] `/bookings/:id` (GET): 60 requests/minuto por usuario
- [ ] Agregar headers de rate limit en respuestas

---

## 📝 FORMATO DE RESPUESTAS

**Todas las respuestas deben seguir este formato:**

```json
{
  "success": true,  // o false
  "data": { ... },  // Solo si success: true
  "error": {        // Solo si success: false
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo"
  }
}
```

**Códigos de Error Estándar:**
- `UNAUTHORIZED`: Token inválido o expirado (401)
- `FORBIDDEN`: No tienes permisos (403)
- `NOT_FOUND`: Recurso no existe (404)
- `VALIDATION_ERROR`: Datos inválidos (400)
- `CONFLICT`: Conflicto (fechas ocupadas, etc.) (409)
- `RATE_LIMIT`: Demasiadas solicitudes (429)
- `SERVER_ERROR`: Error interno del servidor (500)

---

## 🎯 PRIORIDADES

### Fase 1: Crítico (Implementar Inmediatamente)

1. **GET /api/bookings/:id** - Resolver error 403
   - **Impacto:** 🔴 CRÍTICO - Bloquea todo el flujo de checkout

2. **POST /api/bookings** - Asegurar que `guestId` se asigna correctamente
   - **Impacto:** 🔴 CRÍTICO - Necesario para que GET funcione

### Fase 2: Alto

3. **POST /api/bookings/validate** - Mejorar validaciones
   - **Impacto:** 🟡 ALTO - Mejora experiencia de usuario

4. **PATCH /api/bookings/:id** - Implementar o corregir
   - **Impacto:** 🟡 ALTO - Necesario para actualizar borradores

5. **Rate Limiting** - Ajustar límites
   - **Impacto:** 🟡 ALTO - Reduce errores 429

### Fase 3: Medio

6. **GET /api/bookings** - Mejorar filtros y paginación
   - **Impacto:** 🟢 MEDIO - Mejora listado de reservas

7. **DELETE /api/bookings/:id** - Implementar cancelación
   - **Impacto:** 🟢 MEDIO - Funcionalidad adicional

---

## ✅ CRITERIOS DE VALIDACIÓN

El módulo de checkout se considerará **completamente funcional** cuando:

- [ ] ✅ Usuario puede crear reserva en borrador (`POST /api/bookings` con `paymentMethod: "pending"`)
- [ ] ✅ Usuario puede obtener su reserva inmediatamente después de crearla (`GET /api/bookings/:id` → 200 OK, NO 403)
- [ ] ✅ Usuario puede actualizar información del huésped (`PATCH /api/bookings/:id`)
- [ ] ✅ Usuario puede confirmar reserva (`PATCH /api/bookings/:id` con `status: "confirmed"`)
- [ ] ✅ Usuario puede validar disponibilidad antes de reservar (`POST /api/bookings/validate`)
- [ ] ✅ No hay errores 403 al acceder a reservas propias
- [ ] ✅ No hay errores 429 durante el flujo normal de checkout
- [ ] ✅ La página de checkout carga correctamente y puede avanzar a pagos
- [ ] ✅ Todos los endpoints responden en menos de 2 segundos

---

**Última actualización:** 31 de Diciembre, 2024  
**Versión:** 1.0  
**Autor:** Equipo Frontend
