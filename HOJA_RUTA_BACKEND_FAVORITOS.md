# 🗺️ HOJA DE RUTA - BACKEND: Módulo de Favoritos

**Fecha:** 31 de Diciembre, 2024  
**Objetivo:** Implementar endpoints de favoritos para solucionar error "Ruta no encontrada"  
**Prioridad:** 🔴 ALTA  
**Estado:** ⚪ PENDIENTE DE IMPLEMENTACIÓN

---

## 📋 RESUMEN EJECUTIVO

El frontend está intentando usar los endpoints de favoritos, pero el backend retorna **404 Not Found** con el mensaje "Ruta no encontrada". 

**Endpoints Requeridos:** 4  
**Tiempo Estimado de Implementación:** 4-6 horas  
**Dependencias:** Autenticación JWT, Modelo de Favoritos en BD

---

## 🎯 ENDPOINTS A IMPLEMENTAR

### 1. POST /api/favorites - Agregar a Favoritos

**Prioridad:** 🔴 CRÍTICA  
**Estado:** ❌ NO IMPLEMENTADO

#### Especificación Técnica

**Ruta:** `POST /api/favorites`

**Headers Requeridos:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "propertyId": "string"
}
```

**Validaciones:**
- ✅ Token JWT válido (requerido)
- ✅ `propertyId` debe existir en la base de datos
- ✅ `propertyId` no debe estar vacío
- ✅ El favorito no debe existir ya (evitar duplicados)

**Response Exitoso (201 Created):**
```json
{
  "success": true,
  "data": {
    "favorite": {
      "id": "6954e9a62f77822bca5c8202",
      "userId": "695238bd142a50e9602d2534",
      "propertyId": "6951575b171ec464a14d3516",
      "addedAt": "2024-12-31T12:00:00.000Z"
    }
  }
}
```

**Response Error (409 Conflict - Ya existe):**
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "La propiedad ya está en favoritos"
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

**Response Error (404 Not Found - Propiedad no existe):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "La propiedad especificada no existe"
  }
}
```

**Response Error (422 Validation Error):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "propertyId es requerido"
  }
}
```

#### Lógica de Implementación

```javascript
// Pseudocódigo
1. Validar token JWT
2. Extraer userId del token
3. Validar que propertyId esté presente y no esté vacío
4. Verificar que la propiedad exista en la BD
5. Verificar que no esté ya en favoritos (userId + propertyId)
6. Crear favorito en la BD:
   - id: generar ID único
   - userId: del token
   - propertyId: del body
   - addedAt: fecha actual (ISO)
7. Retornar favorito creado con status 201
```

#### Modelo de Datos (MongoDB)

```javascript
{
  _id: ObjectId,
  id: String, // ID único (puede ser _id convertido a string)
  userId: ObjectId, // Referencia a User
  propertyId: String, // ID de la propiedad
  addedAt: Date, // Fecha de creación
  createdAt: Date, // Timestamp de creación
  updatedAt: Date // Timestamp de actualización
}

// Índices recomendados:
- { userId: 1, propertyId: 1 } // Único (evitar duplicados)
- { userId: 1 } // Para búsquedas por usuario
- { propertyId: 1 } // Para búsquedas por propiedad
```

---

### 2. GET /api/favorites - Obtener Favoritos

**Prioridad:** 🔴 CRÍTICA  
**Estado:** ❌ NO IMPLEMENTADO

#### Especificación Técnica

**Ruta:** `GET /api/favorites?page={page}&limit={limit}`

**Query Parameters:**
- `page` (opcional, default: 1) - Número de página
- `limit` (opcional, default: 20) - Resultados por página

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Validaciones:**
- ✅ Token JWT válido (requerido)
- ✅ `page` debe ser >= 1
- ✅ `limit` debe ser >= 1 y <= 100

**Response Exitoso (200 OK):**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "6954e9a62f77822bca5c8202",
        "userId": "695238bd142a50e9602d2534",
        "propertyId": "6951575b171ec464a14d3516",
        "addedAt": "2024-12-31T12:00:00.000Z"
      }
    ],
    "total": 5,
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

#### Lógica de Implementación

```javascript
// Pseudocódigo
1. Validar token JWT
2. Extraer userId del token
3. Validar query params (page, limit)
4. Calcular skip = (page - 1) * limit
5. Buscar favoritos en BD:
   - Filtrar por userId
   - Ordenar por addedAt DESC (más recientes primero)
   - Aplicar paginación (skip, limit)
6. Contar total de favoritos del usuario
7. Retornar favoritos con metadata de paginación
```

#### Notas Importantes

- **Solo retornar favoritos del usuario autenticado** (filtrado por userId del token)
- **Ordenar por fecha de añadido** (más recientes primero)
- **Incluir metadata de paginación** (total, page, limit, totalPages)

---

### 3. GET /api/favorites/:propertyId - Verificar si es Favorito

**Prioridad:** 🟡 MEDIA  
**Estado:** ❌ NO IMPLEMENTADO

#### Especificación Técnica

**Ruta:** `GET /api/favorites/:propertyId`

**Path Parameters:**
- `propertyId` (requerido) - ID de la propiedad a verificar

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Validaciones:**
- ✅ Token JWT válido (requerido)
- ✅ `propertyId` debe estar presente

**Response Exitoso (200 OK - Si está en favoritos):**
```json
{
  "success": true,
  "data": {
    "favorite": {
      "id": "6954e9a62f77822bca5c8202",
      "userId": "695238bd142a50e9602d2534",
      "propertyId": "6951575b171ec464a14d3516",
      "addedAt": "2024-12-31T12:00:00.000Z"
    }
  }
}
```

**Response Error (404 Not Found - No está en favoritos):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "La propiedad no está en favoritos"
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
3. Validar que propertyId esté presente
4. Buscar favorito en BD:
   - Filtrar por userId + propertyId
5. Si existe:
   - Retornar favorito con status 200
6. Si no existe:
   - Retornar 404 con mensaje "La propiedad no está en favoritos"
```

#### Notas Importantes

- **404 es el comportamiento esperado** cuando la propiedad no está en favoritos
- El frontend maneja 404 como "no está en favoritos" (retorna `false`)
- No es un error crítico, es parte del flujo normal

---

### 4. DELETE /api/favorites/:propertyId - Eliminar de Favoritos

**Prioridad:** 🔴 CRÍTICA  
**Estado:** ❌ NO IMPLEMENTADO

#### Especificación Técnica

**Ruta:** `DELETE /api/favorites/:propertyId`

**Path Parameters:**
- `propertyId` (requerido) - ID de la propiedad a eliminar

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Validaciones:**
- ✅ Token JWT válido (requerido)
- ✅ `propertyId` debe estar presente
- ✅ El favorito debe existir (userId + propertyId)

**Response Exitoso (200 OK o 204 No Content):**
```json
{
  "success": true
}
```

O simplemente:
- Status: `204 No Content` (sin body)

**Response Error (404 Not Found - No existe):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "El favorito no existe"
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

**Response Error (403 Forbidden - No es el dueño):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permisos para eliminar este favorito"
  }
}
```

#### Lógica de Implementación

```javascript
// Pseudocódigo
1. Validar token JWT
2. Extraer userId del token
3. Validar que propertyId esté presente
4. Buscar favorito en BD:
   - Filtrar por userId + propertyId
5. Si existe:
   - Verificar que userId coincida (seguridad)
   - Eliminar favorito de la BD
   - Retornar 200 OK o 204 No Content
6. Si no existe:
   - Retornar 404 con mensaje "El favorito no existe"
```

#### Notas Importantes

- **Verificar que el usuario sea el dueño** del favorito antes de eliminar (seguridad)
- **204 No Content es preferible** a 200 OK para DELETE (estándar REST)
- **Idempotencia:** Eliminar un favorito que no existe debe retornar 404, no error

---

## 📊 TABLA DE PRIORIDADES

| Endpoint | Método | Prioridad | Estado | Tiempo Estimado |
|----------|--------|-----------|--------|-----------------|
| Agregar a Favoritos | POST | 🔴 CRÍTICA | ❌ NO IMPLEMENTADO | 1.5-2 horas |
| Obtener Favoritos | GET | 🔴 CRÍTICA | ❌ NO IMPLEMENTADO | 1-1.5 horas |
| Verificar si es Favorito | GET | 🟡 MEDIA | ❌ NO IMPLEMENTADO | 0.5-1 hora |
| Eliminar de Favoritos | DELETE | 🔴 CRÍTICA | ❌ NO IMPLEMENTADO | 1-1.5 horas |

**Total:** 4-6 horas

---

## 🔐 AUTENTICACIÓN

### Requisitos Comunes para Todos los Endpoints

1. **Token JWT Requerido:**
   - Todos los endpoints requieren `Authorization: Bearer {token}`
   - El token debe ser válido y no expirado
   - El `userId` se extrae del token (no del body)

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
   - Esto previene que un usuario modifique favoritos de otro

---

## 🗄️ MODELO DE DATOS

### Esquema MongoDB (Mongoose)

```javascript
const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  propertyId: {
    type: String,
    required: true,
    index: true
  },
  addedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true, // Crea createdAt y updatedAt automáticamente
  collection: 'favorites'
});

// Índice único para evitar duplicados
favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

// Índice para búsquedas por usuario (ya incluido arriba)
// Índice para búsquedas por propiedad (ya incluido arriba)

const Favorite = mongoose.model('Favorite', favoriteSchema);
```

### Validaciones del Modelo

- ✅ `userId` es requerido y debe ser ObjectId válido
- ✅ `propertyId` es requerido y debe ser string no vacío
- ✅ `addedAt` se crea automáticamente con fecha actual
- ✅ Combinación `userId + propertyId` debe ser única (índice único)

---

## 🧪 CASOS DE PRUEBA

### Test 1: POST /api/favorites - Caso Exitoso

**Request:**
```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"propertyId": "6951575b171ec464a14d3516"}'
```

**Response Esperado:**
- Status: `201 Created`
- Body: `{ success: true, data: { favorite: {...} } }`

---

### Test 2: POST /api/favorites - Ya Existe (409)

**Request:**
```bash
# Primero crear el favorito (Test 1)
# Luego intentar crear el mismo favorito de nuevo
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"propertyId": "6951575b171ec464a14d3516"}'
```

**Response Esperado:**
- Status: `409 Conflict`
- Body: `{ success: false, error: { code: "CONFLICT", message: "..." } }`

---

### Test 3: POST /api/favorites - Sin Token (401)

**Request:**
```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"propertyId": "6951575b171ec464a14d3516"}'
```

**Response Esperado:**
- Status: `401 Unauthorized`
- Body: `{ success: false, error: { code: "UNAUTHORIZED", message: "..." } }`

---

### Test 4: GET /api/favorites - Caso Exitoso

**Request:**
```bash
curl -X GET "http://localhost:3000/api/favorites?page=1&limit=20" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `200 OK`
- Body: `{ success: true, data: { favorites: [...], total: X, page: 1, limit: 20 } }`

---

### Test 5: GET /api/favorites/:propertyId - Existe (200)

**Request:**
```bash
curl -X GET "http://localhost:3000/api/favorites/6951575b171ec464a14d3516" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `200 OK`
- Body: `{ success: true, data: { favorite: {...} } }`

---

### Test 6: GET /api/favorites/:propertyId - No Existe (404)

**Request:**
```bash
curl -X GET "http://localhost:3000/api/favorites/propiedad-inexistente" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `404 Not Found`
- Body: `{ success: false, error: { code: "NOT_FOUND", message: "..." } }`

---

### Test 7: DELETE /api/favorites/:propertyId - Caso Exitoso

**Request:**
```bash
curl -X DELETE "http://localhost:3000/api/favorites/6951575b171ec464a14d3516" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `200 OK` o `204 No Content`
- Body: `{ success: true }` (si es 200) o sin body (si es 204)

---

### Test 8: DELETE /api/favorites/:propertyId - No Existe (404)

**Request:**
```bash
curl -X DELETE "http://localhost:3000/api/favorites/propiedad-inexistente" \
  -H "Authorization: Bearer {token}"
```

**Response Esperado:**
- Status: `404 Not Found`
- Body: `{ success: false, error: { code: "NOT_FOUND", message: "..." } }`

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Modelo de Datos
- [ ] Crear esquema de Favorite en MongoDB
- [ ] Crear índices (userId, propertyId, único compuesto)
- [ ] Crear modelo Mongoose
- [ ] Probar inserción y consultas básicas

### Fase 2: POST /api/favorites
- [ ] Crear ruta POST /api/favorites
- [ ] Validar token JWT
- [ ] Validar body (propertyId)
- [ ] Verificar que propiedad exista
- [ ] Verificar que no esté ya en favoritos
- [ ] Crear favorito en BD
- [ ] Retornar favorito creado (201)
- [ ] Manejar errores (401, 404, 409, 422)

### Fase 3: GET /api/favorites
- [ ] Crear ruta GET /api/favorites
- [ ] Validar token JWT
- [ ] Validar query params (page, limit)
- [ ] Buscar favoritos por userId
- [ ] Aplicar paginación
- [ ] Ordenar por addedAt DESC
- [ ] Contar total de favoritos
- [ ] Retornar favoritos con metadata (200)
- [ ] Manejar errores (401)

### Fase 4: GET /api/favorites/:propertyId
- [ ] Crear ruta GET /api/favorites/:propertyId
- [ ] Validar token JWT
- [ ] Validar path param (propertyId)
- [ ] Buscar favorito por userId + propertyId
- [ ] Si existe: retornar favorito (200)
- [ ] Si no existe: retornar 404
- [ ] Manejar errores (401)

### Fase 5: DELETE /api/favorites/:propertyId
- [ ] Crear ruta DELETE /api/favorites/:propertyId
- [ ] Validar token JWT
- [ ] Validar path param (propertyId)
- [ ] Buscar favorito por userId + propertyId
- [ ] Verificar que el usuario sea el dueño
- [ ] Eliminar favorito de BD
- [ ] Retornar éxito (200 o 204)
- [ ] Manejar errores (401, 403, 404)

### Fase 6: Testing
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

3. **Probar POST /api/favorites:**
   ```bash
   curl -X POST http://localhost:3000/api/favorites \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer {token}" \
     -d '{"propertyId": "6951575b171ec464a14d3516"}'
   ```
   Debe retornar 201 con el favorito creado.

4. **Probar GET /api/favorites:**
   ```bash
   curl -X GET "http://localhost:3000/api/favorites?page=1&limit=20" \
     -H "Authorization: Bearer {token}"
   ```
   Debe retornar 200 con la lista de favoritos.

5. **Probar GET /api/favorites/:propertyId:**
   ```bash
   curl -X GET "http://localhost:3000/api/favorites/6951575b171ec464a14d3516" \
     -H "Authorization: Bearer {token}"
   ```
   Debe retornar 200 con el favorito o 404 si no existe.

6. **Probar DELETE /api/favorites/:propertyId:**
   ```bash
   curl -X DELETE "http://localhost:3000/api/favorites/6951575b171ec464a14d3516" \
     -H "Authorization: Bearer {token}"
   ```
   Debe retornar 200 o 204.

7. **Probar desde el frontend:**
   - Hacer login en `http://localhost:3001/login`
   - Navegar a una propiedad
   - Hacer clic en el botón de favorito
   - Verificar que no aparezca "Ruta no encontrada"
   - Verificar que el favorito se añada correctamente

---

## 📚 REFERENCIAS

### Documentación Postman
- Archivo: `docs/API_Rest_documentation.json`
- Sección: "Favoritos" (líneas 2126-2318)
- Endpoints documentados:
  - POST Agregar a Favoritos
  - GET Obtener Favoritos
  - GET Verificar si es Favorito
  - DEL Eliminar de Favoritos

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
   - ✅ Verificar que el usuario sea el dueño antes de eliminar
   - ✅ No exponer información sensible en errores

2. **Performance:**
   - ✅ Usar índices en MongoDB para búsquedas rápidas
   - ✅ Limitar resultados de paginación (máximo 100 por página)
   - ✅ Usar proyección para retornar solo campos necesarios

3. **Consistencia:**
   - ✅ Seguir el mismo formato de respuesta que otros endpoints
   - ✅ Usar los mismos códigos de error estándar
   - ✅ Mantener consistencia en nombres de campos

4. **Validaciones:**
   - ✅ Validar todos los inputs
   - ✅ Validar que las propiedades existan antes de crear favoritos
   - ✅ Validar que no haya duplicados

---

## 🎯 CRITERIOS DE ACEPTACIÓN

El backend está **COMPLETO** cuando:

- [ ] ✅ POST /api/favorites retorna 201 cuando se crea un favorito
- [ ] ✅ POST /api/favorites retorna 409 cuando ya existe
- [ ] ✅ POST /api/favorites retorna 401 cuando no hay token
- [ ] ✅ GET /api/favorites retorna lista paginada de favoritos
- [ ] ✅ GET /api/favorites/:propertyId retorna 200 si existe, 404 si no
- [ ] ✅ DELETE /api/favorites/:propertyId elimina correctamente
- [ ] ✅ Todos los endpoints validan token JWT
- [ ] ✅ Todos los endpoints extraen userId del token
- [ ] ✅ No hay errores en logs del backend
- [ ] ✅ El frontend puede añadir/eliminar favoritos sin errores
- [ ] ✅ El frontend puede ver lista de favoritos correctamente

---

**Última actualización:** 31 de Diciembre, 2024  
**Estado:** ⚪ PENDIENTE DE IMPLEMENTACIÓN EN BACKEND

