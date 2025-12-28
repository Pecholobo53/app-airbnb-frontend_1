# 🔧 Solución al Error 401 al Autenticarse como Administrador

## ❌ Error Observado

```
POST http://localhost:3000/api/auth/login
401 (Unauthorized)
Error: Credenciales inválidas
```

## 🔍 Diagnóstico

El error 401 "Credenciales inválidas" puede tener varias causas:

### 1. **Backend no está corriendo**
El backend debe estar corriendo en `http://localhost:3000` para que el login funcione.

**Solución:**
```bash
# En el directorio del backend, ejecutar:
npm run dev
# o
node server.js
# o el comando que uses para iniciar el backend
```

### 2. **Credenciales incorrectas**
Las credenciales de administrador según la documentación son:

**Credenciales de Admin:**
- **Email:** `juan@example.com`
- **Password:** `Password123` (⚠️ **Importante:** La P es mayúscula)

**Verificaciones:**
- ✅ El email debe ser exactamente: `juan@example.com`
- ✅ La contraseña debe ser exactamente: `Password123` (con P mayúscula)
- ✅ No debe haber espacios antes o después
- ✅ Verifica que no estés usando autocompletado con credenciales viejas

### 3. **Usuario no existe en la base de datos**
El usuario `juan@example.com` debe existir en la base de datos del backend.

**Solución:**
1. Verifica en el backend que el usuario exista
2. Si no existe, créalo con el rol de admin:
   ```json
   {
     "email": "juan@example.com",
     "password": "Password123",
     "name": "Juan Admin",
     "role": "admin"
   }
   ```

### 4. **Problema con la URL del API**
Verifica que la variable de entorno `NEXT_PUBLIC_API_URL` esté configurada correctamente.

**Solución:**
1. Verifica en `.env.local` o `.env`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
2. Si no existe, créalo o verifica que el backend esté en el puerto correcto

## ✅ Pasos para Resolver

### Paso 1: Verificar que el backend esté corriendo

Abre una nueva terminal y verifica:
```bash
# Verificar que el puerto 3000 esté en uso
netstat -ano | findstr :3000
# En Windows
# o
lsof -i :3000
# En Mac/Linux
```

Si no hay nada, inicia el backend.

### Paso 2: Probar el endpoint directamente

Abre Postman, Insomnia o curl y prueba:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

Si esto funciona, el problema está en el frontend. Si no funciona, el problema está en el backend.

### Paso 3: Verificar credenciales en el backend

1. Abre la consola del backend
2. Verifica que el usuario exista en la base de datos
3. Verifica que la contraseña esté hasheada correctamente

### Paso 4: Verificar logs del backend

Revisa los logs del backend cuando intentas hacer login. Deberías ver:
- La petición recibida
- El email que se está buscando
- Si encuentra el usuario
- Si la contraseña coincide

## 🐛 Debugging en el Frontend

### Ver logs en la consola del navegador

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Intenta hacer login
4. Busca estos mensajes:
   - `📤 [AUTH SERVICE] Enviando request a:`
   - `📥 [AUTH SERVICE] Response status:`
   - `❌ [AUTH SERVICE] Error en response:`

### Ver la petición en Network

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network"
3. Intenta hacer login
4. Busca la petición a `/api/auth/login`
5. Verifica:
   - **Status:** Debe ser 401 si hay error
   - **Request Payload:** Verifica que el email y password sean correctos
   - **Response:** Lee el mensaje de error del backend

## 📝 Checklist de Verificación

Antes de reportar el error, verifica:

- [ ] El backend está corriendo en `http://localhost:3000`
- [ ] El email es exactamente `juan@example.com`
- [ ] La contraseña es exactamente `Password123` (con P mayúscula)
- [ ] El usuario existe en la base de datos
- [ ] El usuario tiene el rol `admin` en la base de datos
- [ ] No hay errores en la consola del backend
- [ ] La variable `NEXT_PUBLIC_API_URL` está configurada correctamente
- [ ] No hay problemas de CORS (verifica en Network tab)

## 🔄 Solución Rápida

Si nada funciona, intenta:

1. **Reiniciar el backend:**
   ```bash
   # Detener el backend (Ctrl+C)
   # Iniciar de nuevo
   npm run dev
   ```

2. **Limpiar localStorage:**
   ```javascript
   // En la consola del navegador:
   localStorage.clear()
   // Luego recarga la página
   ```

3. **Verificar que no haya otro servidor en el puerto 3000:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   # Si hay algo, mata el proceso
   ```

## 💡 Mensajes de Error Mejorados

Ahora el sistema mostrará mensajes más claros:

- **401 Unauthorized:** "Credenciales inválidas. Verifica tu email y contraseña."
- **404 Not Found:** "Endpoint no encontrado. Verifica que el backend esté corriendo."
- **500 Server Error:** "Error del servidor. Intenta más tarde."
- **Network Error:** "No se pudo conectar al backend en http://localhost:3000. Verifica que el servidor esté corriendo."

## 📞 Si el Problema Persiste

Si después de seguir todos estos pasos el problema persiste:

1. Comparte los logs de la consola del navegador
2. Comparte los logs del backend
3. Verifica la versión del backend y frontend
4. Verifica que ambos estén actualizados

---

**Última actualización:** Mejoras en manejo de errores en `lib/auth/auth-service.ts`





