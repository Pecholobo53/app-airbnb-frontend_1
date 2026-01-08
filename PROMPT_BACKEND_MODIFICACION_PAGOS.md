# 🔧 PROMPT PARA BACKEND - Modificación de Pagos Stripe

## 📋 CONTEXTO DEL PROBLEMA

**Problema actual:**
- El frontend intenta crear una reserva con `paymentMethod: 'pending'`
- Si hay conflicto de fechas (409), el backend rechaza la reserva
- Sin `bookingId` válido, no se puede crear el Payment Intent de Stripe
- El formulario de Stripe no aparece porque falta el `clientSecret`

**Requisito del usuario:**
- Todas las fechas deben estar disponibles (modo permisivo)
- El formulario de Stripe debe aparecer incluso si hay conflictos de fechas
- El usuario debe poder procesar el pago con Stripe

---

## 🎯 SOLUCIÓN RECOMENDADA: Modo Permisivo para Reservas

### Opción 1: Aceptar todas las reservas sin validar conflictos (RECOMENDADA)

**Modificar el endpoint:** `POST /api/bookings`

**Cambios necesarios:**

1. **Agregar parámetro opcional `skipConflictCheck`**:
   ```javascript
   // En el controlador de creación de reserva
   const { skipConflictCheck = false } = req.body;
   ```

2. **Modificar la validación de disponibilidad**:
   ```javascript
   // Antes de crear la reserva
   if (!skipConflictCheck) {
     // Validar disponibilidad solo si skipConflictCheck es false
     const isAvailable = await checkAvailability(propertyId, checkIn, checkOut);
     if (!isAvailable) {
       return res.status(409).json({
         success: false,
         error: {
           code: 'CONFLICT',
           message: 'El rango de fechas seleccionado no está disponible'
         }
       });
     }
   }
   
   // Crear la reserva sin validar conflictos si skipConflictCheck es true
   const booking = await createBooking({
     propertyId,
     checkIn,
     checkOut,
     guests,
     guestInfo,
     paymentMethod: 'pending',
     // ... otros campos
   });
   ```

3. **Alternativa más simple - Modo permisivo global**:
   ```javascript
   // Opción A: Variable de entorno para modo permisivo
   const PERMISSIVE_MODE = process.env.PERMISSIVE_BOOKING_MODE === 'true';
   
   // En la validación de disponibilidad
   if (!PERMISSIVE_MODE) {
     const isAvailable = await checkAvailability(propertyId, checkIn, checkOut);
     if (!isAvailable) {
       return res.status(409).json({ /* error */ });
     }
   }
   
   // Continuar con la creación de la reserva
   ```

---

### Opción 2: Crear Payment Intent sin requerir bookingId válido

**Modificar el endpoint:** `POST /api/bookings/:id/payment/create-intent`

**Cambios necesarios:**

1. **Permitir crear Payment Intent incluso si la reserva no existe o tiene conflicto**:
   ```javascript
   // En el controlador de create-intent
   exports.createPaymentIntent = async (req, res) => {
     const { id: bookingId } = req.params;
     
     // Intentar obtener la reserva
     let booking = await Booking.findById(bookingId);
     
     // Si la reserva no existe o tiene conflicto, crear una temporal
     if (!booking || booking.status === 'conflict') {
       // Crear reserva temporal para el Payment Intent
       booking = await Booking.create({
         _id: bookingId,
         propertyId: req.body.propertyId || booking?.propertyId,
         checkIn: req.body.checkIn || booking?.checkIn,
         checkOut: req.body.checkOut || booking?.checkOut,
         guests: req.body.guests || booking?.guests,
         status: 'pending',
         paymentMethod: 'pending',
         // Marcar como temporal
         isTemporary: true,
         // ... otros campos necesarios
       });
     }
     
     // Continuar con la creación del Payment Intent normalmente
     const paymentIntent = await stripe.paymentIntents.create({
       amount: calculateAmount(booking),
       currency: 'eur',
       metadata: {
         bookingId: booking._id.toString(),
         propertyId: booking.propertyId.toString(),
       },
     });
     
     // Actualizar la reserva con el Payment Intent ID
     booking.paymentIntentId = paymentIntent.id;
     await booking.save();
     
     return res.json({
       success: true,
       data: {
         clientSecret: paymentIntent.client_secret,
         paymentIntentId: paymentIntent.id,
       },
     });
   };
   ```

2. **Alternativa: Endpoint alternativo para Payment Intent sin reserva**:
   ```javascript
   // Nuevo endpoint: POST /api/payments/create-intent
   exports.createPaymentIntentWithoutBooking = async (req, res) => {
     const { propertyId, checkIn, checkOut, guests, amount } = req.body;
     
     // Validar datos requeridos
     if (!propertyId || !checkIn || !checkOut || !guests || !amount) {
       return res.status(400).json({
         success: false,
         error: {
           code: 'INVALID_REQUEST',
           message: 'Faltan datos requeridos para crear el Payment Intent'
         }
       });
     }
     
     // Crear Payment Intent directamente sin reserva
     const paymentIntent = await stripe.paymentIntents.create({
       amount: amount * 100, // Convertir a centavos
       currency: 'eur',
       metadata: {
         propertyId,
         checkIn,
         checkOut,
         guests,
         userId: req.user.id,
       },
     });
     
     return res.json({
       success: true,
       data: {
         clientSecret: paymentIntent.client_secret,
         paymentIntentId: paymentIntent.id,
       },
     });
   };
   ```

---

## 🔄 SOLUCIÓN HÍBRIDA (RECOMENDADA)

**Combinar ambas opciones:**

1. **Modo permisivo para reservas** (Opción 1)
   - Agregar variable de entorno `PERMISSIVE_BOOKING_MODE=true`
   - Cuando está activo, aceptar todas las reservas sin validar conflictos

2. **Crear reserva automáticamente al crear Payment Intent** (Opción 2)
   - Si el `bookingId` no existe, crear la reserva automáticamente
   - Esto asegura que siempre haya un `bookingId` válido

**Implementación combinada:**

```javascript
// En createPaymentIntent
exports.createPaymentIntent = async (req, res) => {
  const { id: bookingId } = req.params;
  
  try {
    // Intentar obtener la reserva
    let booking = await Booking.findById(bookingId);
    
    // Si la reserva no existe, crearla automáticamente
    if (!booking) {
      // Obtener datos del body o de la sesión del usuario
      const { propertyId, checkIn, checkOut, guests, guestInfo } = req.body;
      
      if (!propertyId || !checkIn || !checkOut || !guests) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Faltan datos para crear la reserva'
          }
        });
      }
      
      // Crear reserva en modo permisivo (sin validar conflictos)
      booking = await Booking.create({
        _id: bookingId,
        propertyId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        guestInfo: guestInfo || {
          name: req.user.name,
          email: req.user.email,
        },
        userId: req.user.id,
        status: 'pending',
        paymentMethod: 'pending',
        // Marcar que se creó automáticamente
        autoCreated: true,
      });
      
      console.log(`✅ Reserva creada automáticamente para Payment Intent: ${bookingId}`);
    }
    
    // Validar que la reserva pertenece al usuario
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'No tienes permiso para pagar esta reserva'
        }
      });
    }
    
    // Validar que la reserva no esté ya pagada
    if (booking.paymentInfo?.status === 'paid') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_PAID',
          message: 'Esta reserva ya ha sido pagada'
        }
      });
    }
    
    // Calcular el monto
    const property = await Property.findById(booking.propertyId);
    const nights = Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24));
    const amount = property.pricePerNight * nights;
    
    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir a centavos
      currency: 'eur',
      metadata: {
        bookingId: booking._id.toString(),
        propertyId: booking.propertyId.toString(),
        userId: req.user.id,
      },
    });
    
    // Guardar el Payment Intent ID en la reserva
    booking.paymentIntentId = paymentIntent.id;
    await booking.save();
    
    return res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
    
  } catch (error) {
    console.error('Error creando Payment Intent:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error al crear el Payment Intent'
      }
    });
  }
};
```

---

## 📝 INSTRUCCIONES PASO A PASO

### Paso 1: Modificar creación de reservas (Modo Permisivo)

**Archivo:** `controllers/bookingController.js` (o equivalente)

```javascript
// Agregar al inicio del archivo
const PERMISSIVE_MODE = process.env.PERMISSIVE_BOOKING_MODE === 'true';

// Modificar la función createBooking
exports.createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests, guestInfo, paymentMethod } = req.body;
    
    // Validar datos básicos
    if (!propertyId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Faltan datos requeridos'
        }
      });
    }
    
    // Validar disponibilidad SOLO si no está en modo permisivo
    if (!PERMISSIVE_MODE) {
      const isAvailable = await checkAvailability(propertyId, checkIn, checkOut);
      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'El rango de fechas seleccionado no está disponible'
          }
        });
      }
    } else {
      console.log('⚠️ Modo permisivo activado - Saltando validación de disponibilidad');
    }
    
    // Crear la reserva
    const booking = await Booking.create({
      propertyId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      guestInfo: guestInfo || {
        name: req.user.name,
        email: req.user.email,
      },
      userId: req.user.id,
      status: 'pending',
      paymentMethod: paymentMethod || 'pending',
    });
    
    return res.json({
      success: true,
      data: {
        booking: {
          id: booking._id,
          status: booking.status,
          paymentInfo: {
            status: 'pending'
          }
        }
      }
    });
    
  } catch (error) {
    console.error('Error creando reserva:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error al crear la reserva'
      }
    });
  }
};
```

### Paso 2: Modificar creación de Payment Intent

**Archivo:** `controllers/paymentController.js` (o equivalente)

```javascript
exports.createPaymentIntent = async (req, res) => {
  try {
    const { id: bookingId } = req.params;
    
    // Intentar obtener la reserva
    let booking = await Booking.findById(bookingId);
    
    // Si la reserva no existe, crearla automáticamente
    if (!booking) {
      // Obtener datos del body
      const { propertyId, checkIn, checkOut, guests, guestInfo } = req.body;
      
      if (!propertyId || !checkIn || !checkOut || !guests) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Faltan datos para crear la reserva. Proporciona propertyId, checkIn, checkOut y guests en el body.'
          }
        });
      }
      
      // Crear reserva automáticamente (en modo permisivo)
      booking = await Booking.create({
        _id: bookingId,
        propertyId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        guestInfo: guestInfo || {
          name: req.user.name,
          email: req.user.email,
        },
        userId: req.user.id,
        status: 'pending',
        paymentMethod: 'pending',
        autoCreated: true, // Marcar que se creó automáticamente
      });
      
      console.log(`✅ Reserva creada automáticamente: ${bookingId}`);
    }
    
    // Validar permisos
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'No tienes permiso para pagar esta reserva'
        }
      });
    }
    
    // Validar que no esté ya pagada
    if (booking.paymentInfo?.status === 'paid') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_PAID',
          message: 'Esta reserva ya ha sido pagada'
        }
      });
    }
    
    // Calcular monto
    const property = await Property.findById(booking.propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Propiedad no encontrada'
        }
      });
    }
    
    const nights = Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24));
    const amount = property.pricePerNight * nights;
    
    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir a centavos
      currency: 'eur',
      metadata: {
        bookingId: booking._id.toString(),
        propertyId: booking.propertyId.toString(),
        userId: req.user.id,
      },
    });
    
    // Guardar Payment Intent ID
    booking.paymentIntentId = paymentIntent.id;
    await booking.save();
    
    return res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
    
  } catch (error) {
    console.error('Error creando Payment Intent:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error al crear el Payment Intent'
      }
    });
  }
};
```

### Paso 3: Configurar variable de entorno

**Archivo:** `.env`

```env
# Modo permisivo para reservas (acepta todas las reservas sin validar conflictos)
PERMISSIVE_BOOKING_MODE=true
```

---

## ✅ RESULTADO ESPERADO

Después de implementar estos cambios:

1. ✅ **Todas las reservas se aceptan** (si `PERMISSIVE_BOOKING_MODE=true`)
2. ✅ **El Payment Intent se puede crear** incluso si la reserva no existe (se crea automáticamente)
3. ✅ **El formulario de Stripe aparece** porque siempre hay un `clientSecret` válido
4. ✅ **El usuario puede procesar el pago** con Stripe normalmente

---

## 🧪 PRUEBAS

### Prueba 1: Crear reserva con conflicto
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "property-id",
    "checkIn": "2025-01-20",
    "checkOut": "2025-01-25",
    "guests": 2,
    "paymentMethod": "pending"
  }'
```

**Resultado esperado:** `200 OK` (en modo permisivo) o `409 Conflict` (sin modo permisivo)

### Prueba 2: Crear Payment Intent sin reserva
```bash
curl -X POST http://localhost:3000/api/bookings/temp-booking-id/payment/create-intent \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "property-id",
    "checkIn": "2025-01-20",
    "checkOut": "2025-01-25",
    "guests": 2
  }'
```

**Resultado esperado:** `200 OK` con `clientSecret` y `paymentIntentId`

---

## 📚 REFERENCIAS

- [Documentación de Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Endpoints de Pago - Documentación Postman](./docs/PAYMENT_ENDPOINTS_POSTMAN.md)
- [Endpoints de Pago - Ejemplos cURL](./docs/PAYMENT_ENDPOINTS_CURL.md)

---

## ⚠️ NOTAS IMPORTANTES

1. **Seguridad**: El modo permisivo debe usarse solo en desarrollo/testing. En producción, considera validar conflictos pero de forma más flexible.

2. **Datos requeridos**: Si creas la reserva automáticamente al crear el Payment Intent, asegúrate de recibir todos los datos necesarios (`propertyId`, `checkIn`, `checkOut`, `guests`) en el body de la petición.

3. **Validación de usuario**: Siempre valida que el usuario tenga permiso para crear reservas y Payment Intents.

4. **Logs**: Agrega logs para rastrear cuando se crean reservas automáticamente o cuando se usa el modo permisivo.

---

## 🎯 RESUMEN EJECUTIVO

**Problema:** El frontend no puede crear Payment Intents cuando hay conflictos de fechas (409).

**Solución:** 
1. Modo permisivo para reservas (acepta todas sin validar conflictos)
2. Crear reserva automáticamente al crear Payment Intent si no existe

**Implementación:** 
- Agregar variable de entorno `PERMISSIVE_BOOKING_MODE=true`
- Modificar `createBooking` para saltar validación en modo permisivo
- Modificar `createPaymentIntent` para crear reserva automáticamente si no existe

**Resultado:** El formulario de Stripe siempre aparece y el usuario puede procesar pagos.
