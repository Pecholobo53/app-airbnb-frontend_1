# 📋 REPORTE PARA BACKEND - RUTAS API REQUERIDAS
## Guía Completa de Implementación y Checklist

**Fecha:** 31 de Diciembre de 2024  
**Objetivo:** Documentar las rutas API que el frontend necesita para funcionar correctamente sin errores 400/404

---

## ⚠️ IMPORTANTE: GUÍA DE IMPLEMENTACIÓN

**Este reporte es la referencia oficial para todas las correcciones y nuevas implementaciones en el backend.**

Si es necesario hacer correcciones o implementar nuevos endpoints en el backend, **deben realizarse de acuerdo con las especificaciones detalladas en este documento**. Este reporte contiene:

- ✅ Especificaciones técnicas completas de cada endpoint
- ✅ Estructuras de request y response esperadas
- ✅ Headers y autenticación requeridos
- ✅ Prioridades de implementación
- ✅ Ejemplos de código y respuestas
- ✅ Checklist de verificación para cada implementación

**Por favor, consulta este documento antes de implementar o modificar cualquier endpoint relacionado con:**
- Bookings (reservas)
- Dashboard (estadísticas de huésped/anfitrión)
- Filtros por guestId/hostId
- Autorización y permisos

**Cualquier desviación de estas especificaciones puede causar errores en el frontend.**

---

## 📊 RESUMEN EJECUTIVO

El frontend está usando algunos endpoints que **no están documentados** en `API_Rest_documentation.json` o que **no existen** en el backend, causando errores 400 (Bad Request) y 404 (Not Found).

**Estado actual:**
- ✅ **Rutas básicas de bookings:** Funcionan correctamente
- ⚠️ **Rutas con filtros guestId/hostId:** No documentadas (causan 400)
- ❌ **Rutas de dashboard:** No existen (causan 404)
- ❌ **Rutas de estadísticas:** Algunas no existen (causan 404)

**Impacto:**
- Errores 400 en búsquedas de reservas por usuario
- Errores 404 en dashboard de huésped/anfitrión
- Funcionalidades del dashboard no funcionan completamente

---

## 🔧 NOTAS TÉCNICAS GENERALES

### Autenticación
- **Todos los endpoints requieren:** `Authorization: Bearer {token}`
- El token se obtiene de: `POST /api/auth/login` → `data.token`
- El frontend almacena el token en `sessionStorage['airbnb_session'].accessToken` o `sessionStorage['airbnb_session'].token`

### Estructura de Respuesta
El frontend espera respuestas en este formato:
```json
{
  "success": true,
  "data": { ... }
}
```

O en caso de error:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje de error descriptivo"
  }
}
```

### Rate Limiting
**Problema actual:** Los límites de rate limiting son demasiado estrictos, causando errores 429 (Too Many Requests) en uso normal.

**Recomendación:**
- Aumentar los límites para endpoints críticos
- Considerar diferentes límites por endpoint
- Endpoints de dashboard pueden necesitar límites más altos

---

## ✅ ENDPOINTS QUE FUNCIONAN CORRECTAMENTE

Estos endpoints están documentados y funcionan bien. **No requieren cambios.**

### Bookings

1. **POST /api/bookings/validate** ✅
   - Método: `POST`
   - Headers: `Content-Type: application/json`
   - Body: `{ propertyId, checkIn, checkOut, guests }`
   - Estado: ✅ Funciona correctamente

2. **POST /api/bookings** ✅
   - Método: `POST`
   - Headers: `Content-Type: application/json`, `Authorization: Bearer {token}`
   - Body: `{ propertyId, checkIn, checkOut, guests, guestInfo, paymentMethod }`
   - Estado: ✅ Funciona correctamente

3. **GET /api/bookings?status={status}&page={page}&limit={limit}** ✅
   - Método: `GET`
   - Headers: `Authorization: Bearer {token}` (requerido)
   - Query Params: `status` (pending, confirmed, cancelled, completed), `page`, `limit`
   - Estado: ✅ Funciona correctamente

4. **GET /api/bookings/:id** ✅
   - Método: `GET`
   - Headers: `Authorization: Bearer {token}` (requerido)
   - Estado: ✅ Funciona correctamente (pero verificar autorización - ver sección de problemas)

5. **DELETE /api/bookings/:id** ✅
   - Método: `DELETE`
   - Headers: `Authorization: Bearer {token}` (requerido)
   - Estado: ✅ Funciona correctamente

---

## ⚠️ ENDPOINTS NO DOCUMENTADOS (Causan Error 400)

El frontend intenta usar estos endpoints pero no están en la documentación. El backend puede:
1. **Implementarlos** (recomendado para mejor performance)
2. **Documentarlos** si ya existen
3. **Omitirlos** si el frontend ya tiene fallback (pero es menos eficiente)

### 1. GET /api/bookings?guestId={guestId}&status={status}

**Prioridad:** 🔴 ALTA (usado frecuentemente en dashboard)  
**Estado Actual:** ❌ No documentado - Causa error 400

**Uso en Frontend:**
- `GET /api/bookings?guestId={userId}&status=upcoming` - Próximos viajes del huésped
- `GET /api/bookings?guestId={userId}&status=past` - Historial de viajes del huésped

**Especificación Requerida:**
```
GET /api/bookings?guestId={guestId}&status={status}&page={page}&limit={limit}

Headers:
  Authorization: Bearer {token} (requerido)
  Content-Type: application/json

Query Parameters:
  - guestId (string, requerido): ID del huésped
  - status (string, opcional): pending | confirmed | cancelled | completed
  - page (number, opcional): Número de página (default: 1)
  - limit (number, opcional): Límite de resultados (default: 20)

Response:
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "string",
        "propertyId": "string",
        "guestId": "string",
        "hostId": "string",
        "checkIn": "2024-01-19T00:00:00.000Z",
        "checkOut": "2024-01-21T00:00:00.000Z",
        "status": "confirmed",
        "pricing": {
          "total": 150.00
        },
        ...
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5
    }
  }
}
```

**✅ Checklist de Implementación:**
- [ ] El endpoint acepta `guestId` como query parameter
- [ ] El endpoint filtra correctamente por `guestId`
- [ ] El endpoint acepta `status` como query parameter opcional
- [ ] El endpoint soporta paginación (`page`, `limit`)
- [ ] La autenticación está implementada (Bearer token)
- [ ] El response sigue la estructura especificada
- [ ] Se han probado casos con y sin `status`
- [ ] Se ha actualizado la documentación de la API

---

### 2. GET /api/bookings?hostId={hostId}&status={status}

**Prioridad:** 🔴 ALTA (usado frecuentemente en dashboard)  
**Estado Actual:** ❌ No documentado - Causa error 400

**Uso en Frontend:**
- `GET /api/bookings?hostId={userId}&status=pending` - Solicitudes pendientes del anfitrión
- `GET /api/bookings?hostId={userId}` - Todas las reservas del anfitrión

**Especificación Requerida:**
```
GET /api/bookings?hostId={hostId}&status={status}&page={page}&limit={limit}

Headers:
  Authorization: Bearer {token} (requerido)
  Content-Type: application/json

Query Parameters:
  - hostId (string, requerido): ID del anfitrión
  - status (string, opcional): pending | confirmed | cancelled | completed
  - page (number, opcional): Número de página (default: 1)
  - limit (number, opcional): Límite de resultados (default: 20)

Response:
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "string",
        "propertyId": "string",
        "guestId": "string",
        "hostId": "string",
        "checkIn": "2024-01-19T00:00:00.000Z",
        "checkOut": "2024-01-21T00:00:00.000Z",
        "status": "pending",
        "pricing": {
          "total": 150.00
        },
        ...
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10
    }
  }
}
```

**✅ Checklist de Implementación:**
- [ ] El endpoint acepta `hostId` como query parameter
- [ ] El endpoint filtra correctamente por `hostId`
- [ ] El endpoint acepta `status` como query parameter opcional
- [ ] El endpoint soporta paginación (`page`, `limit`)
- [ ] La autenticación está implementada (Bearer token)
- [ ] El response sigue la estructura especificada
- [ ] Se han probado casos con y sin `status`
- [ ] Se ha actualizado la documentación de la API

---

### 3. PATCH /api/bookings/:id

**Prioridad:** 🟡 MEDIA (usado ocasionalmente)  
**Estado Actual:** ❌ No documentado

**Uso en Frontend:**
- Actualizar reservas (útil para actualizar borradores antes de confirmar)

**Especificación Requerida:**
```
PATCH /api/bookings/:id

Headers:
  Authorization: Bearer {token} (requerido)
  Content-Type: application/json

Body:
{
  "checkIn": "2024-01-19T00:00:00.000Z",  // opcional
  "checkOut": "2024-01-21T00:00:00.000Z", // opcional
  "guests": {                              // opcional
    "adults": 2,
    "children": 1,
    "infants": 0
  },
  "guestInfo": {                           // opcional
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "paymentMethod": "string"                // opcional
}

Response:
{
  "success": true,
  "data": {
    "booking": {
      "id": "string",
      ...
    }
  }
}
```

**✅ Checklist de Implementación:**
- [ ] El endpoint acepta PATCH method
- [ ] El endpoint valida que el usuario tiene permisos para actualizar la reserva
- [ ] Todos los campos del body son opcionales
- [ ] El endpoint valida las fechas si se proporcionan
- [ ] La autenticación está implementada (Bearer token)
- [ ] El response sigue la estructura especificada
- [ ] Se han probado actualizaciones parciales
- [ ] Se ha actualizado la documentación de la API

---

## ❌ ENDPOINTS QUE NO EXISTEN (Causan Error 404)

Estos endpoints son llamados por el frontend pero no existen en el backend, causando errores 404.

### 1. GET /api/dashboard/guest?userId={userId}

**Prioridad:** 🔴 ALTA (usado en dashboard principal)  
**Estado Actual:** ❌ No existe - Causa error 404

**Uso en Frontend:**
- Obtener estadísticas del usuario como huésped

**Especificación Requerida:**
```
GET /api/dashboard/guest?userId={userId}

Headers:
  Authorization: Bearer {token} (requerido)
  Content-Type: application/json

Query Parameters:
  - userId (string, requerido): ID del usuario

Response:
{
  "success": true,
  "data": {
    "guestId": "string",
    "currentYear": 2024,
    "upcomingTrips": 2,
    "activeBookings": 1,
    "favoritesCount": 5,
    "completedTrips": 10,
    "totalSpentThisYear": 2500.00,
    "averageTripCost": 250.00,
    "reviewsGiven": 8,
    "averageRatingGiven": 4.5
  }
}
```

**Nota:** El frontend tiene un fallback que calcula estas estadísticas desde las reservas, pero es menos eficiente.

**✅ Checklist de Implementación:**
- [ ] El endpoint está implementado en la ruta `/api/dashboard/guest`
- [ ] El endpoint acepta `userId` como query parameter
- [ ] El endpoint calcula `upcomingTrips` (reservas futuras confirmadas)
- [ ] El endpoint calcula `activeBookings` (reservas en curso)
- [ ] El endpoint calcula `completedTrips` (reservas completadas este año)
- [ ] El endpoint calcula `totalSpentThisYear` (suma de pricing.total)
- [ ] El endpoint calcula `averageTripCost` (promedio de gasto por viaje)
- [ ] El endpoint calcula `reviewsGiven` y `averageRatingGiven`
- [ ] La autenticación está implementada (Bearer token)
- [ ] El response sigue la estructura especificada
- [ ] Se han probado con diferentes usuarios
- [ ] Se ha actualizado la documentación de la API

---

### 2. GET /api/dashboard/host?userId={userId}

**Prioridad:** 🔴 ALTA (usado en dashboard principal)  
**Estado Actual:** ❌ No existe - Causa error 404

**Uso en Frontend:**
- Obtener estadísticas del usuario como anfitrión

**Especificación Requerida:**
```
GET /api/dashboard/host?userId={userId}

Headers:
  Authorization: Bearer {token} (requerido)
  Content-Type: application/json

Query Parameters:
  - userId (string, requerido): ID del usuario

Response:
{
  "success": true,
  "data": {
    "hostId": "string",
    "period": "current_month",
    "totalRevenue": 5000.00,
    "revenueTrend": 15.5,  // % cambio vs periodo anterior
    "activeProperties": 3,
    "totalBookings": 25,
    "pendingRequests": 2,
    "upcomingArrivals": 5,
    "occupancyRate": 75.5,  // 0-100
    "averageRating": 4.8,
    "totalReviews": 20,
    "responseRate": 95.0,   // 0-100
    "responseTime": "1 hora",
    "propertyStats": [
      {
        "propertyId": "string",
        "propertyTitle": "string",
        "propertyImage": "string",
        "revenue": 1500.00,
        "bookings": 8,
        "occupancyRate": 80.0,
        "averageRating": 4.9,
        "totalReviews": 12,
        "nextArrival": {
          "guestName": "string",
          "date": "2024-01-19T00:00:00.000Z"
        }
      }
    ]
  }
}
```

**Nota:** El frontend tiene un fallback que calcula estas estadísticas desde las reservas, pero es menos eficiente.

**✅ Checklist de Implementación:**
- [ ] El endpoint está implementado en la ruta `/api/dashboard/host`
- [ ] El endpoint acepta `userId` como query parameter
- [ ] El endpoint calcula `totalRevenue` (suma de todas las reservas confirmadas)
- [ ] El endpoint calcula `revenueTrend` (% cambio vs periodo anterior)
- [ ] El endpoint calcula `activeProperties` (propiedades únicas con reservas)
- [ ] El endpoint calcula `totalBookings`, `pendingRequests`, `upcomingArrivals`
- [ ] El endpoint calcula `occupancyRate` (porcentaje de ocupación)
- [ ] El endpoint calcula `averageRating` y `totalReviews`
- [ ] El endpoint incluye `propertyStats` con estadísticas por propiedad
- [ ] La autenticación está implementada (Bearer token)
- [ ] El response sigue la estructura especificada
- [ ] Se han probado con diferentes usuarios
- [ ] Se ha actualizado la documentación de la API

---

### 3. GET /api/dashboard/monthly?userId={userId}&mode={mode}

**Prioridad:** 🟡 MEDIA (usado en gráficos del dashboard)  
**Estado Actual:** ❌ No existe - Causa error 404

**Uso en Frontend:**
- Obtener datos mensuales para gráficos (ingresos, reservas, noches por mes)

**Especificación Requerida:**
```
GET /api/dashboard/monthly?userId={userId}&mode={mode}

Headers:
  Authorization: Bearer {token} (requerido)
  Content-Type: application/json

Query Parameters:
  - userId (string, requerido): ID del usuario
  - mode (string, requerido): "guest" | "host"

Response:
{
  "success": true,
  "data": [
    {
      "month": "Enero 2024",
      "revenue": 1500.00,
      "bookings": 5,
      "nights": 12
    },
    {
      "month": "Febrero 2024",
      "revenue": 2000.00,
      "bookings": 7,
      "nights": 15
    },
    ...
  ]
}
```

**Nota:** El frontend tiene un fallback que calcula estos datos desde las reservas, pero es menos eficiente.

**✅ Checklist de Implementación:**
- [ ] El endpoint está implementado en la ruta `/api/dashboard/monthly`
- [ ] El endpoint acepta `userId` y `mode` como query parameters
- [ ] El endpoint valida que `mode` sea "guest" o "host"
- [ ] El endpoint agrupa reservas por mes según el `mode`
- [ ] El endpoint calcula `revenue` por mes (suma de pricing.total)
- [ ] El endpoint calcula `bookings` por mes (contador de reservas)
- [ ] El endpoint calcula `nights` por mes (suma de noches)
- [ ] El formato de `month` es "Mes Año" (ej: "Enero 2024")
- [ ] Los datos están ordenados cronológicamente
- [ ] La autenticación está implementada (Bearer token)
- [ ] El response sigue la estructura especificada
- [ ] Se han probado con diferentes usuarios y modos
- [ ] Se ha actualizado la documentación de la API

---

### 4. GET /api/users/stats

**Prioridad:** 🟢 BAJA (solo usado en panel de admin)  
**Estado Actual:** ❌ No existe - Causa error 404

**Uso en Frontend:**
- Obtener estadísticas generales de usuarios (solo para admin)

**Especificación Requerida:**
```
GET /api/users/stats

Headers:
  Authorization: Bearer {token} (requerido, admin only)
  Content-Type: application/json

Response:
{
  "success": true,
  "data": {
    "total": 150,
    "verified": 120,
    "unverified": 30,
    "admins": 3,
    "regularUsers": 147,
    "newThisMonth": 15
  }
}
```

**Nota:** El frontend tiene un fallback que calcula estas estadísticas desde la lista de usuarios.

**✅ Checklist de Implementación:**
- [ ] El endpoint está implementado en la ruta `/api/users/stats`
- [ ] El endpoint requiere autenticación de admin
- [ ] El endpoint calcula `total` (total de usuarios)
- [ ] El endpoint calcula `verified` y `unverified`
- [ ] El endpoint calcula `admins` y `regularUsers`
- [ ] El endpoint calcula `newThisMonth` (usuarios creados este mes)
- [ ] La autenticación está implementada (Bearer token + verificación de admin)
- [ ] El response sigue la estructura especificada
- [ ] Se han probado permisos (admin vs usuario regular)
- [ ] Se ha actualizado la documentación de la API

---

## 🔴 PROBLEMA CRÍTICO: Autorización en GET /api/bookings/:id

**Prioridad:** 🔴 CRÍTICA (bloquea el flujo de checkout)  
**Estado Actual:** ⚠️ Problema de autorización

**Problema:**
El endpoint `GET /api/bookings/:id` devuelve **403 Forbidden** cuando un usuario intenta ver su propia reserva inmediatamente después de crearla.

**Evidencia:**
```
GET /api/bookings/6954d253915bb30d289a8b45
Status: 403 (Forbidden)
```

**Causa Probable:**
- El middleware de autorización no permite que el usuario que crea la reserva la vea inmediatamente
- Puede haber un problema de sincronización de permisos

**Solución Requerida:**
1. Verificar que el usuario que crea una reserva pueda verla inmediatamente
2. Verificar que el middleware de autorización permite:
   - El `guestId` de la reserva puede verla
   - El `hostId` de la reserva puede verla
   - Los admins pueden ver todas las reservas

**✅ Checklist de Corrección:**
- [ ] El middleware de autorización verifica `guestId` correctamente
- [ ] El middleware de autorización verifica `hostId` correctamente
- [ ] Los admins pueden ver todas las reservas
- [ ] Un usuario puede ver su reserva inmediatamente después de crearla
- [ ] Se han probado casos: usuario crea reserva → usuario ve reserva
- [ ] Se han probado casos: host ve reserva de su propiedad
- [ ] Se han probado casos: admin ve cualquier reserva
- [ ] Se han probado casos: usuario no autorizado no puede ver reserva
- [ ] Se ha actualizado la documentación si hubo cambios

---

## 📊 TABLA RESUMEN DE PRIORIDADES

| Endpoint | Estado | Prioridad | Impacto | Checklist |
|----------|--------|-----------|---------|-----------|
| `GET /api/bookings?guestId={id}&status={status}` | ❌ No documentado | 🔴 ALTA | Dashboard no funciona | Ver sección 1 |
| `GET /api/bookings?hostId={id}&status={status}` | ❌ No documentado | 🔴 ALTA | Dashboard no funciona | Ver sección 2 |
| `GET /api/dashboard/guest?userId={id}` | ❌ No existe | 🔴 ALTA | Dashboard no funciona | Ver sección 3 |
| `GET /api/dashboard/host?userId={id}` | ❌ No existe | 🔴 ALTA | Dashboard no funciona | Ver sección 4 |
| `GET /api/bookings/:id` (403) | ⚠️ Problema auth | 🔴 CRÍTICA | Bloquea checkout | Ver sección crítica |
| `GET /api/dashboard/monthly?userId={id}&mode={mode}` | ❌ No existe | 🟡 MEDIA | Gráficos no funcionan | Ver sección 5 |
| `PATCH /api/bookings/:id` | ❌ No documentado | 🟡 MEDIA | Actualización limitada | Ver sección 6 |
| `GET /api/users/stats` | ❌ No existe | 🟢 BAJA | Solo admin | Ver sección 7 |

---

## 💡 RECOMENDACIONES DE IMPLEMENTACIÓN

### Prioridad 1 (CRÍTICA - Implementar inmediatamente)
1. **Corregir autorización en GET /api/bookings/:id**
   - Permitir que el usuario que crea una reserva pueda verla inmediatamente
   - Verificar middleware de autorización
   - **Usar el checklist de la sección "Problema Crítico"**

### Prioridad 2 (ALTA - Implementar pronto)
2. **Documentar o implementar endpoints con guestId/hostId**
   - `GET /api/bookings?guestId={id}&status={status}`
   - `GET /api/bookings?hostId={id}&status={status}`
   - Estos endpoints mejoran significativamente la performance del dashboard
   - **Usar los checklists de las secciones 1 y 2**

3. **Implementar endpoints de dashboard**
   - `GET /api/dashboard/guest?userId={id}`
   - `GET /api/dashboard/host?userId={id}`
   - Estos endpoints optimizan el cálculo de estadísticas
   - **Usar los checklists de las secciones 3 y 4**

### Prioridad 3 (MEDIA - Implementar cuando sea posible)
4. **Implementar endpoint de datos mensuales**
   - `GET /api/dashboard/monthly?userId={id}&mode={mode}`
   - **Usar el checklist de la sección 5**

5. **Documentar PATCH /api/bookings/:id**
   - Si ya existe, documentarlo
   - Si no existe, considerarlo para futuras mejoras
   - **Usar el checklist de la sección 6**

### Prioridad 4 (BAJA - Opcional)
6. **Implementar GET /api/users/stats**
   - Solo necesario si se quiere optimizar el panel de admin
   - **Usar el checklist de la sección 7**

---

## ✅ CHECKLIST GENERAL DE IMPLEMENTACIÓN

Al implementar o corregir **cualquier endpoint** según este reporte, verifica:

### Antes de Implementar
- [ ] He leído completamente la especificación del endpoint en este documento
- [ ] He revisado el checklist específico del endpoint
- [ ] He verificado que no hay conflictos con implementaciones existentes

### Durante la Implementación
- [ ] El endpoint sigue exactamente la especificación de request (método, headers, query params, body)
- [ ] El endpoint retorna la estructura de response especificada
- [ ] La autenticación está implementada correctamente (Bearer token)
- [ ] Los códigos de error son consistentes con el formato esperado
- [ ] Se han implementado todas las validaciones necesarias

### Después de Implementar
- [ ] Se han probado los casos de éxito
- [ ] Se han probado los casos de error (400, 401, 403, 404, 500)
- [ ] Se han probado casos edge (datos vacíos, valores límite, etc.)
- [ ] La documentación de la API ha sido actualizada
- [ ] Se ha probado la integración con el frontend

### Comunicación
- [ ] Si necesitas modificar alguna especificación por limitaciones técnicas, **has comunicado al equipo de frontend** antes de implementar
- [ ] Has documentado cualquier desviación necesaria
- [ ] Has actualizado este reporte si hay cambios en las especificaciones

---

## 📞 CONTACTO Y REFERENCIAS

Si necesitas más detalles sobre cómo el frontend usa estos endpoints, revisa:
- `lib/dashboard/dashboard-service.ts` - Implementación del dashboard
- `lib/bookings/booking-service.ts` - Implementación de bookings
- `VERIFICACION_RUTAS_API_FRONTEND_BACKEND.md` - Verificación completa de rutas

---

## 📌 RECORDATORIO FINAL

**Este reporte es la fuente de verdad para todas las implementaciones relacionadas con estas rutas API.**

- ✅ **Implementa según las especificaciones de este documento**
- ✅ **Consulta este documento antes de hacer cambios**
- ✅ **Usa los checklists específicos de cada endpoint**
- ✅ **Actualiza este documento si hay cambios en las especificaciones**
- ✅ **Comunica cualquier desviación necesaria al equipo de frontend**

**Cualquier desviación de estas especificaciones puede causar errores en el frontend.**

---

**Última actualización:** 31 de Diciembre de 2024  
**Versión del Frontend:** Next.js 13.5.1 con App Router  
**Estado:** ⚠️ **Este documento debe ser consultado antes de cualquier implementación o corrección**
