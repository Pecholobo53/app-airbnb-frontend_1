# 🔧 Solución: Error CORS en Next.js con Backend Separado

## 🚨 Problema Original

**Síntoma:** Las peticiones desde el frontend (localhost:3001) al backend (localhost:3000) fallaban con **"Error CORS"** en el navegador, aunque:
- El backend tenía CORS configurado correctamente
- Las peticiones OPTIONS (preflight) respondían con 204 OK
- El backend incluía `Access-Control-Allow-Origin: http://localhost:3001` en las respuestas

**Evidencia:**
- Network tab mostraba: `bookings?page=1&limit=1000` → **Error CORS**
- Preflight (OPTIONS) → **204 OK** ✅
- GET request → **Error CORS** ❌

## ✅ Solución Implementada

### 1. Proxy de Desarrollo en Next.js

**Archivo:** `next.config.js`

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:3000/api/:path*',
    },
  ];
},
```

**Cómo funciona:**
- Las peticiones a `/api/*` desde el frontend se redirigen internamente al backend
- El navegador solo ve peticiones al mismo origen (localhost:3001)
- **CERO problemas de CORS** porque no hay cross-origin

### 2. URLs Relativas en Desarrollo

**Cambio en todos los servicios:**

**ANTES:**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

**DESPUÉS:**
```typescript
// En desarrollo usamos URL relativa para pasar por el proxy de Next.js (evita CORS)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
  : ''; // URL vacía = relativa, pasa por el proxy de Next.js
```

**Archivos modificados:**
- `lib/dashboard/dashboard-service.ts`
- `lib/bookings/booking-service.ts`
- `lib/auth/auth-service.ts`
- `lib/properties/property-service.ts`
- `lib/users/user-service.ts`
- `lib/favorites/favorites-service.ts`
- `lib/payments/payment-service.ts`
- `lib/notifications/notifications-service.ts`
- `lib/locations/location-service.ts`
- `lib/constants.ts`
- `lib/utils/admin.ts`

### 3. Remover `credentials: 'include'` Innecesario

**ANTES:**
```typescript
const response = await fetch(url, {
  ...options,
  headers,
  credentials: 'include', // Causaba problemas con CORS
});
```

**DESPUÉS:**
```typescript
const response = await fetch(url, {
  ...options,
  headers,
  mode: 'cors', // Modo CORS explícito
  // Nota: No usamos credentials: 'include' porque usamos Authorization header
});
```

**Razón:** Cuando usamos `Authorization: Bearer <token>`, no necesitamos `credentials: 'include'`. Esto simplifica la configuración CORS.

## 📋 Checklist de Implementación

- [x] Agregar `rewrites` en `next.config.js`
- [x] Cambiar `API_BASE_URL` en todos los servicios para usar URL relativa en desarrollo
- [x] Remover `credentials: 'include'` de los fetch
- [x] Agregar `mode: 'cors'` explícito
- [x] Mejorar logging para debugging
- [x] Mantener `NEXT_PUBLIC_API_URL` para producción

## 🔍 Verificación

**Después de implementar:**

1. **Reiniciar el servidor de Next.js** (obligatorio después de cambiar `next.config.js`)
   ```bash
   npm run dev
   ```

2. **Verificar en la consola del navegador:**
   ```
   🔍 [DASHBOARD SERVICE] API_BASE_URL configurada: (proxy local)
   🌐 [DASHBOARD SERVICE] Haciendo fetch a: /api/bookings?page=1&limit=1000
   ✅ [DASHBOARD SERVICE] Fetch exitoso, status: 200
   ```

3. **Verificar en Network tab:**
   - Las peticiones deben ir a `/api/bookings` (relativa)
   - **NO** deben ir a `http://localhost:3000/api/bookings`
   - **NO** debe aparecer "Error CORS"

## 🎯 Ventajas de Esta Solución

1. **Cero configuración CORS en desarrollo** - El proxy lo maneja todo
2. **Mismo código funciona en dev y producción** - Solo cambia la URL base
3. **No requiere cambios en el backend** - El backend puede mantener su CORS configurado
4. **Más simple de debuggear** - Todo pasa por el mismo servidor en desarrollo

## ⚠️ Notas Importantes

1. **Solo funciona en desarrollo** - En producción necesitas configurar CORS correctamente en el backend
2. **Reiniciar servidor obligatorio** - Después de cambiar `next.config.js` siempre reiniciar
3. **El proxy solo funciona con `npm run dev`** - No funciona en build estático (`output: 'export'`)

## 🚀 Producción

En producción, el código automáticamente usa `NEXT_PUBLIC_API_URL`:
- Configurar `NEXT_PUBLIC_API_URL=https://api.tudominio.com` en variables de entorno
- El backend debe tener CORS configurado para el dominio de producción
- No se usa el proxy en producción

## 📝 Commit

```
fix: Solucionar error CORS usando proxy de desarrollo en Next.js

- Agregar rewrites en next.config.js para proxy /api/* al backend
- Cambiar todos los servicios para usar URL relativa en desarrollo
- Remover credentials: 'include' innecesario (usamos Authorization header)
- Mejorar logging en dashboard-service para debugging
- En producción se mantiene NEXT_PUBLIC_API_URL para URL completa

Esto resuelve el error 'Error CORS' que impedía cargar reservas en Mis Reservas
```

## 🔗 Referencias

- [Next.js Rewrites Documentation](https://nextjs.org/docs/api-reference/next.config.js/rewrites)
- [CORS MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Fetch API Credentials](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#sending_a_request_with_credentials_included)

---

**Fecha de implementación:** 19 de enero de 2026  
**Problema resuelto:** Error CORS que impedía cargar reservas en "Mis Reservas"  
**Tiempo de solución:** Varias horas de debugging → Solución final en ~30 minutos  
**Estado:** ✅ Funcionando correctamente
