# 📋 ESPECIFICACIÓN BACKEND - DISPONIBILIDAD EXACTA DE FECHAS

**Fecha:** 1 de Enero, 2025  
**Prioridad:** 🔴 **CRÍTICA**  
**Objetivo:** Sincronizar exactamente las fechas disponibles entre calendario y validación

---

## 🎯 PROBLEMA ACTUAL

**Síntoma:**
- El calendario muestra fechas como disponibles que en realidad NO lo están
- El usuario puede seleccionar fechas que luego son rechazadas en el checkout
- Desincronización entre `GET /api/properties/:id/availability` y `POST /api/bookings/validate`

**Causa Raíz:**
- El endpoint `GET /api/properties/:id/availability` no devuelve las fechas bloqueadas correctas desde las reservas reales
- El endpoint `POST /api/bookings/validate` SÍ funciona correctamente, pero es demasiado tarde (el usuario ya seleccionó)

---

## ✅ SOLUCIÓN REQUERIDA

**Ambos endpoints deben usar la MISMA lógica para determinar disponibilidad:**

1. Consultar reservas reales de la base de datos
2. Generar array de fechas bloqueadas
3. Validar contra ese mismo array

---

## 📡 ENDPOINT 1: GET /api/properties/{propertyId}/availability

### Especificación Técnica

```
GET /api/properties/{propertyId}/availability

Headers:
  Content-Type: application/json
  (No requiere autenticación para consultar disponibilidad)

Query Parameters (opcionales):
  - checkIn (string, opcional): Fecha de check-in (YYYY-MM-DD)
  - checkOut (string, opcional): Fecha de check-out (YYYY-MM-DD)

Response (200 OK):
{
  "success": true,
  "data": {
    "propertyId": "string (ObjectId)",
    "blockedDates": [
      "2026-02-16",
      "2026-02-17",
      "2026-02-18",
      "2026-03-05",
      "2026-03-06",
      ...
    ],
    "availableDates": [], // Opcional, puede estar vacío
    "minNights": 1,
    "maxNights": 365,
    "instantBook": true
  }
}
```

### Lógica Requerida en el Backend

**PASO 1: Consultar reservas reales**

```javascript
// Pseudocódigo - Adaptar a tu ORM/Query Builder
const bookings = await Booking.find({
  propertyId: propertyId,
  status: { $in: ['pending', 'confirmed', 'active'] }, // Solo reservas activas
  checkOut: { $gt: new Date() } // Solo reservas futuras
});
```

**PASO 2: Generar array de fechas bloqueadas**

```javascript
const blockedDates = [];

for (const booking of bookings) {
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  
  // Generar todas las fechas entre checkIn y checkOut (excluyendo checkOut)
  let currentDate = new Date(checkIn);
  
  while (currentDate < checkOut) {
    // Formato: YYYY-MM-DD (ISO date string)
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Evitar duplicados
    if (!blockedDates.includes(dateString)) {
      blockedDates.push(dateString);
    }
    
    // Avanzar al siguiente día
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

// Ordenar fechas
blockedDates.sort();
```

**PASO 3: Devolver respuesta**

```javascript
return {
  success: true,
  data: {
    propertyId: propertyId,
    blockedDates: blockedDates, // ← CRÍTICO: Array completo de fechas bloqueadas
    availableDates: [], // Opcional
    minNights: property.minNights || 1,
    maxNights: property.maxNights || 365,
    instantBook: property.instantBook || false
  }
};
```

### Ejemplo de Implementación (MongoDB/Mongoose)

```javascript
// GET /api/properties/:propertyId/availability
async function getPropertyAvailability(req, res) {
  try {
    const { propertyId } = req.params;
    
    // 1. Consultar reservas activas
    const bookings = await Booking.find({
      propertyId: propertyId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      checkOut: { $gt: new Date() }
    }).select('checkIn checkOut');
    
    // 2. Generar array de fechas bloqueadas
    const blockedDates = [];
    const dateSet = new Set(); // Para evitar duplicados
    
    for (const booking of bookings) {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      
      let currentDate = new Date(checkIn);
      
      while (currentDate < checkOut) {
        const dateString = currentDate.toISOString().split('T')[0];
        dateSet.add(dateString);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    // Convertir Set a Array ordenado
    const blockedDatesArray = Array.from(dateSet).sort();
    
    // 3. Obtener información de la propiedad
    const property = await Property.findById(propertyId).select('minNights maxNights instantBook');
    
    // 4. Devolver respuesta
    res.json({
      success: true,
      data: {
        propertyId: propertyId,
        blockedDates: blockedDatesArray,
        availableDates: [],
        minNights: property?.minNights || 1,
        maxNights: property?.maxNights || 365,
        instantBook: property?.instantBook || false
      }
    });
  } catch (error) {
    console.error('Error obteniendo disponibilidad:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error al obtener disponibilidad'
      }
    });
  }
}
```

### Casos de Prueba

**Caso 1: Propiedad sin reservas**
```json
// Request
GET /api/properties/6952c211ede9905614c48567/availability

// Response
{
  "success": true,
  "data": {
    "propertyId": "6952c211ede9905614c48567",
    "blockedDates": [], // ← Array vacío, todas las fechas disponibles
    "minNights": 1,
    "maxNights": 365,
    "instantBook": true
  }
}
```

**Caso 2: Propiedad con reservas**
```json
// Request
GET /api/properties/6952c211ede9905614c48567/availability

// Response
{
  "success": true,
  "data": {
    "propertyId": "6952c211ede9905614c48567",
    "blockedDates": [
      "2026-02-16", // Reserva del 16 al 18 de febrero
      "2026-02-17",
      "2026-03-05", // Reserva del 5 al 7 de marzo
      "2026-03-06"
    ],
    "minNights": 1,
    "maxNights": 365,
    "instantBook": true
  }
}
```

**Caso 3: Reservas solapadas**
```javascript
// Si hay dos reservas:
// - Reserva 1: 16-18 febrero
// - Reserva 2: 17-19 febrero

// Resultado esperado:
blockedDates: ["2026-02-16", "2026-02-17", "2026-02-18"] // Sin duplicados
```

---

## 📡 ENDPOINT 2: POST /api/bookings/validate

### Especificación Técnica

```
POST /api/bookings/validate

Headers:
  Content-Type: application/json
  Authorization: Bearer {token}  // Opcional

Request Body:
{
  "propertyId": "string (ObjectId)",
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "guests": number
}

Response Success (200 OK):
{
  "success": true,
  "data": {
    "available": true,
    "message": "Las fechas están disponibles"
  }
}

Response Not Available (200 OK):
{
  "success": true,
  "data": {
    "available": false,
    "message": "El rango de fechas seleccionado no está disponible",
    "reason": "CONFLICT" // Opcional
  }
}
```

### Lógica Requerida (DEBE SER LA MISMA QUE EL ENDPOINT DE DISPONIBILIDAD)

```javascript
// POST /api/bookings/validate
async function validateBooking(req, res) {
  try {
    const { propertyId, checkIn, checkOut, guests } = req.body;
    
    // 1. Validar formato de fechas
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Fechas inválidas'
        }
      });
    }
    
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'La fecha de check-in debe ser anterior a check-out'
        }
      });
    }
    
    // 2. Consultar reservas activas (MISMA LÓGICA QUE GET /availability)
    const bookings = await Booking.find({
      propertyId: propertyId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      checkOut: { $gt: new Date() }
    });
    
    // 3. Verificar si hay conflicto con las fechas solicitadas
    const hasConflict = bookings.some(booking => {
      const bookingCheckIn = new Date(booking.checkIn);
      const bookingCheckOut = new Date(booking.checkOut);
      
      // Verificar solapamiento
      // Conflicto si:
      // - checkIn solicitado está dentro del rango de reserva existente
      // - checkOut solicitado está dentro del rango de reserva existente
      // - El rango solicitado contiene completamente una reserva existente
      return (
        (checkInDate >= bookingCheckIn && checkInDate < bookingCheckOut) ||
        (checkOutDate > bookingCheckIn && checkOutDate <= bookingCheckOut) ||
        (checkInDate <= bookingCheckIn && checkOutDate >= bookingCheckOut)
      );
    });
    
    // 4. Verificar capacidad (opcional)
    const property = await Property.findById(propertyId).select('capacity');
    if (guests > property?.capacity?.guests) {
      return res.json({
        success: true,
        data: {
          available: false,
          message: `La propiedad solo acepta hasta ${property.capacity.guests} huéspedes`,
          reason: "CAPACITY_EXCEEDED"
        }
      });
    }
    
    // 5. Devolver respuesta
    if (hasConflict) {
      return res.json({
        success: true,
        data: {
          available: false,
          message: "El rango de fechas seleccionado no está disponible",
          reason: "CONFLICT"
        }
      });
    }
    
    return res.json({
      success: true,
      data: {
        available: true,
        message: "Las fechas están disponibles"
      }
    });
  } catch (error) {
    console.error('Error validando reserva:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error al validar reserva'
      }
    });
  }
}
```

---

## 🔄 SINCRONIZACIÓN CRÍTICA

### Regla de Oro

**Ambos endpoints DEBEN usar la MISMA lógica:**

1. **Misma consulta de reservas:**
   ```javascript
   Booking.find({
     propertyId: propertyId,
     status: { $in: ['pending', 'confirmed', 'active'] },
     checkOut: { $gt: new Date() }
   })
   ```

2. **Misma lógica de conflicto:**
   - Si una fecha está en `blockedDates` → NO debe estar disponible en `validate`
   - Si `validate` dice `available: false` → Esa fecha DEBE estar en `blockedDates`

### Ejemplo de Sincronización

```javascript
// Si GET /availability devuelve:
blockedDates: ["2026-02-16", "2026-02-17", "2026-02-18"]

// Entonces POST /validate DEBE rechazar:
checkIn: "2026-02-16", checkOut: "2026-02-18" → available: false
checkIn: "2026-02-15", checkOut: "2026-02-17" → available: false (solapa)
checkIn: "2026-02-17", checkOut: "2026-02-19" → available: false (solapa)

// Y DEBE aceptar:
checkIn: "2026-02-19", checkOut: "2026-02-21" → available: true
checkIn: "2026-02-15", checkOut: "2026-02-16" → available: true (checkOut es el mismo día que checkIn de reserva)
```

---

## 🧪 CHECKLIST DE IMPLEMENTACIÓN

### Endpoint GET /api/properties/:id/availability

- [ ] Consulta reservas con status `['pending', 'confirmed', 'active']`
- [ ] Filtra solo reservas futuras (`checkOut > NOW()`)
- [ ] Genera array de fechas bloqueadas (una por cada día entre checkIn y checkOut)
- [ ] Excluye `checkOut` del array (solo incluye checkIn hasta checkOut-1)
- [ ] Elimina duplicados si hay reservas solapadas
- [ ] Ordena el array de fechas
- [ ] Formato de fecha: `YYYY-MM-DD` (ISO date string)
- [ ] Devuelve array vacío `[]` si no hay reservas (no `null`)
- [ ] Incluye `minNights`, `maxNights`, `instantBook` en la respuesta

### Endpoint POST /api/bookings/validate

- [ ] Valida formato de fechas (YYYY-MM-DD)
- [ ] Valida que checkIn < checkOut
- [ ] Usa la MISMA consulta de reservas que GET /availability
- [ ] Verifica solapamiento correctamente (incluye casos edge)
- [ ] Devuelve `available: true` si no hay conflicto
- [ ] Devuelve `available: false` con mensaje claro si hay conflicto
- [ ] Valida capacidad de huéspedes (opcional pero recomendado)

### Sincronización

- [ ] Ambos endpoints usan la misma consulta de reservas
- [ ] Ambos endpoints consideran los mismos status de reserva
- [ ] La lógica de conflicto es consistente entre ambos
- [ ] Se han probado casos con reservas solapadas
- [ ] Se han probado casos sin reservas
- [ ] Se han probado casos con múltiples reservas

---

## 📊 CASOS DE PRUEBA COMPLETOS

### Test 1: Propiedad sin reservas
```javascript
// GET /api/properties/123/availability
// Response: { blockedDates: [] }

// POST /api/bookings/validate
// Body: { propertyId: "123", checkIn: "2026-02-16", checkOut: "2026-02-18", guests: 2 }
// Response: { available: true }
```

### Test 2: Propiedad con una reserva
```javascript
// Reserva existente: 16-18 febrero

// GET /api/properties/123/availability
// Response: { blockedDates: ["2026-02-16", "2026-02-17"] }

// POST /api/bookings/validate
// Body: { propertyId: "123", checkIn: "2026-02-16", checkOut: "2026-02-18", guests: 2 }
// Response: { available: false, message: "El rango de fechas seleccionado no está disponible" }
```

### Test 3: Reservas solapadas
```javascript
// Reserva 1: 16-18 febrero
// Reserva 2: 17-19 febrero

// GET /api/properties/123/availability
// Response: { blockedDates: ["2026-02-16", "2026-02-17", "2026-02-18"] } // Sin duplicados

// POST /api/bookings/validate
// Body: { propertyId: "123", checkIn: "2026-02-17", checkOut: "2026-02-19", guests: 2 }
// Response: { available: false }
```

### Test 4: Fechas adyacentes (debe permitir)
```javascript
// Reserva existente: 16-18 febrero

// POST /api/bookings/validate
// Body: { propertyId: "123", checkIn: "2026-02-18", checkOut: "2026-02-20", guests: 2 }
// Response: { available: true } // checkOut de reserva = checkIn de nueva reserva (OK)
```

---

## 🚨 IMPORTANTE

1. **NO usar caché** para las fechas bloqueadas si puede causar desincronización
2. **Siempre consultar la base de datos** para obtener reservas reales
3. **Misma lógica en ambos endpoints** - Si cambias uno, cambia el otro
4. **Formato de fecha consistente** - Siempre `YYYY-MM-DD` (ISO date string)
5. **Manejar reservas solapadas** - No duplicar fechas en el array

---

## 📝 NOTAS ADICIONALES

- El frontend ahora valida en tiempo real cuando el usuario selecciona fechas en el calendario
- Si el backend devuelve fechas bloqueadas correctas, el calendario las mostrará como no disponibles
- Si el backend valida correctamente, el checkout rechazará fechas no disponibles
- **La sincronización entre ambos endpoints es CRÍTICA para evitar confusión del usuario**

---

## 🔗 REFERENCIAS

- `PROBLEMA_FECHAS_NO_DISPONIBLES_CHECKOUT.md` - Problema original
- `REPORTE_BACKEND_DISPONIBILIDAD_PROPIEDADES.md` - Reporte anterior
- `components/property/AvailabilityCalendar.tsx` - Calendario frontend
- `lib/bookings/booking-service.ts` - Servicio de validación frontend

