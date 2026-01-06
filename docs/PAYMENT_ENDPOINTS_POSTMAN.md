# 💳 Documentación de Endpoints de Pago - Postman

## 📋 Endpoints Agregados

Se han agregado dos nuevos endpoints para el procesamiento de pagos con Stripe:

1. **Crear Payment Intent** - `POST /api/bookings/:id/payment/create-intent`
2. **Confirmar Pago** - `POST /api/bookings/:id/payment/confirm`

---

## 🔧 Cómo Agregar a Postman

### Opción 1: Agregar Manualmente

1. Abre la colección **"Airbnb Backend API"** en Postman
2. Ve a la carpeta **"Reservas"**
3. Agrega los siguientes dos requests:

---

### Request 1: Crear Payment Intent

**Nombre**: `Crear Payment Intent`

**Método**: `POST`

**URL**: `{{baseUrl}}/api/bookings/:id/payment/create-intent`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Path Variables**:
- `id`: `{{bookingId}}` (o el ID de la reserva directamente)

**Tests Script** (opcional):
```javascript
// Validar respuesta exitosa
pm.test("Status code is 200", function () {
    pm.expect(pm.response.code).to.equal(200);
});

// Guardar paymentIntentId y clientSecret
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    if (jsonData.data && jsonData.data.paymentIntentId) {
        pm.environment.set("paymentIntentId", jsonData.data.paymentIntentId);
        console.log("✅ Payment Intent ID guardado: " + jsonData.data.paymentIntentId);
    }
    if (jsonData.data && jsonData.data.clientSecret) {
        pm.environment.set("clientSecret", jsonData.data.clientSecret);
        console.log("✅ Client Secret guardado");
    }
    
    pm.test("Response has payment intent data", function () {
        pm.expect(jsonData.data).to.have.property('paymentIntentId');
        pm.expect(jsonData.data).to.have.property('clientSecret');
    });
}
```

**Descripción**:
```
Crea un Payment Intent de Stripe para una reserva pendiente.
Retorna un clientSecret que el frontend usa para procesar el pago con Stripe.js.
```

---

### Request 2: Confirmar Pago

**Nombre**: `Confirmar Pago`

**Método**: `POST`

**URL**: `{{baseUrl}}/api/bookings/:id/payment/confirm`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Path Variables**:
- `id`: `{{bookingId}}` (o el ID de la reserva directamente)

**Body** (raw JSON):
```json
{
  "paymentIntentId": "{{paymentIntentId}}"
}
```

**Tests Script** (opcional):
```javascript
// Validar respuesta exitosa
pm.test("Status code is 200", function () {
    pm.expect(pm.response.code).to.equal(200);
});

// Validar que la reserva fue actualizada
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.test("Response has booking data", function () {
        pm.expect(jsonData.data).to.have.property('booking');
    });
    
    pm.test("Booking status is confirmed", function () {
        pm.expect(jsonData.data.booking.status).to.equal('confirmed');
    });
    
    pm.test("Payment status is paid", function () {
        pm.expect(jsonData.data.booking.paymentInfo.status).to.equal('paid');
    });
}
```

**Descripción**:
```
Confirma un pago después de que Stripe lo procesa.
Actualiza la reserva a estado 'confirmed' y paymentInfo.status a 'paid'.
Requiere que el Payment Intent haya sido procesado exitosamente en Stripe.
```

---

## 🔄 Flujo de Prueba Completo

### Paso 1: Obtener Token
1. Ejecuta **"Login"** en la carpeta **"Autenticación"**
2. El token se guarda automáticamente en `{{token}}`

### Paso 2: Crear Reserva Pendiente
1. Ejecuta **"Crear Reserva"** con `paymentMethod: "pending"`
2. Guarda el `bookingId` de la respuesta en `{{bookingId}}`

### Paso 3: Crear Payment Intent
1. Ejecuta **"Crear Payment Intent"**
2. El `paymentIntentId` y `clientSecret` se guardan automáticamente

### Paso 4: Procesar Pago (Frontend)
⚠️ **Nota**: Este paso requiere procesar el pago con Stripe.js en el frontend. 
En Postman, puedes simular esto usando el Stripe Dashboard o esperar a que el frontend procese el pago.

### Paso 5: Confirmar Pago
1. Ejecuta **"Confirmar Pago"** con el `paymentIntentId` obtenido
2. La reserva se actualiza a estado `confirmed` y pago `paid`

---

## 📝 Variables de Environment

Asegúrate de tener estas variables configuradas en tu environment:

- `baseUrl`: `http://localhost:3000` (o tu URL de producción)
- `token`: Token JWT obtenido del login
- `bookingId`: ID de la reserva pendiente
- `paymentIntentId`: ID del Payment Intent (se guarda automáticamente)
- `clientSecret`: Client Secret de Stripe (se guarda automáticamente)

---

## ⚠️ Notas Importantes

1. **El Payment Intent debe procesarse primero**: Antes de confirmar el pago, el Payment Intent debe estar en estado `succeeded` en Stripe. Esto normalmente se hace desde el frontend con Stripe.js.

2. **Solo el dueño puede pagar**: Solo el usuario que creó la reserva puede crear el Payment Intent y confirmar el pago.

3. **Reservas ya pagadas**: No se puede crear un Payment Intent para una reserva que ya está pagada.

4. **Reservas canceladas**: No se puede pagar una reserva cancelada.

5. **Testing con Stripe Test Mode**: Asegúrate de usar claves de prueba (`sk_test_...`) en desarrollo.

---

## 🧪 Ejemplos de Respuestas

### Crear Payment Intent - Éxito (200)
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_1234567890_secret_abcdefghij",
    "paymentIntentId": "pi_1234567890"
  }
}
```

### Crear Payment Intent - Error (404)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Reserva no encontrada"
  }
}
```

### Confirmar Pago - Éxito (200)
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking-123",
      "status": "confirmed",
      "paymentInfo": {
        "method": "card",
        "status": "paid",
        "transactionId": "pi_1234567890",
        "paidAt": "2025-01-15T10:30:00.000Z"
      }
    }
  },
  "message": "Pago confirmado exitosamente"
}
```

### Confirmar Pago - Error (400)
```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_ERROR",
    "message": "El pago no fue exitoso. Estado: requires_payment_method"
  }
}
```

---

## 🔗 Referencias

- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe.js Documentation](https://stripe.com/docs/stripe-js)
- [API Documentation](./API_DOCUMENTATION.md)

