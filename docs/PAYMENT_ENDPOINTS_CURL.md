# 💳 Pruebas de Endpoints de Pago con cURL

## 📋 Prerequisitos

1. Servidor corriendo en `http://localhost:3000`
2. Usuario registrado y autenticado
3. Token JWT válido
4. Una reserva pendiente creada

---

## 🔄 Flujo Completo de Prueba

### Paso 1: Login y Obtener Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

**Guardar el token**:
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Paso 2: Obtener Propiedades Disponibles

```bash
curl -X GET "http://localhost:3000/api/properties/search?location=Barcelona&page=1&limit=1" \
  -H "Authorization: Bearer $TOKEN"
```

**Guardar el propertyId**:
```bash
export PROPERTY_ID="property-id-from-response"
```

---

### Paso 3: Validar Reserva

```bash
curl -X POST http://localhost:3000/api/bookings/validate \
  -H "Content-Type: application/json" \
  -d "{
    \"propertyId\": \"$PROPERTY_ID\",
    \"checkIn\": \"2025-12-20\",
    \"checkOut\": \"2025-12-25\",
    \"guests\": 2
  }"
```

---

### Paso 4: Crear Reserva Pendiente

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"propertyId\": \"$PROPERTY_ID\",
    \"checkIn\": \"2025-12-20\",
    \"checkOut\": \"2025-12-25\",
    \"guests\": 2,
    \"guestInfo\": {
      \"name\": \"Test User\",
      \"email\": \"test@example.com\"
    },
    \"paymentMethod\": \"pending\"
  }"
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking-123",
      "status": "pending",
      "paymentInfo": {
        "status": "pending"
      }
    }
  }
}
```

**Guardar el bookingId**:
```bash
export BOOKING_ID="booking-123"
```

---

### Paso 5: Crear Payment Intent

```bash
curl -X POST "http://localhost:3000/api/bookings/$BOOKING_ID/payment/create-intent" \
  -H "Authorization: Bearer $TOKEN" \
  -v
```

**Respuesta esperada (200 OK)**:
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_1234567890_secret_abcdefghij",
    "paymentIntentId": "pi_1234567890"
  }
}
```

**Guardar los valores**:
```bash
export PAYMENT_INTENT_ID="pi_1234567890"
export CLIENT_SECRET="pi_1234567890_secret_abcdefghij"
```

---

### Paso 6: Confirmar Pago

⚠️ **Nota**: Este paso requiere que el Payment Intent haya sido procesado exitosamente en Stripe. 
En un entorno real, el frontend procesaría el pago con Stripe.js usando el `clientSecret`.

Para testing, puedes usar el Stripe Dashboard o simular el pago.

```bash
curl -X POST "http://localhost:3000/api/bookings/$BOOKING_ID/payment/confirm" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"paymentIntentId\": \"$PAYMENT_INTENT_ID\"
  }" \
  -v
```

**Respuesta esperada (200 OK)**:
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

---

## 🧪 Casos de Error

### Error 404: Reserva no encontrada

```bash
curl -X POST "http://localhost:3000/api/bookings/invalid-id/payment/create-intent" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Reserva no encontrada"
  }
}
```

---

### Error 403: Sin permiso

```bash
# Usar un token de otro usuario
curl -X POST "http://localhost:3000/api/bookings/$BOOKING_ID/payment/create-intent" \
  -H "Authorization: Bearer OTHER_USER_TOKEN"
```

**Respuesta**:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permiso para pagar esta reserva"
  }
}
```

---

### Error 400: Reserva ya pagada

```bash
# Intentar crear Payment Intent para una reserva ya pagada
curl -X POST "http://localhost:3000/api/bookings/$BOOKING_ID/payment/create-intent" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta**:
```json
{
  "success": false,
  "error": {
    "code": "ALREADY_PAID",
    "message": "Esta reserva ya ha sido pagada"
  }
}
```

---

### Error 400: Payment Intent no corresponde

```bash
# Usar un paymentIntentId que no corresponde a la reserva
curl -X POST "http://localhost:3000/api/bookings/$BOOKING_ID/payment/confirm" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentIntentId": "pi_wrong_id"
  }'
```

**Respuesta**:
```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_ERROR",
    "message": "El Payment Intent no corresponde a esta reserva"
  }
}
```

---

## 📝 Script Completo (Bash)

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

# 1. Login
echo "1. Login..."
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "juan@example.com", "password": "Password123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Error: No se pudo obtener token"
  exit 1
fi

echo "✅ Token obtenido"

# 2. Obtener propiedad
echo "2. Obteniendo propiedad..."
PROPERTY_ID=$(curl -s -X GET "$BASE_URL/api/properties/search?location=Barcelona&page=1&limit=1" \
  -H "Authorization: Bearer $TOKEN" \
  | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$PROPERTY_ID" ]; then
  echo "❌ Error: No se pudo obtener propiedad"
  exit 1
fi

echo "✅ Propiedad encontrada: $PROPERTY_ID"

# 3. Crear reserva
echo "3. Creando reserva..."
BOOKING_RESPONSE=$(curl -s -X POST "$BASE_URL/api/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"propertyId\": \"$PROPERTY_ID\",
    \"checkIn\": \"2025-12-20\",
    \"checkOut\": \"2025-12-25\",
    \"guests\": 2,
    \"paymentMethod\": \"pending\"
  }")

BOOKING_ID=$(echo $BOOKING_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$BOOKING_ID" ]; then
  echo "❌ Error: No se pudo crear reserva"
  echo "Respuesta: $BOOKING_RESPONSE"
  exit 1
fi

echo "✅ Reserva creada: $BOOKING_ID"

# 4. Crear Payment Intent
echo "4. Creando Payment Intent..."
PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/bookings/$BOOKING_ID/payment/create-intent" \
  -H "Authorization: Bearer $TOKEN")

echo "Respuesta Payment Intent:"
echo "$PAYMENT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PAYMENT_RESPONSE"

PAYMENT_INTENT_ID=$(echo $PAYMENT_RESPONSE | grep -o '"paymentIntentId":"[^"]*' | cut -d'"' -f4)

if [ -z "$PAYMENT_INTENT_ID" ]; then
  echo "❌ Error: No se pudo crear Payment Intent"
  exit 1
fi

echo "✅ Payment Intent creado: $PAYMENT_INTENT_ID"

# 5. Confirmar pago (requiere que el pago esté procesado en Stripe)
echo ""
echo "5. Para confirmar el pago, ejecuta:"
echo "curl -X POST \"$BASE_URL/api/bookings/$BOOKING_ID/payment/confirm\" \\"
echo "  -H \"Authorization: Bearer $TOKEN\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"paymentIntentId\": \"$PAYMENT_INTENT_ID\"}'"
```

---

## 🔗 Referencias

- [Documentación de Postman](./PAYMENT_ENDPOINTS_POSTMAN.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)

