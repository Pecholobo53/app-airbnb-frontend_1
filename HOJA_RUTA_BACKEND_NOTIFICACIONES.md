# 🗺️ HOJA DE RUTA - BACKEND: Módulo de Notificaciones

**Fecha:** 31 de Diciembre, 2024  
**Objetivo:** Implementar endpoints de notificaciones para integración completa con frontend  
**Prioridad:** 🔴 ALTA  
**Estado:** ⚪ PENDIENTE DE IMPLEMENTACIÓN

---

## 📋 RESUMEN EJECUTIVO

El frontend está listo para integrarse con los endpoints de notificaciones. Actualmente funciona con datos MOCK, pero necesita persistencia real en el backend para:

- **Persistir notificaciones** en base de datos
- **Sincronizar notificaciones** entre dispositivos
- **Mantener notificaciones** después de cerrar sesión
- **Contador en tiempo real** de notificaciones no leídas

**Endpoints Requeridos:** 5  
**Tiempo Estimado de Implementación:** 5-7 horas  
**Dependencias:** Autenticación JWT, Modelo de Notificaciones en BD

---

## 🎯 ENDPOINTS A IMPLEMENTAR

### 1. GET /api/notifications - Obtener Notificaciones

**Prioridad:** 🔴 CRÍTICA  
**Estado:** ❌ NO IMPLEMENTADO

#### Especificación Técnica

**Ruta:** `GET /api/notifications?page={page}&limit={limit}&read={read}`

**Query Parameters:**
- `page` (opcional, default: 1) - Número de página
- `limit` (opcional, default: 20) - Resultados por página (máximo 100)
- `read` (opcional) - Filtrar por estado: `true` (solo leídas), `false` (solo no leídas), omitir (todas)

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Validaciones:**
- ✅ Token JWT válido (requerido)
- ✅ `page` debe ser >= 1
- ✅ `limit` debe ser >= 1 y <= 100
- ✅ `read` debe ser `true`, `false` o omitirse

**Response Exitoso (200 OK):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "6954e9a62f77822bca5c8202",
        "userId": "695238bd142a50e9602d2534",
        "type": "booking_confirmed",
        "title": "Reserva confirmada",
        "message": "Tu reserva ha sido confirmada para el 15 de enero",
        "read": false,
        "createdAt": "2024-12-31T12:00:00.000Z",
        "link": "/mis-reservas",
        "metadata": {
          "bookingId": "6954d1f7915bb30d289a8ada",
          "propertyId": "6951575b171ec464a14d3516"
        }
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

**Response Error (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido o expirado"
  }
}
```

**Response Error (422 Validation Error):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "page debe ser mayor o igual a 1"
  }
}
```

#### Lógica de Implementación

```javascript
// Pseudocódigo
1. Validar token JWT
2. Extraer userId del token
3. Validar query params (page, limit, read)
4. Calcular skip = (page - 1) * limit
5. Construir query de búsqueda:
   - Filtrar por userId (SIEMPRE - solo notificaciones del usuario)
   - Filtrar por read si se especifica
   - Ordenar por createdAt DESC (más recientes primero)
6. Aplicar paginación (skip, limit)
7. Contar total de notificaciones que cumplen el filtro
8. Retornar notificaciones con metadata de paginación
```

#### Notas Importantes

- **Solo retornar notificaciones del usuario autenticado** (filtrado por userId del token)
- **Ordenar por fecha de creación** (más recientes primero)
- **Incluir metadata de paginación** (total, page, limit, totalPages)
- **Filtrar por `read`** si se especifica en query params

---

### 2. GET /api/notifications/unread-count - Obtener Contador de No Leídas

**Prioridad:** 🔴 CRÍTICA  
**Estado:** ❌ NO IMPLEMENTADO

#### Especificación Técnica

**Ruta:** `GET /api/notifications/unread-count`

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Validaciones:**
- ✅ Token JWT válido (requerido)

**Response Exitoso (200 OK):**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

**Response Error (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido o expirado"
  }
}
```

#### Lógica de Implementación

```javascript
// Pseudocódigo
1. Validar token JWT
2. Extraer userId del token
3. Contar notificaciones en BD:
   - Filtrar por userId
   - Filtrar por read = false
4. Retornar contador
```

#### Notas Importantes

- **Solo contar notificaciones del usuario autenticado** (filtrado por userId del token)
- **Solo contar notificaciones no leídas** (`read: false`)
- **Optimización:** Usar `countDocuments()` en lugar de `find()` para mejor performance

---

### 3. PUT /api/notifications/:id/read - Marcar como Leída

**Prioridad:** 🔴 CRÍTICA  
**Estado:** ❌ NO IMPLEMENTADO

#### Especificación Técnica

**Ruta:** `PUT /api/notifications/:id/read`

**Path Parameters:**
- `id` (requerido) - ID de la notificación a marcar como leída

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Validaciones:**
- ✅ Token JWT válido (requerido)
- ✅ `id` debe estar presente
- ✅ La notificación debe existir
- ✅ La notificación debe pertenecer al usuario autenticado

**Response Exitoso (200 OK):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "id": "6954e9a62f77822bca5c8202",
      "userId": "695238bd142a50e9602d2534",
      "type": "booking_confirmed",
      "title": "Reserva confirmada",
      "message": "Tu reserva ha sido confirmada",
      "read": true,
      "createdAt": "2024-12-31T12:00:00.000Z",
      "link": "/mis-reservas",
      "metadata": {
        "bookingId": "6954d1f7915bb30d289a8ada"
      }
    }
  }
}
```

**Response Error (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Notificación no encontrada"
  }
}
```

**Response Error (403 Forbidden):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permisos para modificar esta notificación"
  }
}
```

**Response Error (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido o expirado"
  }
}
```

#### Lógica de Implementación

```javascript
// Pseudocódigo
1. Validar token JWT
2. Extraer userId del token
3. Validar que id esté presente
4. Buscar notificación en BD:
   - Filtrar por id
   - Filtrar por userId (seguridad - verificar que es del usuario)
5. Si no existe:
   - Retornar 404 Not Found
6. Si existe pero no pertenece al usuario:
   - Retornar 403 Forbidden
7. Si existe y pertenece al usuario:
   - Actualizar read = true
   - Actualizar updatedAt = fecha actual
   - Retornar notificación actualizada
```

#### Notas Importantes

- **Verificar que el usuario sea el dueño** de la notificación antes de actualizar (seguridad)
- **Idempotencia:** Marcar como leída una notificación ya leída debe retornar 200 OK (no error)
- **Actualizar `updatedAt`** cuando se marca como leída

---

### 4. PUT /api/notifications/mark-all-read - Marcar Todas como Leídas

**Prioridad:** 🔴 CRÍTICA  
**Estado:** ❌ NO IMPLEMENTADO

#### Especificación Técnica

**Ruta:** `PUT /api/notifications/mark-all-read`

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Validaciones:**
- ✅ Token JWT válido (requerido)

**Response Exitoso (200 OK):**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

O simplemente:
```json
{
  "success": true
}
```

**Response Error (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido o expirado"
  }
}
```

#### Lógica de Implementación

```javascript
// Pseudocódigo
1. Validar token JWT
2. Extraer userId del token
3. Buscar todas las notificaciones no leídas del usuario:
   - Filtrar por userId
   - Filtrar por read = false
4. Actualizar todas a read = true:
   - Usar updateMany() para mejor performance
   - Actualizar updatedAt = fecha actual
5. Contar cuántas se actualizaron
6. Retornar éxito con count (opcional)
```

#### Notas Importantes

- **Solo actualizar notificaciones del usuario autenticado** (filtrado por userId del token)
- **Usar `updateMany()`** para mejor performance en lugar de múltiples updates
- **Retornar count** es opcional pero útil para el frontend
- **Idempotencia:** Si no hay notificaciones no leídas, retornar 200 OK con count = 0

---

### 5. DELETE /api/notifications/:id - Eliminar Notificación

**Prioridad:** 🟡 MEDIA  
**Estado:** ❌ NO IMPLEMENTADO

#### Especificación Técnica

**Ruta:** `DELETE /api/notifications/:id`

**Path Parameters:**
- `id` (requerido) - ID de la notificación a eliminar

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Validaciones:**
- ✅ Token JWT válido (requerido)
- ✅ `id` debe estar presente
- ✅ La notificación debe existir
- ✅ La notificación debe pertenecer al usuario autenticado

**Response Exitoso (200 OK):**
```json
{
  "success": true
}
```

O Status 204 No Content (sin body).

**Response Error (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Notificación no encontrada"
  }
}
```

**Response Error (403 Forbidden):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permisos para eliminar esta notificación"
  }
}
```

**Response Error (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido o expirado"
  }
}
```

#### Lógica de Implementación

```javascript
// Pseudocódigo
1. Validar token JWT
2. Extraer userId del token
3. Validar que id esté presente
4. Buscar notificación en BD:
   - Filtrar por id
   - Filtrar por userId (seguridad - verificar que es del usuario)
5. Si no existe:
   - Retornar 404 Not Found
6. Si existe pero no pertenece al usuario:
   - Retornar 403 Forbidden
7. Si existe y pertenece al usuario:
   - Eliminar notificación de la BD
   - Retornar 200 OK o 204 No Content
```

#### Notas Importantes

- **Verificar que el usuario sea el dueño** de la notificación antes de eliminar (seguridad)
- **204 No Content es preferible** a 200 OK para DELETE (estándar REST)
- **Idempotencia:** Eliminar una notificación que no existe debe retornar 404, no error

---

## 📊 TABLA DE PRIORIDADES

| Endpoint | Método | Prioridad | Estado | Tiempo Estimado |
|----------|--------|-----------|--------|-----------------|
| Obtener Notificaciones | GET | 🔴 CRÍTICA | ❌ NO IMPLEMENTADO | 1.5-2 horas |
| Contador de No Leídas | GET | 🔴 CRÍTICA | ❌ NO IMPLEMENTADO | 0.5-1 hora |
| Marcar como Leída | PUT | 🔴 CRÍTICA | ❌ NO IMPLEMENTADO | 1-1.5 horas |
| Marcar Todas como Leídas | PUT | 🔴 CRÍTICA | ❌ NO IMPLEMENTADO | 1-1.5 horas |
| Eliminar Notificación | DELETE | 🟡 MEDIA | ❌ NO IMPLEMENTADO | 1-1.5 horas |

**Total:** 5-7 horas

---

## 🔐 AUTENTICACIÓN

### Requisitos Comunes para Todos los Endpoints

1. **Token JWT Requerido:**
   - Todos los endpoints requieren `Authorization: Bearer {token}`
   - El token debe ser válido y no expirado
   - El `userId` se extrae del token (no del body ni query params)

2. **Validación de Token:**
   ```javascript
   // Pseudocódigo
   const token = req.headers.authorization?.replace('Bearer ', '');
   if (!token) {
     return res.status(401).json({
       success: false,
       error: {
         code: 'UNAUTHORIZED',
         message: 'Token requerido'
       }
     });
   }
   
   const decoded = jwt.verify(token, JWT_SECRET);
   const userId = decoded.userId || decoded.id;
   ```

3. **Extracción de userId:**
   - **NO** usar `userId` del body o query params
   - **Siempre** extraer del token JWT
   - Esto previene que un usuario acceda a notificaciones de otro

---

## 🗄️ MODELO DE DATOS

### Esquema MongoDB (Mongoose)

```javascript
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'booking_confirmed',
      'booking_cancelled',
      'booking_reminder',
      'message_received',
      'favorite_price_drop',
      'favorite_available',
      'security_alert',
      'promotion'
    ]
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  link: {
    type: String,
    maxlength: 500
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true, // Crea createdAt y updatedAt automáticamente
  collection: 'notifications'
});

// Índices para búsquedas rápidas
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 }); // Para obtener notificaciones del usuario
notificationSchema.index({ userId: 1, createdAt: -1 }); // Para ordenar por fecha
notificationSchema.index({ userId: 1, read: 1 }); // Para contar no leídas

const Notification = mongoose.model('Notification', notificationSchema);
```

### Validaciones del Modelo

- ✅ `userId` es requerido y debe ser ObjectId válido
- ✅ `type` es requerido y debe ser uno de los valores permitidos
- ✅ `title` es requerido y máximo 200 caracteres
- ✅ `message` es requerido y máximo 500 caracteres
- ✅ `read` tiene valor por defecto `false`
- ✅ `link` es opcional y máximo 500 caracteres
- ✅ `metadata` es opcional y puede contener cualquier estructura JSON

### Tipos de Notificaciones

```typescript
type NotificationType =
  | 'booking_confirmed'      // Reserva confirmada
  | 'booking_cancelled'      // Reserva cancelada
  | 'booking_reminder'       // Recordatorio de reserva próxima
  | 'message_received'      // Mensaje recibido del host/huésped
  | 'favorite_price_drop'   // Precio bajó en favorito
  | 'favorite_available'    // Favorito disponible en fechas buscadas
  | 'security_alert'        // Alerta de seguridad (login desde nuevo dispositivo)
  | 'promotion';             // Promoción u oferta especial
```

---

## 🧪 CASOS DE PRUEBA

### Test 1: GET /api/notifications - Caso Exitoso

**Request:**
```bash
curl -X GET "http://localhost:3000/api/notifications?page=1&limit=20" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `200 OK`
- Body: `{ success: true, data: { notifications: [...], total: X, page: 1, limit: 20 } }`

---

### Test 2: GET /api/notifications - Filtrar por No Leídas

**Request:**
```bash
curl -X GET "http://localhost:3000/api/notifications?page=1&limit=20&read=false" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `200 OK`
- Body: Solo notificaciones con `read: false`

---

### Test 3: GET /api/notifications - Sin Token (401)

**Request:**
```bash
curl -X GET "http://localhost:3000/api/notifications?page=1&limit=20"
```

**Response Esperado:**
- Status: `401 Unauthorized`
- Body: `{ success: false, error: { code: "UNAUTHORIZED", message: "..." } }`

---

### Test 4: GET /api/notifications/unread-count - Caso Exitoso

**Request:**
```bash
curl -X GET "http://localhost:3000/api/notifications/unread-count" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `200 OK`
- Body: `{ success: true, data: { unreadCount: 5 } }`

---

### Test 5: PUT /api/notifications/:id/read - Caso Exitoso

**Request:**
```bash
curl -X PUT "http://localhost:3000/api/notifications/6954e9a62f77822bca5c8202/read" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `200 OK`
- Body: `{ success: true, data: { notification: { ...read: true } } }`

---

### Test 6: PUT /api/notifications/:id/read - No Existe (404)

**Request:**
```bash
curl -X PUT "http://localhost:3000/api/notifications/notificacion-inexistente/read" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `404 Not Found`
- Body: `{ success: false, error: { code: "NOT_FOUND", message: "..." } }`

---

### Test 7: PUT /api/notifications/:id/read - No Es Dueño (403)

**Request:**
```bash
# Intentar marcar como leída una notificación de otro usuario
curl -X PUT "http://localhost:3000/api/notifications/notificacion-de-otro-usuario/read" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `403 Forbidden`
- Body: `{ success: false, error: { code: "FORBIDDEN", message: "..." } }`

---

### Test 8: PUT /api/notifications/mark-all-read - Caso Exitoso

**Request:**
```bash
curl -X PUT "http://localhost:3000/api/notifications/mark-all-read" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `200 OK`
- Body: `{ success: true, data: { count: 5 } }` o `{ success: true }`

---

### Test 9: DELETE /api/notifications/:id - Caso Exitoso

**Request:**
```bash
curl -X DELETE "http://localhost:3000/api/notifications/6954e9a62f77822bca5c8202" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `200 OK` o `204 No Content`
- Body: `{ success: true }` (si es 200) o sin body (si es 204)

---

### Test 10: DELETE /api/notifications/:id - No Existe (404)

**Request:**
```bash
curl -X DELETE "http://localhost:3000/api/notifications/notificacion-inexistente" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `404 Not Found`
- Body: `{ success: false, error: { code: "NOT_FOUND", message: "..." } }`

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Modelo de Datos
- [ ] Crear esquema de Notification en MongoDB
- [ ] Crear índices (userId, read, createdAt)
- [ ] Crear modelo Mongoose
- [ ] Probar inserción y consultas básicas

### Fase 2: GET /api/notifications
- [ ] Crear ruta GET /api/notifications
- [ ] Validar token JWT
- [ ] Validar query params (page, limit, read)
- [ ] Buscar notificaciones por userId
- [ ] Aplicar filtro por read si se especifica
- [ ] Aplicar paginación
- [ ] Ordenar por createdAt DESC
- [ ] Contar total de notificaciones
- [ ] Retornar notificaciones con metadata (200)
- [ ] Manejar errores (401, 422)

### Fase 3: GET /api/notifications/unread-count
- [ ] Crear ruta GET /api/notifications/unread-count
- [ ] Validar token JWT
- [ ] Contar notificaciones no leídas por userId
- [ ] Retornar contador (200)
- [ ] Manejar errores (401)

### Fase 4: PUT /api/notifications/:id/read
- [ ] Crear ruta PUT /api/notifications/:id/read
- [ ] Validar token JWT
- [ ] Validar path param (id)
- [ ] Buscar notificación por id + userId
- [ ] Verificar que el usuario sea el dueño
- [ ] Actualizar read = true
- [ ] Retornar notificación actualizada (200)
- [ ] Manejar errores (401, 403, 404)

### Fase 5: PUT /api/notifications/mark-all-read
- [ ] Crear ruta PUT /api/notifications/mark-all-read
- [ ] Validar token JWT
- [ ] Buscar todas las notificaciones no leídas por userId
- [ ] Actualizar todas a read = true (updateMany)
- [ ] Contar cuántas se actualizaron
- [ ] Retornar éxito con count (200)
- [ ] Manejar errores (401)

### Fase 6: DELETE /api/notifications/:id
- [ ] Crear ruta DELETE /api/notifications/:id
- [ ] Validar token JWT
- [ ] Validar path param (id)
- [ ] Buscar notificación por id + userId
- [ ] Verificar que el usuario sea el dueño
- [ ] Eliminar notificación de BD
- [ ] Retornar éxito (200 o 204)
- [ ] Manejar errores (401, 403, 404)

### Fase 7: Testing
- [ ] Probar todos los casos de éxito
- [ ] Probar todos los casos de error
- [ ] Probar con Postman
- [ ] Probar desde el frontend
- [ ] Verificar logs del backend
- [ ] Verificar que no haya errores en consola

---

## 🔍 VERIFICACIÓN POST-IMPLEMENTACIÓN

### Pasos para Verificar

1. **Verificar que el backend esté corriendo:**
   ```bash
   curl http://localhost:3000/
   ```

2. **Obtener token de autenticación:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "lolo@gmail.com", "password": "Pecholobo33"}'
   ```
   Guardar el token de la respuesta.

3. **Probar GET /api/notifications:**
   ```bash
   curl -X GET "http://localhost:3000/api/notifications?page=1&limit=20" \
     -H "Authorization: Bearer {token}"
   ```
   Debe retornar 200 con la lista de notificaciones.

4. **Probar GET /api/notifications/unread-count:**
   ```bash
   curl -X GET "http://localhost:3000/api/notifications/unread-count" \
     -H "Authorization: Bearer {token}"
   ```
   Debe retornar 200 con el contador de no leídas.

5. **Probar PUT /api/notifications/:id/read:**
   ```bash
   curl -X PUT "http://localhost:3000/api/notifications/{notificationId}/read" \
     -H "Authorization: Bearer {token}"
   ```
   Debe retornar 200 con la notificación marcada como leída.

6. **Probar PUT /api/notifications/mark-all-read:**
   ```bash
   curl -X PUT "http://localhost:3000/api/notifications/mark-all-read" \
     -H "Authorization: Bearer {token}"
   ```
   Debe retornar 200 con el count de notificaciones marcadas.

7. **Probar DELETE /api/notifications/:id:**
   ```bash
   curl -X DELETE "http://localhost:3000/api/notifications/{notificationId}" \
     -H "Authorization: Bearer {token}"
   ```
   Debe retornar 200 o 204.

8. **Probar desde el frontend:**
   - Hacer login en `http://localhost:3001/login`
   - Verificar que el icono de notificaciones muestra el contador
   - Abrir el menú de notificaciones
   - Verificar que se cargan las notificaciones
   - Marcar una notificación como leída
   - Marcar todas como leídas
   - Verificar que no aparezcan errores en consola

---

## 📚 REFERENCIAS

### Documentación Postman
- Archivo: `docs/API_Rest_documentation.json`
- Sección: "Notificaciones" (líneas 2321-2532)
- Endpoints documentados:
  - GET Obtener Notificaciones
  - GET Obtener Contador de No Leídas
  - PUT Marcar como Leída
  - PUT Marcar Todas como Leídas
  - DELETE Eliminar Notificación

### Estructura de Respuesta Estándar

**Éxito:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo"
  }
}
```

---

## ⚠️ NOTAS IMPORTANTES

1. **Seguridad:**
   - ✅ Siempre validar token JWT
   - ✅ Extraer userId del token, nunca del body
   - ✅ Verificar que el usuario sea el dueño antes de modificar/eliminar
   - ✅ No exponer información sensible en errores

2. **Performance:**
   - ✅ Usar índices en MongoDB para búsquedas rápidas
   - ✅ Limitar resultados de paginación (máximo 100 por página)
   - ✅ Usar `countDocuments()` para contar (más eficiente que `find().length`)
   - ✅ Usar `updateMany()` para marcar todas como leídas (más eficiente)

3. **Consistencia:**
   - ✅ Seguir el mismo formato de respuesta que otros endpoints
   - ✅ Usar los mismos códigos de error estándar
   - ✅ Mantener consistencia en nombres de campos

4. **Validaciones:**
   - ✅ Validar todos los inputs
   - ✅ Validar que las notificaciones existan antes de modificar/eliminar
   - ✅ Validar que el usuario sea el dueño

5. **Idempotencia:**
   - ✅ Marcar como leída una notificación ya leída debe retornar 200 OK
   - ✅ Marcar todas como leídas cuando no hay no leídas debe retornar 200 OK con count = 0
   - ✅ Eliminar una notificación que no existe debe retornar 404

---

## 🎯 CRITERIOS DE ACEPTACIÓN

El backend está **COMPLETO** cuando:

- [ ] ✅ GET /api/notifications retorna lista paginada de notificaciones
- [ ] ✅ GET /api/notifications/unread-count retorna contador correcto
- [ ] ✅ PUT /api/notifications/:id/read marca notificación como leída
- [ ] ✅ PUT /api/notifications/mark-all-read marca todas como leídas
- [ ] ✅ DELETE /api/notifications/:id elimina correctamente
- [ ] ✅ Todos los endpoints validan token JWT
- [ ] ✅ Todos los endpoints extraen userId del token
- [ ] ✅ Todos los endpoints verifican que el usuario sea el dueño
- [ ] ✅ No hay errores en logs del backend
- [ ] ✅ El frontend puede cargar notificaciones sin errores
- [ ] ✅ El frontend puede marcar notificaciones como leídas sin errores
- [ ] ✅ El contador de no leídas se actualiza en tiempo real

---

## 📌 IMPORTANTE: ESPECIFICACIONES OBLIGATORIAS

**⚠️ CUALQUIER CORRECCIÓN O MODIFICACIÓN EN EL BACKEND DEBE HACERSE DE ACUERDO CON ESTE REPORTE.**

Este documento contiene todas las especificaciones técnicas necesarias para que el frontend funcione correctamente. Cualquier desviación de estas especificaciones puede causar errores en el frontend.

**Puntos críticos a respetar:**
1. ✅ Estructura de respuesta: `{ success: boolean, data?: T, error?: { code: string, message: string } }`
2. ✅ Códigos de estado HTTP: 200 (éxito), 401 (no autorizado), 403 (prohibido), 404 (no encontrado), 422 (validación)
3. ✅ Autenticación: Token JWT en header `Authorization: Bearer {token}`
4. ✅ Extracción de userId: Siempre del token, nunca del body o query params
5. ✅ Paginación: Query params `page` y `limit` con metadata en response
6. ✅ Filtros: Query param `read` para filtrar por estado

---

**Última actualización:** 31 de Diciembre, 2024  
**Estado:** ⚪ PENDIENTE DE IMPLEMENTACIÓN EN BACKEND

