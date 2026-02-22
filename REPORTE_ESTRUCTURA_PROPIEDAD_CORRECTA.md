# Reporte: Estructura de Propiedad Correcta

## Fecha: 20 de enero de 2026

## Resumen

Este documento describe la estructura correcta de una propiedad en el sistema Airbnb Clone, basada en las 15 propiedades creadas exitosamente.

---

## Estructura JSON de una Propiedad Correcta

```json
{
  "title": "Nombre descriptivo de la propiedad",
  "description": "Descripcion detallada de al menos 50 caracteres...",
  "location": {
    "city": "Ciudad",
    "country": "Espana",
    "region": "Region/Comunidad",
    "address": "Direccion completa",
    "coordinates": {
      "lat": 40.4168,
      "lng": -3.7038
    }
  },
  "propertyType": "entire_place",
  "roomType": "apartment|villa|house|loft|cabin",
  "pricing": {
    "basePrice": 100,
    "currency": "EUR",
    "cleaningFee": 25,
    "serviceFee": 15
  },
  "capacity": {
    "guests": 4,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 1
  },
  "amenities": ["wifi", "kitchen", "ac", "tv", "washer"],
  "availability": {
    "minNights": 2,
    "maxNights": 30,
    "instantBook": true,
    "checkInTime": "15:00",
    "checkOutTime": "11:00"
  },
  "images": [
    "https://images.unsplash.com/photo-XXXXX?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-YYYYY?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-ZZZZZ?w=1200&h=800&fit=crop"
  ],
  "host": {
    "id": "ID_DEL_USUARIO",
    "name": "Nombre del Host",
    "email": "host@email.com",
    "isSuperhost": true,
    "avatar": "URL_DEL_AVATAR"
  }
}
```

---

## Campos Requeridos

### 1. title (string)
- Nombre descriptivo de la propiedad
- Debe ser unico y claro

### 2. description (string)
- Descripcion detallada
- Minimo 50 caracteres recomendados

### 3. location (object)
- **city**: Ciudad donde esta la propiedad
- **country**: Pais (usar "Espana" sin tilde)
- **region**: Comunidad autonoma o region
- **address**: Direccion completa
- **coordinates**: Objeto con `lat` y `lng`

### 4. propertyType (string)
- Valores permitidos: `"entire_place"`, `"private_room"`, `"shared_room"`

### 5. roomType (string) - **IMPORTANTE**
- Valores permitidos:
  - `"apartment"`
  - `"villa"`
  - `"house"`
  - `"loft"`
  - `"cabin"`
- **NO usar**: `"cottage"` (no esta en el enum del backend)

### 6. pricing (object)
- **basePrice**: Precio base por noche (numero)
- **currency**: Siempre `"EUR"`
- **cleaningFee**: Tarifa de limpieza (opcional)
- **serviceFee**: Tarifa de servicio (opcional)

### 7. capacity (object)
- **guests**: Numero maximo de huespedes
- **bedrooms**: Numero de habitaciones
- **beds**: Numero de camas
- **bathrooms**: Numero de banos

### 8. amenities (array de strings)
- Lista de amenidades disponibles
- Valores comunes: `"wifi"`, `"kitchen"`, `"ac"`, `"tv"`, `"washer"`, `"pool"`, `"parking"`, `"garden"`, `"fireplace"`, `"heating"`

### 9. availability (object)
- **minNights**: Minimo de noches (numero)
- **maxNights**: Maximo de noches (numero)
- **instantBook**: Reserva instantanea (boolean)
- **checkInTime**: Hora de entrada (string "HH:MM")
- **checkOutTime**: Hora de salida (string "HH:MM")

### 10. images (array de strings)
- Array de URLs de imagenes
- Se recomienda 3 imagenes por propiedad
- Usar parametros `?w=1200&h=800&fit=crop` para Unsplash

### 11. host (object) - **OBLIGATORIO**
- **id**: ID del usuario host
- **name**: Nombre del host
- **email**: Email del host
- **isSuperhost**: Boolean
- **avatar**: URL del avatar

---

## Imagenes: Buenas Practicas

### Fuentes Recomendadas
1. **Unsplash** (gratis): `https://images.unsplash.com/photo-XXXXX`
2. **Pexels** (gratis): `https://images.pexels.com/photos/XXXXX`

### Parametros de URL para Unsplash
```
?w=1200&h=800&fit=crop
```
Esto asegura que la imagen tenga el tamano correcto y no se corte mal.

### Ejemplo de Imagen Correcta
```
https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop
```

---

## Configuracion de Precios (PRICING_CONFIG)

Los precios se calculan usando la configuracion centralizada en `lib/constants.ts`:

```typescript
export const PRICING_CONFIG = {
  // Impuestos: 8%
  TAX_RATE: 0.08,
  // Tarifa de servicio: 10% del subtotal
  SERVICE_FEE_RATE: 0.10,
  // Tarifa de limpieza: 10% del subtotal
  CLEANING_FEE_RATE: 0.10,
  // Tarifa minima de limpieza: 20 euros
  MIN_CLEANING_FEE: 20,
  // Moneda por defecto
  DEFAULT_CURRENCY: 'EUR',
  // Simbolo de moneda
  CURRENCY_SYMBOL: '€',
};
```

### Formula de Calculo
1. **subtotal** = basePrice × noches
2. **cleaningFee** = max(subtotal × 10%, 20€)
3. **serviceFee** = subtotal × 10%
4. **taxes** = (subtotal + cleaningFee + serviceFee) × 8%
5. **total** = subtotal + cleaningFee + serviceFee + taxes

---

## Lista de 15 Propiedades Creadas

| # | Titulo | Ciudad | Precio/Noche | Tipo |
|---|--------|--------|--------------|------|
| 1 | Apartamento con Vistas a la Playa de Las Canteras | Las Palmas de Gran Canaria | €105 | apartment |
| 2 | Villa de Lujo con Piscina Privada en Marbella | Marbella | €350 | villa |
| 3 | Loft Industrial en el Barrio Gotico de Barcelona | Barcelona | €180 | loft |
| 4 | Casa Tradicional con Jardin en Madrid | Madrid | €195 | house |
| 5 | Cabana de Montana en los Pirineos | Jaca | €95 | cabin |
| 6 | Apartamento Moderno en Valencia | Valencia | €135 | apartment |
| 7 | Villa Mediterranea con Piscina en Ibiza | Sant Josep de sa Talaia | €450 | villa |
| 8 | Casa Vasca con Encanto en San Sebastian | San Sebastian | €175 | house |
| 9 | Loft Artistico en el Centro de Sevilla | Sevilla | €145 | loft |
| 10 | Apartamento de Diseno en Bilbao | Bilbao | €125 | apartment |
| 11 | Finca Rural con Piscina en Mallorca | Alaro | €275 | villa |
| 12 | Casita de Piedra en Picos de Europa | Cangas de Onis | €85 | house |
| 13 | Apartamento Luminoso en la Malagueta | Malaga | €115 | apartment |
| 14 | Carmen con Vistas a la Alhambra | Granada | €165 | house |
| 15 | Atico con Terraza en Tenerife | Puerto de la Cruz | €155 | apartment |

---

## Errores Comunes y Soluciones

### Error 1: "cottage is not a valid enum value for roomType"
**Solucion**: Usar `"house"` en lugar de `"cottage"`

### Error 2: "Error de validacion: host"
**Solucion**: Incluir siempre el objeto `host` con todos los campos requeridos

### Error 3: Imagenes cortadas o rotas
**Solucion**: Usar parametros `?w=1200&h=800&fit=crop` en URLs de Unsplash

---

## Verificacion de Propiedad

Antes de crear una propiedad, verificar:

- [ ] Todos los campos requeridos estan presentes
- [ ] `roomType` es un valor valido del enum
- [ ] El objeto `host` esta completo
- [ ] Las URLs de imagenes son accesibles
- [ ] Los precios son numeros positivos
- [ ] Las coordenadas son validas

---

## Conclusiones

Las 15 propiedades fueron creadas exitosamente siguiendo esta estructura. El flujo de checkout funciona correctamente mostrando:
- Desglose de precios con PRICING_CONFIG
- Total calculado correctamente
- Integracion con Stripe preparada

**Nota**: El boton de pago de Stripe requiere que el backend responda correctamente a las solicitudes de Payment Intent.
