# 🐛 Fallos Actuales en el Sistema de Autenticación

**Fecha de revisión:** 2025-12-10  
**Estado general:** ✅ Funcional con mejoras menores pendientes

---

## ✅ Problemas Corregidos

### 1. Clave de sesión incorrecta ✅ CORREGIDO
- **Problema:** Se usaba `'airbnb_mock_session'` en lugar de `'airbnb_session'`
- **Archivos corregidos:**
  - `lib/auth/auth-context.tsx`
  - `lib/auth/auth-service.ts`
  - `lib/users/user-service.ts`
- **Estado:** ✅ Resuelto

### 2. `expiresAt` undefined del backend ✅ CORREGIDO
- **Problema:** El backend no envía `expiresAt` en la respuesta de login
- **Solución:** Se agregó fallback de 24 horas cuando `expiresAt` no viene del backend
- **Archivos modificados:**
  - `lib/auth/auth-context.tsx` (función `login` y `loadSession`)
- **Estado:** ✅ Resuelto con fallback

### 3. Ciclo de carga/eliminación de sesión ✅ CORREGIDO
- **Problema:** La sesión se cargaba, eliminaba y recreaba constantemente
- **Solución:** El `useEffect` de guardado ahora espera a que termine la carga inicial (`!isLoading`)
- **Archivo modificado:** `lib/auth/auth-context.tsx`
- **Estado:** ✅ Resuelto

---

## ⚠️ Problemas Pendientes

### 1. Redirección incorrecta después del login ✅ CORREGIDO
**Severidad:** MEDIA  
**Prioridad:** MEDIA

**Descripción:**
- Después de un login exitoso, el usuario es redirigido a `/` (página principal) en lugar de `/dashboard`
- El código actual en `LoginForm.tsx` línea 48 tenía: `router.push('/')`
- Según los requisitos del usuario, debería redirigir a `/dashboard`

**Ubicación:**
- `components/auth/LoginForm.tsx:48`
- `components/auth/SocialAuthButtons.tsx:21,30` (también corregido)

**Solución implementada:**
```typescript
// Cambiado de:
router.push('/');

// A:
router.push('/dashboard');
```

**Archivos modificados:**
- `components/auth/LoginForm.tsx` - Redirección después de login con email/password
- `components/auth/SocialAuthButtons.tsx` - Redirección después de login con Google/Facebook

**Impacto:**
- ✅ Experiencia de usuario mejorada
- ✅ Cumple con los requisitos especificados
- ✅ El usuario es redirigido automáticamente al dashboard

**Estado:** ✅ CORREGIDO

---

### 2. Backend no envía `expiresAt` en respuesta de login
**Severidad:** BAJA (ya manejado con fallback)  
**Prioridad:** BAJA

**Descripción:**
- El backend retorna `expiresAt: undefined` en la respuesta de `/api/auth/login`
- El frontend maneja esto con un fallback de 24 horas, pero sería mejor que el backend lo envíe

**Evidencia:**
- Logs muestran: `📅 [LOGIN] expiresAt recibido: undefined`
- El código usa fallback: `⚠️ [SAVE SESSION] expiresAt inválido, usando fecha por defecto (24h desde ahora)`

**Solución propuesta:**
- Solicitar al equipo de backend que incluya `expiresAt` en la respuesta de login
- O calcular `expiresAt` en el frontend basado en el tiempo de expiración del token JWT

**Impacto:**
- Funcionalidad no afectada (hay fallback)
- Menor precisión en el tiempo de expiración de sesión
- Los usuarios podrían tener sesiones que expiran antes o después de lo esperado

**Estado:** ⚠️ Funcional con fallback, mejorable

---

### 3. Notificaciones usando mock service
**Severidad:** BAJA (esperado)  
**Prioridad:** BAJA

**Descripción:**
- El módulo de notificaciones aún usa `MockNotificationsService`
- Los logs muestran errores: `❌ [NOTIFICATIONS] Usuario no encontrado`

**Evidencia:**
- `hooks/useNotifications.ts` usa `MockNotificationsService`
- Logs: `⚠️ [NOTIFICATIONS] Obteniendo notificaciones para usuario: 69373fded72c75eb71475fa5`
- Error: `❌ [NOTIFICATIONS] Usuario no encontrado: 69373fded72c75eb71475fa5`

**Solución propuesta:**
- Integrar el módulo de notificaciones con la API real (según plan de integración módulo por módulo)
- Crear `lib/notifications/notifications-service.ts` similar a `auth-service.ts`

**Impacto:**
- No afecta el login o autenticación
- Las notificaciones no funcionan correctamente
- Es esperado según el plan de integración gradual

**Estado:** ⚠️ Esperado - Módulo pendiente de integración

---

### 4. Documentación/scripts de prueba con clave antigua
**Severidad:** MUY BAJA (no afecta producción)  
**Prioridad:** MUY BAJA

**Descripción:**
- Los archivos de documentación y scripts de prueba aún usan `'airbnb_mock_session'`
- Estos archivos no afectan el código de producción

**Archivos afectados:**
- `GUIA_PRUEBA_ENDPOINTS.md`
- `SCRIPT_PRUEBA_PERFIL.js`
- `PROJECT_INDEX.md`
- `reporte-auth.md`

**Solución propuesta:**
- Actualizar estos archivos para usar `'airbnb_session'` para consistencia
- O dejarlos como están ya que son solo para referencia

**Impacto:**
- Ninguno en producción
- Confusión potencial al seguir las guías de prueba
- Inconsistencia en la documentación

**Estado:** ⚠️ Opcional - Solo afecta documentación

---

## 📊 Resumen de Estado

| Problema | Severidad | Prioridad | Estado |
|----------|-----------|-----------|--------|
| Redirección incorrecta | MEDIA | MEDIA | ✅ CORREGIDO |
| Backend no envía `expiresAt` | BAJA | BAJA | ✅ Funcional (con fallback) |
| Notificaciones con mock | BAJA | BAJA | ⚠️ Esperado |
| Docs con clave antigua | MUY BAJA | MUY BAJA | ⚠️ Opcional |

---

## 🎯 Próximos Pasos Recomendados

### Prioridad Alta
1. ✅ **Corregir redirección después del login** - COMPLETADO
   - ✅ Cambiado `router.push('/')` a `router.push('/dashboard')` en `LoginForm.tsx:48`
   - ✅ Corregido también en `SocialAuthButtons.tsx` para login con Google/Facebook
   - ✅ Verificado que la ruta `/dashboard` existe (`app/dashboard/page.tsx`)

### Prioridad Media
2. **Solicitar al backend que incluya `expiresAt`**
   - Comunicar al equipo de backend la necesidad de incluir `expiresAt` en la respuesta de login
   - O implementar cálculo de `expiresAt` basado en el JWT token

### Prioridad Baja
3. **Integrar módulo de notificaciones**
   - Seguir el plan de integración módulo por módulo
   - Crear servicio real de notificaciones cuando corresponda

4. **Actualizar documentación (opcional)**
   - Actualizar scripts y guías para usar `'airbnb_session'` consistentemente

---

## ✅ Funcionalidades que SÍ Funcionan

- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Guardado de sesión en `localStorage`
- ✅ Carga de sesión al recargar la página
- ✅ Validación de expiración de sesión
- ✅ Actualización de perfil
- ✅ Logout
- ✅ Manejo de errores de API
- ✅ Tokens JWT en headers de autorización

---

**Última actualización:** 2025-12-10  
**Revisado por:** Auto (AI Assistant)

