# 🔧 MENSAJE PARA EL BACKEND - Crear Propiedad

## ❌ PROBLEMA ACTUAL

El backend está rechazando la creación de propiedades con el error:
```
Invalid input: expected object, received undefined
```

## 📋 ESTRUCTURA ESPERADA POR EL FRONTEND

El frontend envía la siguiente estructura en `POST /api/properties`:

```json
{
  "title": "string (requerido)",
  "description": "string (requerido)",
  "location": {
    "city": "string (requerido)",
    "country": "string (requerido)",
    "coordinates": {
      "lat": "number (requerido)",
      "lng": "number (requerido)"
    },
    "region": "string (opcional)",
    "address": "string (opcional)"
  },
  "propertyType": "entire_place | private_room | shared_room (requerido)",
  "roomType": "apartment | house | villa | loft | cabin | hotel | cottage | castle (requerido)",
  "pricing": {
    "basePrice": "number (requerido)",
    "currency": "EUR | USD | GBP (requerido)",
    "cleaningFee": "number (opcional)",
    "serviceFee": "number (opcional)"
  },
  "capacity": {
    "guests": "number (requerido)",
    "bedrooms": "number (requerido)",
    "beds": "number (requerido)",
    "bathrooms": "number (requerido)"
  },
  "amenities": ["string[] (requerido, puede ser array vacío)"],
  "availability": {
    "minNights": "number (requerido)",
    "maxNights": "number (requerido)",
    "instantBook": "boolean (requerido)",
    "checkInTime": "string (opcional, formato HH:mm)",
    "checkOutTime": "string (opcional, formato HH:mm)"
  },
  "images": ["string[] (requerido, debe tener al menos 1 imagen)"]
}
```

## 📝 EJEMPLO DE PAYLOAD VÁLIDO

```json
{
  "title": "Villa de Lujo con Piscina",
  "description": "Hermosa villa moderna con piscina privada y vistas al mar",
  "location": {
    "city": "Barcelona",
    "country": "España",
    "coordinates": {
      "lat": 41.3851,
      "lng": 2.1734
    },
    "region": "Cataluña",
    "address": "Calle del Mar, 123"
  },
  "propertyType": "entire_place",
  "roomType": "villa",
  "pricing": {
    "basePrice": 350,
    "currency": "EUR",
    "cleaningFee": 30,
    "serviceFee": 25
  },
  "capacity": {
    "guests": 4,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 1
  },
  "amenities": ["wifi", "kitchen", "pool", "ac"],
  "availability": {
    "minNights": 2,
    "maxNights": 365,
    "instantBook": false,
    "checkInTime": "15:00",
    "checkOutTime": "11:00"
  },
  "images": [
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80"
  ]
}
```

## ⚠️ CAMPOS CRÍTICOS QUE DEBEN SER OBJETOS

El backend **DEBE** aceptar estos campos como objetos (nunca como `undefined` o `null`):

1. **`location`** - SIEMPRE debe ser un objeto con:
   - `city` (string)
   - `country` (string)
   - `coordinates` (objeto con `lat` y `lng` como números)

2. **`pricing`** - SIEMPRE debe ser un objeto con:
   - `basePrice` (number)
   - `currency` (string: "EUR", "USD", o "GBP")

3. **`capacity`** - SIEMPRE debe ser un objeto con:
   - `guests` (number)
   - `bedrooms` (number)
   - `beds` (number)
   - `bathrooms` (number)

4. **`availability`** - SIEMPRE debe ser un objeto con:
   - `minNights` (number)
   - `maxNights` (number)
   - `instantBook` (boolean)

## 🔍 VALIDACIÓN QUE DEBE HACER EL BACKEND

El backend debe validar que:

1. ✅ `location` existe y es un objeto
2. ✅ `location.coordinates` existe y es un objeto
3. ✅ `location.coordinates.lat` es un número
4. ✅ `location.coordinates.lng` es un número
5. ✅ `pricing` existe y es un objeto
6. ✅ `pricing.basePrice` es un número mayor a 0
7. ✅ `pricing.currency` es uno de: "EUR", "USD", "GBP"
8. ✅ `capacity` existe y es un objeto
9. ✅ `capacity.guests` es un número mayor a 0
10. ✅ `capacity.bedrooms` es un número mayor a 0
11. ✅ `capacity.beds` es un número mayor a 0
12. ✅ `capacity.bathrooms` es un número mayor a 0
13. ✅ `availability` existe y es un objeto
14. ✅ `availability.minNights` es un número mayor a 0
15. ✅ `availability.maxNights` es un número mayor a `minNights`
16. ✅ `availability.instantBook` es un boolean
17. ✅ `images` es un array con al menos 1 elemento
18. ✅ `amenities` es un array (puede estar vacío)

## 🐛 POSIBLE CAUSA DEL ERROR

El error "expected object, received undefined" sugiere que:

1. El backend está esperando un campo como objeto pero recibe `undefined`
2. Probablemente está validando campos opcionales como si fueran requeridos
3. O está validando campos anidados que no existen en el payload

## ✅ SOLUCIÓN SUGERIDA PARA EL BACKEND

### Opción 1: Validación más flexible

Si el backend usa Zod o similar, debe usar `.optional()` para campos opcionales:

```typescript
// ❌ MAL - Esto falla si el campo no existe
location: z.object({
  region: z.string() // Esto falla si region es undefined
})

// ✅ BIEN - Esto acepta undefined
location: z.object({
  region: z.string().optional() // Acepta string o undefined
})
```

### Opción 2: Valores por defecto

Si el backend requiere ciertos campos, debe usar valores por defecto:

```typescript
availability: z.object({
  minNights: z.number().default(1),
  maxNights: z.number().default(365),
  instantBook: z.boolean().default(false),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional()
})
```

### Opción 3: Validación condicional

Solo validar campos opcionales si existen:

```typescript
// Solo validar cleaningFee si existe
if (data.pricing.cleaningFee !== undefined) {
  // Validar que sea un número positivo
}
```

## 📤 HEADERS REQUERIDOS

El frontend envía:
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (requerido para crear propiedades)

## 🎯 RESUMEN PARA EL BACKEND

**El problema:** El backend está rechazando propiedades válidas porque espera objetos que pueden ser opcionales o no están presentes.

**La solución:** 
1. Asegurar que los campos requeridos (`location`, `pricing`, `capacity`, `availability`) SIEMPRE sean objetos
2. Marcar campos opcionales como `.optional()` en la validación
3. No validar campos opcionales como si fueran requeridos
4. Aceptar `undefined` o `null` para campos opcionales como `region`, `address`, `cleaningFee`, `serviceFee`, `checkInTime`, `checkOutTime`

---

**Copia este mensaje completo y pégalo en el chat del backend para que puedan solucionar el problema.**


