# 📋 PROMPT PARA BACKEND: Implementar Endpoint "Mis Reservas"

**Fecha:** Hoy  
**Prioridad:** 🔴 ALTA  
**Módulo:** Mis Reservas (Panel Personal de Usuario)

---

## 🎯 OBJETIVO

Implementar o corregir el endpoint `GET /api/bookings` para que retorne **todas las reservas del usuario autenticado**, permitiendo que el módulo "Mis Reservas" funcione correctamente.

---

## 📡 ENDPOINT REQUERIDO

### **GET /api/bookings**

**Descripción:** Obtiene todas las reservas del usuario autenticado (sin filtrar por status en la URL, el frontend filtra después).

**URL:** `GET /api/bookings?page=1&limit=1000`

**Headers Requeridos:**
```
Authorization: Bearer {token}  // REQUERIDO - JWT del usuario autenticado
Content-Type: application/json
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Límite de resultados (default: 100, recomendado: 1000 para obtener todas)
- `_t` (opcional): Timestamp para evitar caché (ignorar en backend)

**⚠️ IMPORTANTE:** El frontend NO envía `guestId` en la URL. El backend DEBE obtener el `userId` del token JWT y filtrar las reservas automáticamente.

---

## 🔐 AUTENTICACIÓN

### Proceso de Autenticación:

1. **Extraer token JWT del header:**
   ```javascript
   const token = req.headers.authorization?.replace('Bearer ', '');
   ```

2. **Decodificar token:**
   ```javascript
   const decoded = jwt.verify(token, JWT_SECRET);
   const userId = decoded.id || decoded.userId || decoded.sub;
   ```

3. **Validar que el token es válido y no ha expirado**

4. **Si no hay token o es inválido:** Retornar `401 Unauthorized`

---

## 📦 ESTRUCTURA DE RESPUESTA ESPERADA

### ✅ Respuesta Exitosa (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "695500561bd068ab78c49654",
      "propertyId": "6952c211ede9905614c48567",
      "property": {
        "id": "6952c211ede9905614c48567",
        "title": "Apartamento en el centro de Barcelona",
        "images": ["https://..."],
        "location": {
          "city": "Barcelona",
          "country": "España",
          "region": "Cataluña",
          "coordinates": {
            "lat": 41.3851,
            "lng": 2.1734
          }
        }
      },
      "guestId": "695238bd142a50e9602d2534",
      "guest": {
        "id": "695238bd142a50e9602d2534",
        "name": "ARMANDO LUIS PEREZ LEON",
        "email": "lolo@gmail.com"
      },
      "hostId": "69373fded72c75eb71475fa5",
      "host": {
        "id": "69373fded72c75eb71475fa5",
        "name": "Anfitrión",
        "email": "host@example.com"
      },
      "checkIn": "2025-02-15T00:00:00.000Z",
      "checkOut": "2025-02-20T00:00:00.000Z",
      "nights": 5,
      "guests": {
        "adults": 2,
        "children": 0,
        "infants": 0
      },
      "pricing": {
        "basePrice": 100,
        "nightsTotal": 500,
        "cleaningFee": 50,
        "serviceFee": 75,
        "total": 625,
        "currency": "EUR"
      },
      "status": "confirmed",
      "createdAt": "2025-01-10T10:30:00.000Z",
      "confirmedAt": "2025-01-10T11:00:00.000Z",
      "cancelledAt": null,
      "cancellationReason": null,
      "paymentInfo": {
        "method": "card",
        "status": "paid",
        "transactionId": "pi_xxx",
        "paidAt": "2025-01-10T11:05:00.000Z",
        "amount": 625,
        "currency": "EUR"
      },
      "guestReviewGiven": false,
      "hostReviewGiven": false,
      "guestRating": null
    }
  ]
}
```

**O también puede retornar:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      // ... mismo formato de arriba
    ],
    "total": 1,
    "page": 1,
    "limit": 1000
  }
}
```

### ❌ Respuesta de Error (401 Unauthorized):

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido o expirado. Por favor, inicia sesión nuevamente."
  }
}
```

### ❌ Respuesta de Error (500 Internal Server Error):

```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Error al obtener reservas"
  }
}
```

---

## 🔍 LÓGICA DE FILTRADO EN EL BACKEND

### ⚠️ CRÍTICO - Filtrado por Usuario:

El backend DEBE filtrar las reservas automáticamente por el `userId` del token JWT:

```javascript
// ✅ CORRECTO - Filtrar por userId del token
const userId = req.user.id; // Del token JWT decodificado

const bookings = await Booking.find({
  $or: [
    { guestId: userId },      // Reservas donde el usuario es huésped
    { userId: userId }        // También buscar en campo userId (por compatibilidad)
  ]
})
.sort({ checkIn: -1 })  // Ordenar por fecha de check-in (más recientes primero)
.limit(parseInt(req.query.limit) || 1000)
.skip((parseInt(req.query.page) - 1) * (parseInt(req.query.limit) || 1000));
```

### ⚠️ IMPORTANTE - Campos de Usuario:

El backend puede usar `guestId` o `userId` para identificar al usuario. El frontend busca en ambos campos:

- Si la reserva tiene `guestId` → Usar ese campo
- Si la reserva tiene `userId` → Usar ese campo
- El frontend busca en ambos: `booking.userId || booking.guestId`

---

## 📝 ESTRUCTURA DE DATOS REQUERIDA

### Booking Schema (MongoDB/Mongoose):

```javascript
{
  _id: ObjectId,
  propertyId: ObjectId,        // REQUERIDO
  guestId: ObjectId,           // REQUERIDO - ID del usuario que hace la reserva
  userId: ObjectId,           // OPCIONAL - Alias de guestId (para compatibilidad)
  hostId: ObjectId,           // REQUERIDO - ID del anfitrión
  checkIn: Date,              // REQUERIDO
  checkOut: Date,             // REQUERIDO
  nights: Number,             // REQUERIDO - Calculado: checkOut - checkIn
  guests: {
    adults: Number,            // REQUERIDO
    children: Number,          // OPCIONAL (default: 0)
    infants: Number           // OPCIONAL (default: 0)
  },
  pricing: {
    basePrice: Number,        // REQUERIDO - Precio por noche
    nightsTotal: Number,      // REQUERIDO - basePrice * nights
    cleaningFee: Number,      // OPCIONAL (default: 0)
    serviceFee: Number,        // OPCIONAL (default: 0)
    total: Number,            // REQUERIDO - Suma total
    currency: String          // OPCIONAL (default: "EUR")
  },
  status: String,             // REQUERIDO - 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'active'
  createdAt: Date,            // REQUERIDO
  confirmedAt: Date,           // OPCIONAL
  cancelledAt: Date,           // OPCIONAL
  cancellationReason: String, // OPCIONAL
  paymentInfo: {
    method: String,           // OPCIONAL - 'card' | 'paypal' | 'bank_transfer'
    status: String,           // OPCIONAL - 'pending' | 'paid' | 'failed' | 'refunded'
    transactionId: String,    // OPCIONAL
    paidAt: Date,            // OPCIONAL
    amount: Number,          // OPCIONAL
    currency: String          // OPCIONAL
  },
  guestReviewGiven: Boolean,  // OPCIONAL (default: false)
  hostReviewGiven: Boolean,  // OPCIONAL (default: false)
  guestRating: Number         // OPCIONAL
}
```

---

## 🔗 POPULATE DE RELACIONES

### ⚠️ IMPORTANTE - Incluir Datos Relacionados:

El backend DEBE hacer populate de las relaciones para incluir datos completos:

```javascript
const bookings = await Booking.find({
  $or: [
    { guestId: userId },
    { userId: userId }
  ]
})
.populate('propertyId', 'title images location')  // Populate propiedad
.populate('guestId', 'name email avatar')         // Populate huésped
.populate('hostId', 'name email avatar')         // Populate anfitrión
.sort({ checkIn: -1 })
.limit(parseInt(req.query.limit) || 1000);
```

**O si usas agregación:**
```javascript
const bookings = await Booking.aggregate([
  {
    $match: {
      $or: [
        { guestId: mongoose.Types.ObjectId(userId) },
        { userId: mongoose.Types.ObjectId(userId) }
      ]
    }
  },
  {
    $lookup: {
      from: 'properties',
      localField: 'propertyId',
      foreignField: '_id',
      as: 'property'
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'guestId',
      foreignField: '_id',
      as: 'guest'
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'hostId',
      foreignField: '_id',
      as: 'host'
    }
  },
  {
    $unwind: {
      path: '$property',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $unwind: {
      path: '$guest',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $unwind: {
      path: '$host',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $sort: { checkIn: -1 }
  },
  {
    $limit: parseInt(req.query.limit) || 1000
  }
]);
```

---

## 🛠️ IMPLEMENTACIÓN SUGERIDA

### Código de Ejemplo (Node.js/Express):

```javascript
// controllers/bookingController.js

exports.getAllBookings = async (req, res) => {
  try {
    // 1. Verificar autenticación
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.'
        }
      });
    }

    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;

    console.log(`[BOOKING CONTROLLER] Obteniendo reservas para userId: ${userId}`);

    // 2. Buscar reservas del usuario (como huésped)
    // Buscar en ambos campos por compatibilidad
    const bookings = await Booking.find({
      $or: [
        { guestId: mongoose.Types.ObjectId(userId) },
        { userId: mongoose.Types.ObjectId(userId) }
      ]
    })
    .populate({
      path: 'propertyId',
      select: 'title images location',
      populate: {
        path: 'location',
        select: 'city country region coordinates'
      }
    })
    .populate('guestId', 'name email avatar')
    .populate('hostId', 'name email avatar')
    .sort({ checkIn: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .lean();

    console.log(`[BOOKING CONTROLLER] Encontradas ${bookings.length} reservas para userId: ${userId}`);

    // 3. Transformar datos para el frontend
    const transformedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      propertyId: booking.propertyId?._id?.toString() || booking.propertyId?.toString(),
      property: booking.propertyId ? {
        id: booking.propertyId._id?.toString() || booking.propertyId.toString(),
        title: booking.propertyId.title,
        images: booking.propertyId.images || [],
        location: booking.propertyId.location || {
          city: '',
          country: '',
          region: '',
          coordinates: { lat: 0, lng: 0 }
        }
      } : null,
      guestId: booking.guestId?._id?.toString() || booking.guestId?.toString() || booking.userId?.toString(),
      guest: booking.guestId ? {
        id: booking.guestId._id?.toString() || booking.guestId.toString(),
        name: booking.guestId.name,
        email: booking.guestId.email,
        avatar: booking.guestId.avatar
      } : null,
      hostId: booking.hostId?._id?.toString() || booking.hostId?.toString(),
      host: booking.hostId ? {
        id: booking.hostId._id?.toString() || booking.hostId.toString(),
        name: booking.hostId.name,
        email: booking.hostId.email,
        avatar: booking.hostId.avatar
      } : null,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights || calculateNights(booking.checkIn, booking.checkOut),
      guests: {
        adults: booking.guests?.adults || 1,
        children: booking.guests?.children || 0,
        infants: booking.guests?.infants || 0
      },
      pricing: {
        basePrice: booking.pricing?.basePrice || 0,
        nightsTotal: booking.pricing?.nightsTotal || 0,
        cleaningFee: booking.pricing?.cleaningFee || 0,
        serviceFee: booking.pricing?.serviceFee || 0,
        total: booking.pricing?.total || 0,
        currency: booking.pricing?.currency || 'EUR'
      },
      status: booking.status,
      createdAt: booking.createdAt,
      confirmedAt: booking.confirmedAt,
      cancelledAt: booking.cancelledAt,
      cancellationReason: booking.cancellationReason,
      paymentInfo: booking.paymentInfo ? {
        method: booking.paymentInfo.method,
        status: booking.paymentInfo.status,
        transactionId: booking.paymentInfo.transactionId,
        paidAt: booking.paymentInfo.paidAt,
        amount: booking.paymentInfo.amount,
        currency: booking.paymentInfo.currency
      } : undefined,
      guestReviewGiven: booking.guestReviewGiven || false,
      hostReviewGiven: booking.hostReviewGiven || false,
      guestRating: booking.guestRating
    }));

    // 4. Retornar respuesta
    return res.status(200).json({
      success: true,
      data: transformedBookings
    });

  } catch (error) {
    console.error('[BOOKING CONTROLLER] Error obteniendo reservas:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error al obtener reservas'
      }
    });
  }
};

// Helper para calcular noches
function calculateNights(checkIn, checkOut) {
  const oneDay = 24 * 60 * 60 * 1000;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  return Math.round((checkOutDate - checkInDate) / oneDay);
}
```

---

## ⚠️ PUNTOS CRÍTICOS

### 1. **Asignación de guestId al Crear Reserva:**

Cuando se crea una reserva (POST /api/bookings), el backend DEBE asignar:

```javascript
const booking = await Booking.create({
  propertyId: req.body.propertyId,
  guestId: req.user.id,  // ⚠️ CRÍTICO: Del token JWT, NO del body
  // ... otros campos
});
```

**❌ INCORRECTO:**
```javascript
guestId: req.body.guestId  // NO hacer esto - puede ser manipulado
```

**✅ CORRECTO:**
```javascript
guestId: req.user.id  // Del token JWT decodificado
```

### 2. **Filtrado Automático:**

El backend NO debe esperar `guestId` en la query. DEBE filtrar automáticamente por el `userId` del token:

**❌ INCORRECTO:**
```javascript
// Esperar guestId en query params
const guestId = req.query.guestId;
const bookings = await Booking.find({ guestId });
```

**✅ CORRECTO:**
```javascript
// Obtener userId del token
const userId = req.user.id;
const bookings = await Booking.find({
  $or: [
    { guestId: userId },
    { userId: userId }
  ]
});
```

### 3. **Comparación de ObjectIds:**

Si usas MongoDB, asegúrate de comparar ObjectIds correctamente:

```javascript
// ✅ CORRECTO
const bookings = await Booking.find({
  $or: [
    { guestId: mongoose.Types.ObjectId(userId) },
    { userId: mongoose.Types.ObjectId(userId) }
  ]
});

// O si userId ya es ObjectId
const bookings = await Booking.find({
  $or: [
    { guestId: userId },
    { userId: userId }
  ]
});
```

### 4. **Incluir Todas las Reservas:**

El endpoint DEBE retornar todas las reservas del usuario, sin filtrar por status:

- ✅ `pending` - Pendientes de confirmación
- ✅ `confirmed` - Confirmadas
- ✅ `active` - En curso
- ✅ `completed` - Completadas
- ✅ `cancelled` - Canceladas

El frontend se encarga de categorizarlas después.

---

## 🧪 CASOS DE PRUEBA

### Test 1: Usuario con Reservas
```
Request:
  GET /api/bookings?page=1&limit=1000
  Headers: Authorization: Bearer {token_válido}

Expected Response:
  Status: 200
  Body: { success: true, data: [reserva1, reserva2, ...] }
  Debe incluir todas las reservas del usuario autenticado
```

### Test 2: Usuario sin Reservas
```
Request:
  GET /api/bookings?page=1&limit=1000
  Headers: Authorization: Bearer {token_válido}

Expected Response:
  Status: 200
  Body: { success: true, data: [] }
  Array vacío si no hay reservas
```

### Test 3: Token Inválido
```
Request:
  GET /api/bookings?page=1&limit=1000
  Headers: Authorization: Bearer {token_inválido}

Expected Response:
  Status: 401
  Body: { success: false, error: { code: 'UNAUTHORIZED', message: '...' } }
```

### Test 4: Sin Token
```
Request:
  GET /api/bookings?page=1&limit=1000
  Headers: (sin Authorization)

Expected Response:
  Status: 401
  Body: { success: false, error: { code: 'UNAUTHORIZED', message: '...' } }
```

---

## 📊 LOGS RECOMENDADOS

Para facilitar el debugging, agregar estos logs:

```javascript
console.log(`[BOOKING CONTROLLER] Request recibido:`, {
  userId: req.user.id,
  page: req.query.page,
  limit: req.query.limit,
  hasToken: !!req.headers.authorization
});

console.log(`[BOOKING CONTROLLER] Buscando reservas para userId: ${userId}`);

console.log(`[BOOKING CONTROLLER] Encontradas ${bookings.length} reservas`);

// Log de cada reserva encontrada
bookings.forEach((booking, index) => {
  console.log(`[BOOKING CONTROLLER] Reserva ${index + 1}:`, {
    id: booking._id,
    guestId: booking.guestId,
    userId: booking.userId,
    status: booking.status,
    checkIn: booking.checkIn
  });
});
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Endpoint `GET /api/bookings` implementado
- [ ] Autenticación JWT requerida y funcionando
- [ ] Filtrado automático por `userId` del token (no espera `guestId` en query)
- [ ] Busca en ambos campos: `guestId` y `userId` (para compatibilidad)
- [ ] Retorna todas las reservas (sin filtrar por status)
- [ ] Incluye populate de `propertyId`, `guestId`, `hostId`
- [ ] Estructura de respuesta correcta (array de bookings)
- [ ] Fechas en formato ISO string
- [ ] Pricing completo con currency
- [ ] PaymentInfo incluido si existe
- [ ] Ordenamiento por `checkIn` descendente (más recientes primero)
- [ ] Manejo de errores (401, 500)
- [ ] Logs para debugging

---

## 🔗 ENDPOINTS RELACIONADOS

### POST /api/bookings (Crear Reserva)

**⚠️ CRÍTICO:** Al crear una reserva, asegurar que se asigna correctamente:

```javascript
const booking = await Booking.create({
  propertyId: req.body.propertyId,
  guestId: req.user.id,  // ⚠️ Del token, NO del body
  hostId: property.hostId,
  checkIn: new Date(req.body.checkIn),
  checkOut: new Date(req.body.checkOut),
  // ... otros campos
});
```

---

## 📝 NOTAS ADICIONALES

1. **Paginación:** El frontend usa `limit=1000` para obtener todas las reservas. Si hay más de 1000, considerar implementar paginación real.

2. **Performance:** Si hay muchas reservas, considerar agregar índices:
   ```javascript
   // Índice en guestId para búsquedas rápidas
   Booking.index({ guestId: 1 });
   Booking.index({ userId: 1 });
   Booking.index({ checkIn: -1 });
   ```

3. **Caché:** El frontend agrega headers anti-caché. El backend puede ignorar el parámetro `_t` (timestamp).

4. **CORS:** Asegurar que los headers CORS permitan `Authorization` y `Content-Type`.

---

## 🎯 RESUMEN EJECUTIVO

**Para que "Mis Reservas" funcione, el backend necesita:**

1. ✅ Endpoint `GET /api/bookings` que filtre automáticamente por `userId` del token
2. ✅ Retornar todas las reservas del usuario (sin filtrar por status)
3. ✅ Incluir datos relacionados (property, guest, host)
4. ✅ Estructura de respuesta correcta con todos los campos requeridos
5. ✅ Al crear reservas, asignar `guestId` desde el token (no del body)

**El frontend ya está listo y funcionando. Solo necesita que el backend retorne los datos correctamente.**

---

**Última actualización:** Hoy  
**Prioridad:** 🔴 ALTA  
**Estado Frontend:** ✅ Listo y funcionando  
**Estado Backend:** ⚠️ Pendiente de implementación/corrección
