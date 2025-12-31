# 🔍 Análisis de Errores en Consola

## 📋 Errores Observados

### 1. ❌ Error 401 (Unauthorized) - "Credenciales inválidas"

**Descripción:**
```
POST http://localhost:3000/api/auth/login
401 (Unauthorized)
Error: Credenciales inválidas
```

**Causas Posibles:**
- El backend no está corriendo en `http://localhost:3000`
- Las credenciales son incorrectas (email o contraseña)
- El usuario no existe en la base de datos
- La contraseña tiene mayúsculas/minúsculas incorrectas

**Solución:**
1. Verifica que el backend esté corriendo
2. Usa las credenciales correctas:
   - Admin: `juan@example.com` / `Password123`
   - Usuario demo: `demo@airbnb.com` / `password123`
3. Verifica que no haya espacios antes o después del email/contraseña
4. Revisa los logs del backend para más detalles

**Estado:** ✅ Mejorado con mensajes más claros en `lib/auth/auth-service.ts`

---

### 2. ⚠️ Error 409 (Conflict) - "El email ya está registrado"

**Descripción:**
```
POST http://localhost:3000/api/auth/register
409 (Conflict)
Error: El email ya está registrado
```

**Causa:**
- Intentaste registrar un email que ya existe en la base de datos

**Solución:**
1. Si es tu cuenta, **inicia sesión** en lugar de registrarte
2. Si olvidaste tu contraseña, usa "¿Olvidaste tu contraseña?"
3. Si quieres crear una cuenta nueva, usa un email diferente

**Estado:** ✅ Mejorado con mensaje más claro que sugiere iniciar sesión

---

### 3. 🐛 TypeError: `e.target.className.indexOf is not a function`

**Descripción:**
```
Uncaught TypeError: e.target.className.indexOf is not a function
at HTMLDocument.mouseup (inject.js:304:67)
```

**Causa:**
- **NO es un error de nuestro código**
- Proviene de una **extensión del navegador** (probablemente una extensión de Chrome)
- El archivo `inject.js` es inyectado por una extensión externa

**Solución:**
1. **Ignorar este error** - No afecta la funcionalidad de la aplicación
2. Si quieres eliminarlo:
   - Desactiva las extensiones del navegador una por una
   - Identifica cuál está causando el problema
   - Desactívala o actualízala

**Estado:** ⚠️ No es un error de nuestro código, viene de una extensión del navegador

---

## ✅ Mejoras Implementadas

### 1. Manejo de Errores Mejorado (`lib/auth/auth-service.ts`)

**Error 401:**
- Mensaje más claro: "Credenciales inválidas. Verifica tu email y contraseña."
- Sugerencias en consola para resolver el problema
- Logs detallados para debugging

**Error 409:**
- Mensaje más claro: "Este email ya está registrado. ¿Ya tienes una cuenta? Intenta iniciar sesión."
- Sugerencias en consola sobre qué hacer
- Guía al usuario a usar "Iniciar sesión" o "Recuperar contraseña"

### 2. Logs Mejorados

Ahora los logs incluyen:
- ✅ Estado de la respuesta HTTP
- ✅ Mensaje de error del backend
- ✅ Sugerencias para resolver el problema
- ✅ Información de debugging útil

---

## 🧪 Cómo Verificar que Todo Funciona

### Prueba 1: Login Exitoso

1. Abre la consola (F12)
2. Intenta iniciar sesión con credenciales correctas
3. Deberías ver:
   ```
   ✅ [AUTH SERVICE] Request exitoso
   ✅ [LOGIN] Respuesta exitosa del servidor
   ```

### Prueba 2: Login con Credenciales Incorrectas

1. Intenta iniciar sesión con credenciales incorrectas
2. Deberías ver:
   ```
   ❌ [AUTH SERVICE] Error en response: { status: 401, ... }
   💡 [AUTH SERVICE] Sugerencia para resolver error 401:
      - Verifica que el backend esté corriendo...
   ```
3. Deberías ver un toast con el mensaje de error

### Prueba 3: Registro con Email Existente

1. Intenta registrar un email que ya existe
2. Deberías ver:
   ```
   ❌ [AUTH SERVICE] Error en response: { status: 409, ... }
   💡 [AUTH SERVICE] Email ya registrado:
      - Este email ya existe en la base de datos
      - Si es tu cuenta, intenta iniciar sesión...
   ```
3. Deberías ver un toast sugiriendo iniciar sesión

---

## 📝 Notas Importantes

### Errores que NO son de nuestro código:

1. **TypeError con `indexOf`** - Viene de una extensión del navegador
2. **Errores de CORS** - Si aparecen, verifica la configuración del backend
3. **Errores de red** - Si el backend no está corriendo

### Errores que SÍ son de nuestro código:

1. **401 Unauthorized** - Credenciales incorrectas (pero el manejo está mejorado)
2. **409 Conflict** - Email ya registrado (pero el mensaje está mejorado)
3. **500 Server Error** - Error del servidor (manejado correctamente)

---

## 🔧 Comandos Útiles para Debugging

### Verificar que el backend esté corriendo:

```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

### Limpiar localStorage manualmente:

```javascript
// En la consola del navegador:
localStorage.clear()
```

### Ver la sesión actual:

```javascript
// En la consola del navegador:
const session = localStorage.getItem('airbnb_session')
if (session) {
  console.log(JSON.parse(session))
} else {
  console.log('No hay sesión activa')
}
```

---

**Última actualización:** Mejoras en manejo de errores 401 y 409 en `lib/auth/auth-service.ts`















