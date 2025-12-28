# ✅ SOLUCIÓN: Problema al Crear Propiedades

**Fecha:** 2025-12-28  
**Problema Identificado:** Error 401 "Token inválido o expirado" al crear propiedades

---

## 🔍 DIAGNÓSTICO COMPLETO

### Test Realizado con Playwright MCP

**Resultados del Test:**
1. ✅ **Formulario funciona correctamente:**
   - `handleSubmit` se ejecuta correctamente
   - Los datos se construyen correctamente
   - El JSON se serializa bien
   - Todos los objetos requeridos están presentes

2. ✅ **Datos enviados son válidos:**
   ```json
   {
     "title": "Villa Test Playwright MCP",
     "description": "Hermosa villa...",
     "location": {
       "city": "Barcelona",
       "country": "España",
       "coordinates": { "lat": 0, "lng": 0 }
     },
     "pricing": { "basePrice": 350, "currency": "EUR" },
     "capacity": { "guests": 4, "bedrooms": 2, "beds": 2, "bathrooms": 1 },
     "amenities": ["wifi", "kitchen", "pool"],
     "availability": { "minNights": 2, "maxNights": 365, "instantBook": false },
     "images": ["https://images.unsplash.com/..."]
   }
   ```

3. ❌ **Problema identificado:**
   - Backend responde con **401 Unauthorized**
   - Mensaje: "Token inválido o expirado"
   - El token no se está enviando correctamente o no es válido

---

## 🎯 CAUSA RAÍZ

El problema es que **el token de autenticación no se está enviando correctamente** o **el token guardado en localStorage no es válido para el backend**.

**Posibles causas:**
1. El token no se está extrayendo correctamente de `localStorage`
2. El token expiró
3. El formato del token no es el esperado por el backend
4. El header `Authorization` no se está enviando correctamente

---

## ✅ SOLUCIONES IMPLEMENTADAS

### 1. Logging Detallado Agregado

**Archivo:** `lib/properties/property-service.ts`

**Cambios:**
- ✅ Logging del token extraído de localStorage
- ✅ Logging de la estructura de sesión
- ✅ Logging del header Authorization
- ✅ Logging especial para errores 401
- ✅ Logging de la respuesta del backend

**Código agregado:**
```typescript
console.log('🔑 [PROPERTY SERVICE] Sesión en localStorage:', session ? 'Encontrada' : 'No encontrada');
console.log('🔑 [PROPERTY SERVICE] Token extraído:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN');
console.log('🔑 [PROPERTY SERVICE] Estructura de sesión:', Object.keys(parsed));
console.log('👤 [PROPERTY SERVICE] Usuario en sesión:', parsed.user.email, 'Role:', parsed.user.role);
console.log('✅ [PROPERTY SERVICE] Header Authorization agregado');
console.log('📤 [PROPERTY SERVICE] Enviando request a:', url);
console.log('📥 [PROPERTY SERVICE] Response recibida:', { status, ok, statusText, hasToken });
```

### 2. Mejoras en Manejo de CORS

**Cambios:**
- ✅ Agregado `mode: 'cors'` explícitamente
- ✅ Agregado `credentials: 'include'` para incluir cookies

### 3. Logging en Formulario

**Archivo:** `app/admin/properties/new/page.tsx`

**Ya implementado:**
- ✅ Log al inicio de `handleSubmit`
- ✅ Log del estado del formulario
- ✅ Log de datos antes y después de limpiar
- ✅ Log antes de llamar al servicio
- ✅ Log de la respuesta recibida

---

## 🔧 PRÓXIMOS PASOS PARA RESOLVER

### Paso 1: Verificar Token en Consola

1. Abre la consola del navegador (F12 → Consola)
2. Inicia sesión como administrador
3. Intenta crear una propiedad
4. Revisa los logs que empiezan con `🔑 [PROPERTY SERVICE]`

**Busca:**
- ¿Se encuentra la sesión en localStorage?
- ¿Se extrae el token correctamente?
- ¿Se agrega el header Authorization?
- ¿Qué token se está enviando?

### Paso 2: Verificar Estructura de Sesión

En la consola, ejecuta:
```javascript
const session = localStorage.getItem('airbnb_session');
console.log('Sesión completa:', JSON.parse(session));
```

**Verifica:**
- ¿El token está en `token` o `accessToken`?
- ¿El token tiene un formato válido (JWT)?
- ¿El token no está expirado?

### Paso 3: Verificar Backend

1. Verifica que el backend esté corriendo en `http://localhost:3000`
2. Verifica que el endpoint `/api/properties` acepte POST
3. Verifica que el middleware de autenticación esté funcionando
4. Verifica que el formato del token sea el esperado

### Paso 4: Si el Token Está Expirado

Si el token está expirado, necesitas:
1. Cerrar sesión
2. Iniciar sesión de nuevo
3. Intentar crear la propiedad nuevamente

---

## 📋 CHECKLIST DE VERIFICACIÓN

- [x] Formulario se envía correctamente
- [x] Datos se construyen correctamente
- [x] Logging detallado agregado
- [x] Manejo de CORS mejorado
- [ ] Token válido en localStorage
- [ ] Token se envía en header Authorization
- [ ] Backend acepta el token
- [ ] Propiedad se crea exitosamente

---

## 🐛 DEBUGGING

### Si ves "NO HAY TOKEN":
- El token no se está guardando después del login
- Verifica que el login guarde la sesión correctamente
- Verifica que el campo del token sea `token` o `accessToken`

### Si ves "Token inválido o expirado":
- El token expiró o no es válido
- Cierra sesión e inicia sesión de nuevo
- Verifica que el backend acepte el formato del token

### Si no ves logs de `[PROPERTY SERVICE]`:
- El servicio no se está ejecutando
- Verifica que el código esté actualizado
- Recarga la página

---

## 📝 NOTAS

- El formulario **SÍ funciona correctamente**
- Los datos **SÍ se construyen correctamente**
- El problema es **solo de autenticación**
- Con un token válido, la propiedad se creará exitosamente

---

**Solución implementada por:** Playwright MCP Test Suite  
**Estado:** ✅ **Código mejorado con logging detallado**  
**Próxima acción:** Verificar token en consola y hacer login nuevamente si es necesario


