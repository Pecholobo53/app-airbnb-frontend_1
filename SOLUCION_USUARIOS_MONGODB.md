# 🔧 Solución: Usuarios en MongoDB No Son Reconocidos en Login

**Última Actualización:** 2025-12-27

## ❌ Problema Identificado

Los usuarios existen en MongoDB pero el sistema de autenticación no los reconoce al intentar hacer login.

**Caso Específico:** Usuario creado directamente en MongoDB con rol "admin" no puede hacer login.

## 🔍 Posibles Causas

### 1. **Email No Coincide Exactamente** ⚠️ MÁS COMÚN

**Problema:**
- El email en la base de datos puede tener mayúsculas/minúsculas diferentes
- Puede haber espacios antes o después
- El email puede estar en formato diferente

**Solución:**
- El frontend ahora normaliza el email: `email.trim().toLowerCase()`
- Verifica que el email en MongoDB coincida exactamente (sin espacios, en minúsculas)

**Ejemplo:**
```javascript
// ❌ MAL - No coincidirá
MongoDB: "Juan@Example.com"
Frontend: "juan@example.com"

// ✅ BIEN - Coincidirá
MongoDB: "juan@example.com"
Frontend: "juan@example.com"
```

### 2. **Contraseña Hasheada Incorrectamente** ⚠️ CRÍTICO

**Problema:**
- La contraseña en MongoDB está hasheada
- El backend debe comparar el hash, no la contraseña en texto plano
- Si la contraseña se guardó en texto plano, el backend no podrá compararla

**Verificación en MongoDB:**
```javascript
// Contraseña hasheada (correcto):
{
  "password": "f94099780b52f239cd439f63c1cec6ada1f482114791677becccbe674b3205fe"
}

// Contraseña en texto plano (incorrecto):
{
  "password": "Password123"
}
```

**Solución:**
- Si la contraseña está en texto plano en MongoDB, el backend debe hashearla al comparar
- O actualizar la contraseña en MongoDB con el hash correcto

### 3. **Email No Verificado (emailVerified: false)** ⚠️ POSIBLE

**Problema:**
- Todos los usuarios en MongoDB tienen `emailVerified: false`
- El backend podría estar rechazando usuarios no verificados

**Verificación:**
```javascript
// En MongoDB, verifica:
{
  "emailVerified": false  // ← Esto podría causar el rechazo
}
```

**Solución:**
1. **Opción A:** Verificar el email del usuario en MongoDB:
   ```javascript
   // En MongoDB Compass o shell:
   db.users.updateOne(
     { email: "armandito@gmail.com" },
     { $set: { emailVerified: true } }
   )
   ```

2. **Opción B:** Modificar el backend para permitir login sin verificación (solo desarrollo)

### 4. **Usuario No Existe o Email Incorrecto**

**Problema:**
- El email que estás usando no existe en MongoDB
- El email tiene un typo

**Solución:**
1. Verifica en MongoDB Compass que el usuario exista
2. Copia el email exacto de MongoDB
3. Úsalo en el formulario de login

**Emails encontrados en tu MongoDB:**
- `jan@example.com`
- `popo@gmail.com`
- `armandosoyo@gmail.com`
- `miemail@gmail.com`
- `user@facebook.com`
- `usuario1766607247135394@example.com`
- `armandito@gmail.com`

### 5. **Backend No Está Conectado a MongoDB**

**Problema:**
- El backend no está conectado a la misma base de datos
- La conexión a MongoDB falló

**Solución:**
1. Verifica los logs del backend al iniciar
2. Debe mostrar: "✅ Conectado a MongoDB" o similar
3. Verifica la cadena de conexión en el backend

## ✅ Pasos para Diagnosticar

### Paso 1: Verificar Email Exacto en MongoDB

1. Abre MongoDB Compass
2. Ve a la colección `users`
3. Busca el usuario que quieres usar
4. **Copia el email exacto** (incluyendo mayúsculas/minúsculas)
5. Úsalo en el formulario de login

### Paso 2: Verificar Contraseña

**Si la contraseña está hasheada:**
- El backend debe comparar el hash
- No puedes usar la contraseña en texto plano
- Necesitas saber la contraseña original

**Si la contraseña está en texto plano:**
- Puedes usarla directamente
- Pero es inseguro y deberías hashearla

### Paso 3: Verificar emailVerified

1. En MongoDB Compass, busca el usuario
2. Verifica el campo `emailVerified`
3. Si es `false`, actualízalo a `true`:
   ```javascript
   db.users.updateOne(
     { email: "tu-email@example.com" },
     { $set: { emailVerified: true } }
   )
   ```

### Paso 4: Probar Login Directamente con el Backend

Usa curl o Postman para probar directamente:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "armandito@gmail.com",
    "password": "Password123"
  }'
```

**Si esto funciona:** El problema está en el frontend
**Si esto NO funciona:** El problema está en el backend o en los datos de MongoDB

### Paso 5: Verificar Logs del Backend

Cuando intentas hacer login, el backend debe mostrar:
- El email que está buscando
- Si encontró el usuario
- Si la contraseña coincide
- Si el email está verificado

## 🔧 Soluciones Rápidas

### Solución 1: Actualizar emailVerified a true

En MongoDB Compass, ejecuta:

```javascript
// Para un usuario específico:
db.users.updateOne(
  { email: "armandito@gmail.com" },
  { $set: { emailVerified: true } }
)

// Para todos los usuarios:
db.users.updateMany(
  {},
  { $set: { emailVerified: true } }
)
```

### Solución 2: Crear Usuario de Prueba con Contraseña Hasheada

Si el backend tiene un endpoint para crear usuarios, úsalo. Si no, verifica cómo el backend hashea las contraseñas.

### Solución 3: Verificar Conexión a MongoDB

En el backend, verifica:
- La cadena de conexión a MongoDB
- Que esté conectado a la base de datos correcta (`airbnb`)
- Que esté usando la colección correcta (`users`)

## 🐛 Debugging en el Frontend

### Ver Logs en la Consola

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Intenta hacer login
4. Busca estos mensajes:
   - `🔐 [AUTH SERVICE] Iniciando login:`
   - `📧 Email:` (verifica que sea el correcto)
   - `📤 [AUTH SERVICE] Enviando request a:`
   - `📥 [AUTH SERVICE] Response status:`
   - `❌ [AUTH SERVICE] Error en response:`

### Ver la Petición en Network

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network"
3. Intenta hacer login
4. Busca la petición a `/api/auth/login`
5. Verifica:
   - **Request Payload:** El email y password que se están enviando
   - **Response:** El mensaje de error del backend

## 📋 Checklist de Verificación

Antes de reportar el error, verifica:

- [ ] El backend está corriendo en `http://localhost:3000`
- [ ] El backend está conectado a MongoDB
- [ ] El usuario existe en MongoDB con el email exacto
- [ ] El email en MongoDB está en minúsculas (o el backend lo normaliza)
- [ ] La contraseña en MongoDB está hasheada correctamente
- [ ] `emailVerified` es `true` (o el backend permite login sin verificación)
- [ ] El email que usas en el login coincide exactamente con el de MongoDB
- [ ] No hay espacios antes o después del email
- [ ] La contraseña que usas es la correcta (antes de hashear)

## 💡 Emails Disponibles en tu MongoDB

Según las capturas, estos son los emails disponibles:

1. `jan@example.com` - emailVerified: false
2. `popo@gmail.com` - emailVerified: false
3. `armandosoyo@gmail.com` - emailVerified: false
4. `miemail@gmail.com` - emailVerified: false
5. `user@facebook.com` - emailVerified: false
6. `armandito@gmail.com` - emailVerified: false, role: admin

**Para probar login, usa uno de estos emails y su contraseña correspondiente.**

## 🔄 Próximos Pasos

1. **Actualiza `emailVerified` a `true`** para los usuarios que quieres usar
2. **Verifica que el email coincida exactamente** (minúsculas, sin espacios)
3. **Prueba el login** con uno de los emails de la lista
4. **Revisa los logs del backend** para ver qué está pasando
5. **Si persiste el problema**, comparte los logs del backend y del frontend

---

## 🔧 Solución: Error de Conexión al Crear Usuario

### Problema
Al intentar crear un nuevo usuario, aparece el error "Error de conexión".

### Causas Posibles

1. **Backend no está corriendo** ⚠️ MÁS COMÚN
   - El backend debe estar corriendo en `http://localhost:3000`
   - Verifica que el servidor esté activo

2. **Backend no responde correctamente**
   - El endpoint `/api/auth/register` no existe o no funciona
   - El backend está devolviendo un error que no se maneja correctamente

3. **Problema de CORS**
   - El backend no permite peticiones desde el frontend
   - Verifica la configuración de CORS en el backend

### Solución

1. **Verifica que el backend esté corriendo:**
   ```bash
   # En el directorio del backend:
   npm run dev
   # o
   node server.js
   ```

2. **Prueba el endpoint directamente:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Usuario Prueba",
       "email": "prueba@example.com",
       "password": "Password123"
     }'
   ```

3. **Verifica los logs del backend:**
   - Debe mostrar la petición recibida
   - Debe mostrar si hay errores al crear el usuario

4. **Verifica los logs del frontend:**
   - Abre la consola del navegador (F12)
   - Busca: `📝 [AUTH SERVICE] Iniciando registro:`
   - Busca: `❌ [AUTH SERVICE] Error en response:`

### Mensajes de Error Mejorados

Ahora el sistema mostrará mensajes más claros:

- **Network Error:** "No se pudo conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3000"
- **409 Conflict:** "Este email ya está registrado. ¿Ya tienes una cuenta? Intenta iniciar sesión."
- **Validation Error:** Muestra el mensaje específico del error de validación
- **Otros errores:** Muestra el mensaje del backend

---

**Última actualización:** Mejoras en normalización de email, logs de depuración y manejo de errores en `lib/auth/auth-service.ts` y `lib/auth/auth-context.tsx`

