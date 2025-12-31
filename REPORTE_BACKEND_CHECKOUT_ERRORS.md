# 🐛 REPORTE DE ERRORES - CHECKOUT Y RESERVAS

**Fecha:** $(date)  
**Proyecto:** Airbnb Frontend  
**Prioridad:** 🔴 ALTA  
**Estado:** Pendiente de resolución en Backend

---

## 📋 RESUMEN EJECUTIVO

El sistema de checkout presenta problemas críticos que impiden completar reservas:

1. **Error 403 (Forbidden)** al intentar acceder a reservas recién creadas
2. **Error 429 (Too Many Requests)** por rate limiting muy estricto
3. **Falta de sincronización** de permisos después de crear una reserva
4. **Timeouts** en peticiones que causan que la UI se quede colgada

---

## 🔴 PROBLEMA 1: Error 403 al Cargar Reservas Recién Creadas

### Descripción
Cuando un usuario crea una reserva y se redirige al checkout, el frontend intenta cargar la reserva usando `GET /api/bookings/{bookingId}`, pero recibe un **403 Forbidden**.

### Flujo del Error
```
1. Usuario crea reserva → POST /api/bookings → ✅ 201 Created
2. Backend retorna: { booking: { id: "6954d624aaa17236aa24cdc2", ... } }
3. Frontend redirige a: /checkout?id=6954d624aaa17236aa24cdc2
4. Frontend intenta cargar: GET /api/bookings/6954d624aaa17236aa24cdc2
5. Backend responde: ❌ 403 Forbidden
```

### Evidencia
```
GET http://localhost:3000/api/bookings/6954d624aaa17236aa24cdc2
Status: 403 (Forbidden)
Response: { message: "No tienes permisos para realizar esta acción" }
```

### Causa Probable
- **Sincronización de permisos**: El backend no ha sincronizado los permisos del usuario para ver su propia reserva inmediatamente después de crearla
- **Validación de autorización**: El middleware de autorización está verificando permisos antes de que se actualicen en la base de datos
- **Cache de permisos**: Posible cache de permisos que no se actualiza inmediatamente

### Impacto
- ⚠️ **CRÍTICO**: Los usuarios no pueden completar el checkout después de crear una reserva
- Los usuarios ven un error de "No tienes permisos" aunque acaban de crear la reserva
- El frontend tiene que usar workarounds (parámetros de URL) para continuar

### Solución Requerida
1. **Asegurar que el usuario que crea una reserva pueda verla inmediatamente**
   - Verificar que el middleware de autorización permita al `userId` del token ver sus propias reservas
   - Asegurar que la reserva se asocie correctamente con el `userId` del token

2. **Revisar la lógica de autorización en `GET /api/bookings/:id`**
   ```javascript
   // Debe permitir si:
   // - El usuario es el guestId de la reserva
   // - El usuario es el hostId de la propiedad
   // - El usuario es admin
   ```

3. **Eliminar delay de sincronización**
   - Si hay algún proceso asíncrono que actualiza permisos, debe completarse antes de retornar la respuesta de creación

---

## 🔴 PROBLEMA 2: Error 429 (Too Many Requests)

### Descripción
El backend está bloqueando peticiones con **429 Too Many Requests** incluso con uso normal de la aplicación.

### Endpoints Afectados
- `POST /api/bookings/validate` - Validación de disponibilidad
- `POST /api/bookings` - Creación de reservas
- `GET /api/properties/search` - Búsqueda de propiedades
- `GET /api/bookings/:id` - Obtener reserva

### Evidencia
```
POST http://localhost:3000/api/bookings/validate
Status: 429 (Too Many Requests)
Response: { message: "Demasiadas solicitudes. Por favor, espera un momento." }

POST http://localhost:3000/api/bookings
Status: 429 (Too Many Requests)
```

### Causa Probable
- **Rate limiting muy estricto**: El límite de peticiones por minuto/hora es demasiado bajo
- **No hay diferenciación por endpoint**: Todos los endpoints comparten el mismo límite
- **No hay diferenciación por usuario**: El rate limiting es global, no por usuario autenticado

### Impacto
- ⚠️ **ALTO**: Los usuarios no pueden usar la aplicación normalmente
- Se bloquean peticiones legítimas durante el flujo normal de checkout
- El frontend tiene que implementar múltiples reintentos y fallbacks

### Solución Requerida
1. **Ajustar límites de rate limiting**
   - Aumentar límites para usuarios autenticados
   - Diferentes límites para diferentes endpoints (más permisivo para endpoints de lectura)
   - Implementar rate limiting por usuario, no global

2. **Implementar rate limiting inteligente**
   ```javascript
   // Ejemplo de configuración sugerida:
   {
     '/api/bookings/validate': { limit: 20, window: '1m' }, // Más permisivo
     '/api/bookings': { limit: 10, window: '1m' }, // Moderado
     '/api/properties/search': { limit: 30, window: '1m' }, // Muy permisivo
     authenticated: { multiplier: 2 }, // Usuarios autenticados tienen 2x más límite
   }
   ```

3. **Headers de rate limiting informativos**
   - Incluir headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
   - Esto permite al frontend mostrar mensajes más informativos

---

## 🔴 PROBLEMA 3: Endpoints Faltantes o con Errores

### Endpoints con 404 (Not Found)
- `GET /api/dashboard/guest?userId={userId}` - Estadísticas de huésped
- `GET /api/users/stats` - Estadísticas de usuarios

### Endpoints con 400 (Bad Request)
- `GET /api/bookings?guestId={userId}&status=upcoming` - Próximos viajes
- `GET /api/bookings?guestId={userId}&status=past` - Historial de viajes

### Evidencia
```
GET http://localhost:3000/api/dashboard/guest?userId=695238bd142a50e9602d2534
Status: 404 (Not Found)

GET http://localhost:3000/api/bookings?guestId=695238bd142a50e9602d2534&status=upcoming
Status: 400 (Bad Request)
```

### Causa Probable
- Endpoints no implementados
- Parámetros de query incorrectos o no soportados
- Validación de parámetros demasiado estricta

### Solución Requerida
1. **Implementar endpoints faltantes** o documentar alternativas
2. **Revisar validación de parámetros** en endpoints existentes
3. **Documentar parámetros soportados** para cada endpoint

---

## 📊 DATOS TÉCNICOS

### Request Headers Enviados
```http
GET /api/bookings/6954d624aaa17236aa24cdc2 HTTP/1.1
Host: localhost:3000
Authorization: Bearer {token}
Content-Type: application/json
```

### Token de Autenticación
- El token se obtiene de `sessionStorage['airbnb_session'].accessToken`
- El token se envía correctamente en el header `Authorization: Bearer {token}`
- El mismo token funciona para crear la reserva (201), pero falla para leerla (403)

### Estructura de Reserva Esperada
```typescript
interface Booking {
  id: string;
  propertyId: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  guests: number;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  totalPrice?: number;
  currency?: string;
}
```

---

## 🔧 WORKAROUNDS IMPLEMENTADOS EN FRONTEND

Para mantener la funcionalidad mientras se resuelven estos problemas, el frontend implementó:

1. **Fallback con parámetros de URL**: Si falla cargar la reserva, usa parámetros de la URL
2. **Timeout de 5 segundos**: Evita que la UI se quede colgada
3. **Prevención de peticiones duplicadas**: Evita múltiples llamadas simultáneas
4. **Manejo de errores 429**: Muestra mensajes claros al usuario

**Estos workarounds son temporales y no resuelven el problema raíz.**

---

## ✅ ACCIONES REQUERIDAS DEL BACKEND

### Prioridad ALTA (Bloquea funcionalidad)
1. ✅ **Resolver Error 403 en GET /api/bookings/:id**
   - Asegurar que el usuario que crea una reserva pueda verla inmediatamente
   - Verificar lógica de autorización

2. ✅ **Ajustar Rate Limiting**
   - Aumentar límites para usuarios autenticados
   - Diferentes límites por endpoint
   - Rate limiting por usuario, no global

### Prioridad MEDIA (Afecta experiencia)
3. ⚠️ **Implementar/Fix Endpoints Faltantes**
   - `GET /api/dashboard/guest?userId={userId}`
   - `GET /api/users/stats`
   - Revisar `GET /api/bookings?guestId={userId}&status={status}`

### Prioridad BAJA (Mejoras)
4. 📝 **Documentación**
   - Documentar límites de rate limiting
   - Documentar parámetros soportados por endpoint
   - Documentar códigos de error y sus significados

---

## 📝 NOTAS ADICIONALES

### Comportamiento Esperado
1. Usuario crea reserva → `POST /api/bookings` → ✅ 201
2. Usuario carga checkout → `GET /api/bookings/{id}` → ✅ 200 (debe funcionar inmediatamente)
3. Usuario completa checkout → `PATCH /api/bookings/{id}` → ✅ 200

### Comportamiento Actual
1. Usuario crea reserva → `POST /api/bookings` → ✅ 201
2. Usuario carga checkout → `GET /api/bookings/{id}` → ❌ 403 (NO FUNCIONA)
3. Frontend usa workaround con parámetros de URL

### Impacto en Usuarios
- Los usuarios no pueden completar reservas de forma normal
- Experiencia de usuario degradada
- Posible pérdida de conversiones

---

## 🔍 VERIFICACIÓN DE RUTAS API

Se comparó la documentación oficial (`docs/API_Rest_documentation.json`) con las rutas usadas en el frontend:

### ✅ Rutas Correctas (Coinciden con Documentación)
- `POST /api/bookings/validate` ✅
- `POST /api/bookings` ✅
- `GET /api/bookings?status=...&page=...&limit=...` ✅
- `GET /api/bookings/:id` ✅
- `DELETE /api/bookings/:id` ✅

### ❌ Rutas No Documentadas (Causan Errores)
- `GET /api/bookings?guestId={id}&status={status}` ❌ (Causa 400 Bad Request)
- `GET /api/bookings?hostId={id}&status={status}` ❌ (Causa 400 Bad Request)
- `GET /api/dashboard/guest?userId={id}` ❌ (Causa 404 Not Found)
- `GET /api/dashboard/host?userId={id}` ❌ (Causa 404 Not Found)
- `GET /api/dashboard/monthly?userId={id}&mode={mode}` ❌ (Causa 404 Not Found)
- `GET /api/users/stats` ❌ (Causa 404 Not Found)
- `PATCH /api/bookings/:id` ❌ (No documentado, pero se usa)

**Ver reporte completo:** `VERIFICACION_RUTAS_API_FRONTEND_BACKEND.md`

---

## 📞 CONTACTO

Si necesitas más información o logs adicionales, por favor contacta al equipo de frontend.

**Archivos relacionados:**
- `lib/bookings/booking-service.ts` - Servicio de reservas
- `app/checkout/page.tsx` - Página de checkout
- `components/property/PriceCalculator.tsx` - Creación de reservas
- `lib/dashboard/dashboard-service.ts` - Servicio de dashboard

**Documentación de API:**
- `docs/API_Rest_documentation.json` - Documentación oficial del backend

---

**Última actualización:** 31 de Diciembre de 2024

