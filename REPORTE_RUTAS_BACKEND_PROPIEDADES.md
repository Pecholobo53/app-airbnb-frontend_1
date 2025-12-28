# 📋 REPORTE: Rutas del Módulo de Propiedades - Backend

**Fecha:** 28 de Diciembre, 2025  
**Módulo:** Propiedades (Properties)  
**Base URL:** `http://localhost:3000/api/properties`

---

## ✅ RUTAS IMPLEMENTADAS EN EL FRONTEND

El frontend tiene implementados los siguientes endpoints en `lib/properties/property-service.ts`:

### 1. ✅ **GET /api/properties/search**
- **Estado Frontend:** ✅ Implementado y en uso
- **Estado Backend:** ⚠️ **VERIFICAR** - Funciona parcialmente
- **Uso en Frontend:**
  - `app/admin/properties/page.tsx` - Listado de propiedades en admin
  - `lib/search/search-context.tsx` - Búsqueda principal
  - `components/PromotionsSection.tsx` - Propiedades destacadas
- **Parámetros Query:**
  - `location` (string)
  - `checkIn` (ISO date string)
  - `checkOut` (ISO date string)
  - `adults`, `children`, `infants` (number)
  - `minPrice`, `maxPrice` (number)
  - `propertyTypes` (comma-separated string)
  - `amenities` (comma-separated string)
  - `minRating` (number)
  - `bedrooms` (number)
  - `instantBook` (boolean)
  - `sortBy` (string)
  - `page` (number)
  - `perPage` (number)
- **Respuesta Esperada:**
```typescript
{
  success: boolean;
  data: {
    properties: Property[];
    total: number;
    page: number;
    perPage: number;
  }
}
```

### 2. ✅ **POST /api/properties**
- **Estado Frontend:** ✅ Implementado y en uso
- **Estado Backend:** ⚠️ **EN DESARROLLO** - Tiene errores de validación
- **Uso en Frontend:**
  - `app/admin/properties/new/page.tsx` - Crear nueva propiedad
- **Autenticación:** ✅ Requerida (Bearer token)
- **Body Requerido:**
```json
{
  "title": "string (requerido, min 5 caracteres)",
  "description": "string (requerido, min 50 caracteres)",
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
  "propertyType": "entire_place | private_room | shared_room",
  "roomType": "apartment | house | villa | loft | cabin | hotel | cottage | castle",
  "pricing": {
    "basePrice": "number (requerido, > 0)",
    "currency": "EUR | USD | GBP (requerido)",
    "cleaningFee": "number (opcional)",
    "serviceFee": "number (opcional)"
  },
  "capacity": {
    "guests": "number (requerido, >= 1)",
    "bedrooms": "number (requerido, >= 1)",
    "beds": "number (requerido, >= 1)",
    "bathrooms": "number (requerido, >= 1)"
  },
  "amenities": ["string[] (requerido, puede ser array vacío)"],
  "availability": {
    "minNights": "number (requerido, >= 1)",
    "maxNights": "number (requerido, >= minNights)",
    "instantBook": "boolean (requerido)",
    "checkInTime": "string (opcional, formato HH:mm)",
    "checkOutTime": "string (opcional, formato HH:mm)"
  },
  "images": ["string[] (requerido, min 1 imagen)"],
  "host": {
    "id": "string (requerido)",
    "name": "string (requerido)",
    "email": "string (requerido)",
    "isSuperhost": "boolean (requerido)",
    "avatar": "string (requerido, puede ser vacío)"
  }
}
```
- **Errores Actuales en Backend:**
  - ❌ `body.description` - Requiere mínimo 50 caracteres (validación implementada en frontend)
  - ❌ `body.host.isSuperhost` - Requiere boolean (implementado en frontend)
  - ❌ `body.host.avatar` - Requiere string (implementado en frontend)

### 3. ✅ **GET /api/properties/{propertyId}**
- **Estado Frontend:** ✅ Implementado y en uso
- **Estado Backend:** ✅ **FUNCIONA** - Verificado
- **Uso en Frontend:**
  - `app/propiedad/[id]/page.tsx` - Página de detalle de propiedad
  - `app/admin/properties/[id]/edit/page.tsx` - Formulario de edición
  - `app/checkout/page.tsx` - Página de checkout
- **Autenticación:** ❌ No requerida (público)
- **Respuesta Esperada:**
```typescript
{
  success: boolean;
  data: Property
}
```

### 4. ✅ **PUT /api/properties/{propertyId}**
- **Estado Frontend:** ✅ Implementado y en uso
- **Estado Backend:** ⚠️ **VERIFICAR** - No probado
- **Uso en Frontend:**
  - `app/admin/properties/[id]/edit/page.tsx` - Actualizar propiedad
- **Autenticación:** ✅ Requerida (Bearer token)
- **Body:** Mismo formato que POST, pero todos los campos son opcionales (Partial<CreatePropertyData>)

### 5. ✅ **DELETE /api/properties/{propertyId}**
- **Estado Frontend:** ✅ Implementado
- **Estado Backend:** ⚠️ **NO VERIFICADO** - No se usa en el frontend actualmente
- **Uso en Frontend:** ❌ No implementado en UI (solo existe el método en PropertyService)
- **Autenticación:** ✅ Requerida (Bearer token, admin)
- **Nota:** El frontend tiene el método pero no hay botón/acción en la UI para eliminar propiedades

### 6. ✅ **GET /api/properties/{propertyId}/reviews**
- **Estado Frontend:** ✅ Implementado y en uso
- **Estado Backend:** ⚠️ **VERIFICAR** - No probado
- **Uso en Frontend:**
  - `components/property/ReviewsList.tsx` - Lista de reviews con paginación
- **Autenticación:** ❌ No requerida (público)
- **Parámetros Query:**
  - `page` (number, default: 1)
  - `perPage` (number, default: 10)
- **Respuesta Esperada:**
```typescript
{
  success: boolean;
  data: {
    reviews: Review[];
    total: number;
    page: number;
    perPage: number;
  }
}
```

### 7. ✅ **GET /api/properties/{propertyId}/availability**
- **Estado Frontend:** ✅ Implementado
- **Estado Backend:** ⚠️ **NO VERIFICADO** - No se usa en el frontend actualmente
- **Uso en Frontend:** ❌ No implementado en UI (solo existe el método en PropertyService)
- **Autenticación:** ❌ No requerida (público)
- **Parámetros Query:**
  - `checkIn` (ISO date string, opcional)
  - `checkOut` (ISO date string, opcional)
- **Respuesta Esperada:**
```typescript
{
  success: boolean;
  data: {
    propertyId: string;
    availableDates: string[]; // ISO date strings
    blockedDates: string[]; // ISO date strings
    minNights: number;
    maxNights: number;
    instantBook: boolean;
  }
}
```

### 8. ✅ **POST /api/properties/{propertyId}/calculate-price**
- **Estado Frontend:** ✅ Implementado
- **Estado Backend:** ⚠️ **NO VERIFICADO** - No se usa en el frontend actualmente
- **Uso en Frontend:** ❌ No implementado en UI (solo existe el método en PropertyService)
- **Autenticación:** ❌ No requerida (público)
- **Body:**
```json
{
  "checkIn": "ISO date string (requerido)",
  "checkOut": "ISO date string (requerido)",
  "guests": "number (requerido)"
}
```
- **Respuesta Esperada:**
```typescript
{
  success: boolean;
  data: {
    basePrice: number;
    cleaningFee?: number;
    serviceFee?: number;
    totalPrice: number;
    currency: string;
    nights: number;
    breakdown?: {
      nightly: number;
      cleaning: number;
      service: number;
      total: number;
    };
  }
}
```

### 9. ✅ **GET /api/properties/{propertyId}/similar**
- **Estado Frontend:** ✅ Implementado y en uso
- **Estado Backend:** ⚠️ **VERIFICAR** - No probado
- **Uso en Frontend:**
  - `components/property/SimilarProperties.tsx` - Propiedades similares
- **Autenticación:** ❌ No requerida (público)
- **Parámetros Query:**
  - `limit` (number, default: 6)
- **Respuesta Esperada:**
```typescript
{
  success: boolean;
  data: {
    properties: Property[];
  }
}
```

---

## 📊 RESUMEN DE ESTADO

### ✅ Endpoints Funcionales (Probados y en Uso)
1. ✅ `GET /api/properties/search` - Búsqueda de propiedades
2. ✅ `GET /api/properties/{propertyId}` - Obtener propiedad por ID

### ⚠️ Endpoints con Problemas (Implementados pero con Errores)
1. ⚠️ `POST /api/properties` - Crear propiedad
   - **Errores:** Validación de `description` (min 50), `host.isSuperhost`, `host.avatar`
   - **Solución:** Ya implementada en frontend, verificar backend

### ⚠️ Endpoints No Verificados (Implementados pero No Probados)
1. ⚠️ `PUT /api/properties/{propertyId}` - Actualizar propiedad
2. ⚠️ `GET /api/properties/{propertyId}/reviews` - Obtener reviews
3. ⚠️ `GET /api/properties/{propertyId}/similar` - Propiedades similares

### ❌ Endpoints No Usados (Implementados pero Sin UI)
1. ❌ `DELETE /api/properties/{propertyId}` - Eliminar propiedad
   - **Nota:** El método existe en PropertyService pero no hay botón en la UI
2. ❌ `GET /api/properties/{propertyId}/availability` - Disponibilidad
   - **Nota:** El método existe pero no se usa en ningún componente
3. ❌ `POST /api/properties/{propertyId}/calculate-price` - Calcular precio
   - **Nota:** El método existe pero no se usa en checkout ni en ningún componente

---

## 🔧 ACCIONES REQUERIDAS PARA EL BACKEND

### 🔴 PRIORIDAD ALTA (Bloquea Funcionalidad)

1. **POST /api/properties - Crear Propiedad**
   - ✅ Validar `description` mínimo 50 caracteres
   - ✅ Validar `host.isSuperhost` como boolean (no undefined)
   - ✅ Validar `host.avatar` como string (puede ser vacío, pero no undefined)
   - ✅ Asegurar que todos los campos requeridos estén presentes
   - ✅ Retornar 201 Created con la propiedad creada

### 🟡 PRIORIDAD MEDIA (Funcionalidad Parcial)

2. **PUT /api/properties/{propertyId} - Actualizar Propiedad**
   - ⚠️ Verificar que acepta campos parciales (Partial<CreatePropertyData>)
   - ⚠️ Verificar que valida permisos (solo el dueño puede editar)
   - ⚠️ Retornar 200 OK con la propiedad actualizada

3. **GET /api/properties/{propertyId}/reviews - Obtener Reviews**
   - ⚠️ Implementar paginación (`page`, `perPage`)
   - ⚠️ Retornar estructura: `{ reviews: Review[], total: number, page: number, perPage: number }`
   - ⚠️ Manejar caso cuando no hay reviews (retornar array vacío)

4. **GET /api/properties/{propertyId}/similar - Propiedades Similares**
   - ⚠️ Implementar lógica de similitud (misma ciudad, tipo similar, etc.)
   - ⚠️ Aceptar parámetro `limit` (default: 6)
   - ⚠️ Retornar estructura: `{ properties: Property[] }`

### 🟢 PRIORIDAD BAJA (Funcionalidad Futura)

5. **DELETE /api/properties/{propertyId} - Eliminar Propiedad**
   - ⚠️ Implementar soft delete o hard delete
   - ⚠️ Verificar permisos (solo admin o dueño)
   - ⚠️ Retornar 200 OK o 204 No Content

6. **GET /api/properties/{propertyId}/availability - Disponibilidad**
   - ⚠️ Implementar lógica de fechas disponibles/bloqueadas
   - ⚠️ Considerar reservas existentes
   - ⚠️ Retornar estructura completa de AvailabilityData

7. **POST /api/properties/{propertyId}/calculate-price - Calcular Precio**
   - ⚠️ Implementar cálculo de precio total
   - ⚠️ Considerar `cleaningFee`, `serviceFee`, `basePrice`
   - ⚠️ Calcular número de noches
   - ⚠️ Retornar breakdown detallado

---

## 📝 ESTRUCTURAS DE DATOS ESPERADAS

### Property (Interfaz Completa)
```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    city: string;
    country: string;
    region?: string;
    address?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  propertyType: 'entire_place' | 'private_room' | 'shared_room';
  roomType: 'apartment' | 'house' | 'villa' | 'loft' | 'cabin' | 'hotel' | 'cottage' | 'castle';
  pricing: {
    basePrice: number;
    currency: 'EUR' | 'USD' | 'GBP';
    cleaningFee?: number;
    serviceFee?: number;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  amenities: string[];
  availability: {
    minNights: number;
    maxNights: number;
    instantBook: boolean;
    checkInTime?: string;
    checkOutTime?: string;
  };
  images: string[];
  host: {
    id: string;
    name: string;
    email: string;
    isSuperhost: boolean;
    avatar: string;
  };
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### Review (Interfaz Completa)
```typescript
interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  breakdown?: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    checkIn: number;
    value: number;
  };
}
```

---

## 🎯 CHECKLIST PARA EL BACKEND

### Endpoints Críticos (Deben Funcionar Ahora)
- [ ] `POST /api/properties` - Crear propiedad (con validaciones corregidas)
- [ ] `GET /api/properties/search` - Búsqueda (verificar todos los filtros)
- [ ] `GET /api/properties/{propertyId}` - Obtener por ID

### Endpoints Importantes (Próximos en Usar)
- [ ] `PUT /api/properties/{propertyId}` - Actualizar propiedad
- [ ] `GET /api/properties/{propertyId}/reviews` - Obtener reviews
- [ ] `GET /api/properties/{propertyId}/similar` - Propiedades similares

### Endpoints Futuros (No Urgentes)
- [ ] `DELETE /api/properties/{propertyId}` - Eliminar propiedad
- [ ] `GET /api/properties/{propertyId}/availability` - Disponibilidad
- [ ] `POST /api/properties/{propertyId}/calculate-price` - Calcular precio

---

## 📞 CONTACTO

Si hay dudas sobre la implementación del frontend o sobre las estructuras de datos esperadas, revisar:
- `lib/properties/property-service.ts` - Implementación completa del servicio
- `app/admin/properties/new/page.tsx` - Ejemplo de uso de POST /api/properties
- `types/search.ts` - Definiciones de tipos TypeScript

---

**Última Actualización:** 28 de Diciembre, 2025  
**Versión del Frontend:** Next.js 13.5.1 (App Router)

