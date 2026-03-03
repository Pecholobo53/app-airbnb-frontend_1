# Reporte de diagnóstico completo – VoyagerAuMaroc Frontend

**Fecha del reporte:** 3 de marzo de 2026  
**Proyecto:** Frontend Airbnb / VoyagerAuMaroc (Next.js)  
**Tipo:** Diagnóstico técnico consolidado (sin modificaciones realizadas)

---

## Índice

1. [Diagnóstico backend (resumen externo)](#1-diagnóstico-backend-resumen-externo)
2. [Estructura de rutas y router](#2-estructura-de-rutas-y-router)
3. [Configuración de API](#3-configuración-de-api)
4. [Diagnóstico del despliegue](#4-diagnóstico-del-despliegue)
5. [URL del email de verificación](#5-url-del-email-de-verificación)
6. [Análisis del build de Next.js](#6-análisis-del-build-de-nextjs)

---

## 1. Diagnóstico backend (resumen externo)

> Basado en el reporte compartido por el usuario. El backend no está en este workspace.

| Área | Estado | Nota |
|------|--------|------|
| **Storage** | ✅ MongoDB único | Sin MockRepository |
| **Conexión MongoDB** | ✅ Configurada | `connectDatabase()` en `app.ts` |
| **registerUser** | ✅ Correcto | Usa repositorio y MongoDB |
| **verifyEmail** | ⚠️ Inconsistente | Acceso directo al modelo `User`, no pasa por repositorio |
| **Token de verificación** | ⚠️ Texto plano | Almacenado sin hashear en MongoDB |
| **Arquitectura** | ⚠️ Mejorable | Falta `getUserByEmailVerificationToken` en `IUserRepository` |

**Recomendación:** Añadir `getUserByEmailVerificationToken` a `IUserRepository` y refactorizar `verifyEmail` para usar solo el repositorio.

---

## 2. Estructura de rutas y router

### Rutas verificadas

| Ruta física | Existe | Export default |
|-------------|--------|----------------|
| `app/verificar-email/page.tsx` | ✅ Sí | Sí, `VerificarEmailPage` |
| `app/email-confirmado/page.tsx` | ✅ Sí | Sí, `EmailConfirmadoPage` |

### Router utilizado

**App Router** (`/app`). El proyecto usa la carpeta `app/` de Next.js 13+. No existe carpeta `pages/`.

### Detalle verificar-email

- Archivo: `app/verificar-email/page.tsx`
- Export: `export default function VerificarEmailPage()`
- Uso: Lee `token` de `searchParams`, envía POST al backend `/api/auth/verify-email`, redirige a `/email-confirmado` en éxito.

---

## 3. Configuración de API

### Valor de NEXT_PUBLIC_API_URL

| Pregunta | Respuesta |
|----------|-----------|
| Valor actual visible en repo | ❌ No (`.env` y `.env*.local` en `.gitignore`) |
| Valor en `.env.example` | `https://api.voyageraumaroc.net` |

### Producción → api.voyageraumaroc.net

✅ **Confirmado**. La configuración prevista apunta a `https://api.voyageraumaroc.net`:
- `.env.example`
- `lib/config.ts` (comentarios)
- `README.md`

### Uso en fetch

✅ Todos los fetches usan `process.env.NEXT_PUBLIC_API_URL`:
- `lib/auth/auth-service.ts`
- `lib/api-client.ts`
- `lib/config.ts`
- `lib/bookings/booking-service.ts`
- `lib/properties/property-service.ts`
- `lib/users/user-service.ts`
- `lib/favorites/favorites-service.ts`
- `app/verificar-email/page.tsx`
- Y resto de servicios de `/lib`

❌ **No hay localhost hardcodeado** en la app. Solo scripts en `/scripts/` usan fallback a `http://localhost:3000` para ejecución local.

---

## 4. Diagnóstico del despliegue

### Último commit en el repositorio

| Campo | Valor |
|-------|--------|
| Hash | `22e2d3ad1d281b19117572c2e90ea5267b65b5a3` |
| Fecha | 2026-03-02 21:17:00 UTC |
| Mensaje | feat: páginas registro-confirmacion, email-confirmado y plantilla email |

### Inclusión de app/verificar-email

✅ **Sí**. El commit `22e2d3a` incluye:
- `app/verificar-email/page.tsx`
- `app/email-confirmado/page.tsx`
- `app/registro-confirmacion/page.tsx`
- `templates/email-confirmacion-cuenta.html`

### Errores en el build

❌ **El build falla** con error de TypeScript:

```
./lib/auth/auth-service.ts:165:11
Type error: Type '`HTTP_${number}`' is not assignable to type 'AuthError'.

  code: `HTTP_${response.status}`,
        ^
```

**Causa:** `AuthError` es un union de literales fijos. `HTTP_${number}` no está en ese union.

**Warnings (no bloquean):** ESLint (react-hooks/exhaustive-deps, no-img-element).

### Plataformas de despliegue

- **Vercel:** `.vercel/project.json` presente → `voyager-au-maroc-frontend`
- **Netlify:** `netlify.toml` con `publish = "out"` (posible conflicto con build Next.js estándar)

**Nota:** No hay acceso a los logs de despliegue. Si el build falla, la versión en producción podría ser de un commit anterior.

---

## 5. URL del email de verificación

### Formato esperado

Según `docs/EMAIL_CONFIRMACION_Y_404.md` y la plantilla:

| Punto | Valor |
|-------|--------|
| URL final | `https://www.voyageraumaroc.net/verificar-email?token=XXX` |
| Dominio | `www.voyageraumaroc.net` |
| Ruta | `/verificar-email` |
| Query | `?token=` |

### Plantilla HTML

- Archivo: `templates/email-confirmacion-cuenta.html`
- Variables: `{{verificationLink}}`, `{{year}}`
- El backend debe reemplazar:  
  `{{verificationLink}}` → `https://www.voyageraumaroc.net/verificar-email?token=${token}`
- Footer: enlace a `https://www.voyageraumaroc.net`

### Verificaciones

| Pregunta | Respuesta |
|----------|-----------|
| ¿Formato exacto `https://www.voyageraumaroc.net/verificar-email?token=...`? | ✅ Documentado así en docs y plantilla |
| ¿Doble slash o typo? | ❌ No en la documentación; depende de la implementación del backend |
| ¿Dominio coincide con Vercel? | ✅ `www.voyageraumaroc.net` es el dominio de producción indicado |

**Importante:** La URL real la construye el backend. El frontend solo aporta la plantilla y la ruta `/verificar-email`. El backend debe usar `APP_URL=https://www.voyageraumaroc.net` (sin barra final).

---

## 6. Análisis del build de Next.js

### Ruta verificar-email en el build

- La ruta existe en el código: `app/verificar-email/page.tsx`
- El build **no llega a completarse** por el error de TypeScript en `auth-service.ts`
- Si el build compilara, `/verificar-email` quedaría incluida en el output

### Rutas dinámicas

- No se han detectado errores específicos de dynamic routes
- El fallo del build se debe únicamente al error de tipos en `auth-service.ts`

### output: 'export' (static export)

✅ **No configurado**. En `next.config.js` no existe la propiedad `output` ni `output: 'export'`.

**Nota:** `netlify.toml` tiene `publish = "out"`, que suele usarse con `output: 'export'`. Con la configuración actual de Next.js (build estándar), el output va a `.next`, no a `out`. Conviene revisar la configuración de Netlify.

---

## Resumen ejecutivo

| Área | Estado global |
|------|----------------|
| Rutas frontend (verificar-email, email-confirmado) | ✅ Correctas |
| Router | ✅ App Router |
| Configuración API | ✅ Usa variable de entorno, no localhost hardcodeado |
| Despliegue (commit) | ⚠️ Build falla; commit reciente incluye verificar-email |
| URL email verificación | ✅ Documentada correctamente; depende del backend |
| Build Next.js | ❌ Error TypeScript en `auth-service.ts:165` |

### Acción requerida para que el build funcione

Corregir el error en `lib/auth/auth-service.ts` línea 165: el `code` del error debe ser un valor de tipo `AuthError` (por ejemplo `'INVALID_RESPONSE'` o `'SERVER_ERROR'`) en lugar de `HTTP_${response.status}`.

---

*Reporte generado automáticamente. Sin modificaciones realizadas en el código.*
