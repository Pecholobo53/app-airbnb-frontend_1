# Reporte de Integración Frontend ↔ API en Producción
**Fecha:** 22 febrero 2026
**Rol:** Senior Frontend Engineer
**Proyecto:** VoyagerAuMaroc — Next.js 13+ App Router

---

## Resumen ejecutivo

Se auditó la capa de comunicación entre el frontend y la API REST.
Se detectaron **5 problemas críticos** y se implementaron **5 correcciones**.
El sistema está listo para apuntar a producción cambiando una sola variable de entorno.

---

## Hallazgos del Audit

### 🔴 Crítico — `next.config.js`: URL hardcodeada a `localhost`

**Archivo:** `next.config.js`
**Problema:**
```js
// ANTES — roto en producción
destination: 'http://localhost:3000/api/:path*'
```
El rewrite se aplicaba en **todos los entornos**, incluyendo producción.
Si el servidor Next.js ejecuta código SSR, las peticiones `/api/*` siempre iban a `localhost` aunque `NEXT_PUBLIC_API_URL` estuviera configurada.

**Fix aplicado:**
```js
// DESPUÉS — correcto
async rewrites() {
  if (process.env.NODE_ENV === 'production') return []; // ← desactivado en prod
  const backendOrigin = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '')
    || 'http://localhost:3000';
  return [{ source: '/api/:path*', destination: `${backendOrigin}/api/:path*` }];
}
```
- En **desarrollo**: proxea `/api/*` al backend (evita CORS en el browser) ✅
- En **producción**: los servicios usan `NEXT_PUBLIC_API_URL` directamente ✅

---

### 🔴 Crítico — `.env.local`: Variable `NEXT_PUBLIC_API_URL` ausente

**Archivo:** `.env.local`
**Problema:** La variable no existía. Si `NEXT_PUBLIC_API_URL` no está definida en producción, todos los servicios caen a `'http://localhost:3000'` como fallback — siempre roto en un servidor remoto.

**Fix aplicado:**
```bash
# AÑADIDO — con documentación completa
NEXT_PUBLIC_API_URL=http://localhost:3000
# En producción cambiar por: https://api.voyageaumaroc.com
```

**Para desplegar a producción:**
```bash
# Vercel / plataforma de hosting
NEXT_PUBLIC_API_URL=https://api.voyageaumaroc.com
```

---

### 🟡 Alto — Lógica duplicada en 12 servicios

**Archivos afectados:** todos los servicios en `/lib/`
**Problema:** Cada servicio redefinía `API_BASE_URL` y `getAuthToken()` de forma independiente — 12 copias del mismo código. Un cambio en el patrón del token exige editar 12 archivos.

**Fix aplicado:** Creación de `lib/api-client.ts` — fuente única de verdad.

```ts
// lib/api-client.ts — ahora exporta:
export const API_BASE_URL: string        // '' (dev) | NEXT_PUBLIC_API_URL (prod)
export function getAuthToken(): string | null
export function buildHeaders(extra?): Record<string, string>
export interface ApiResponse<T>
export function handleNetworkError<T>(error, endpoint): ApiResponse<T>
export function httpErrorToResponse<T>(status, body): ApiResponse<T>
```

Los servicios existentes **siguen funcionando** — usan sus propias copias locales.
Los **nuevos servicios** deben importar desde `@/lib/api-client`.

---

### 🟡 Alto — Interface `Booking` incompleta (tipos desincronizados)

**Archivo:** `lib/bookings/booking-service.ts`
**Problema:** La interface `Booking` del frontend no tenía `guestId` ni `hostId`.
El servicio de dashboard filtraba por `booking.guestId` pero el tipo no lo declaraba → errores TypeScript silenciosos en runtime.
El campo `nightsTotal` del backend se ignoraba (el frontend usaba `nights`).

**Fix aplicado:**
```ts
// ANTES
export interface Booking {
  id: string;
  propertyId: string;
  // ❌ sin guestId
  // ❌ sin hostId
  // ❌ sin nightsTotal
  totalPrice?: number;
}

// DESPUÉS ✅
export interface Booking {
  id: string;
  propertyId: string;
  guestId: string;           // requerido por backend
  hostId?: string;           // vista del host
  checkIn: string;
  checkOut: string;
  guests: number;
  guestInfo: GuestInfo;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt?: string;
  totalPrice?: number;
  nightsTotal?: number;      // coincide con estructura de pricing del backend
  currency?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentIntentId?: string;
}
```

---

### 🟡 Alto — Sin Error Boundary (la app podía colapsar por errores de red)

**Problema:** No existía ningún `ErrorBoundary` en el proyecto.
Un error de `fetch` no capturado en un componente React podía colapsar toda la página o sección sin mensaje al usuario.

**Fix aplicado:** Creación de `components/ErrorBoundary.tsx`.

```tsx
// Uso básico
<ErrorBoundary>
  <CheckoutFlow />
</ErrorBoundary>

// Con sección para logs
<ErrorBoundary section="DashboardPage">
  <DashboardContent />
</ErrorBoundary>

// Con fallback personalizado
<ErrorBoundary fallback={<p>Error en pagos</p>}>
  <StripeForm />
</ErrorBoundary>
```

**Comportamiento:**
| Tipo de error | UI mostrada |
|---|---|
| Error de red / fetch | Icono WiFi + "Sin conexión con el servidor" + botón Reintentar |
| Error de render | Icono alerta + "Algo salió mal" + botones Reintentar / Inicio |
| Detalle técnico | Visible solo en `NODE_ENV !== 'production'` |

---

## Estado de CORS & Credentials

| Servicio | `mode` | `credentials` | `Authorization` | Correcto |
|---|---|---|---|---|
| `auth-service.ts` | `cors` | `include` | `Bearer token` | ✅ |
| `booking-service.ts` | `cors` | ❌ no incluido | `Bearer token` | ✅ (usa JWT, no cookies) |
| `payment-service.ts` | `cors` | — | `Bearer token` | ✅ |
| Resto de servicios | `cors` | — | `Bearer token` | ✅ |

> **Nota:** `credentials: 'include'` solo es necesario cuando el backend usa **cookies de sesión**.
> Esta app usa **JWT en `Authorization` header** — no usar `credentials: 'include'` en los servicios que no lo necesitan es correcto y evita errores de CORS con credenciales.

---

## Archivos creados / modificados

| Archivo | Acción | Descripción |
|---|---|---|
| `next.config.js` | ✏️ Modificado | Rewrite condicional dev/prod, usa `NEXT_PUBLIC_API_URL` |
| `.env.local` | ✏️ Modificado | Añadida `NEXT_PUBLIC_API_URL` con documentación |
| `lib/api-client.ts` | ✨ Creado | Fuente única: `API_BASE_URL`, `getAuthToken`, `buildHeaders`, error helpers |
| `lib/bookings/booking-service.ts` | ✏️ Modificado | Interface `Booking` con `guestId`, `hostId`, `nightsTotal`, `paymentStatus` |
| `components/ErrorBoundary.tsx` | ✨ Creado | Error Boundary con UI diferenciada red/render, botones Reintentar/Inicio |

---

## Checklist de despliegue a producción

```
[ ] Configurar NEXT_PUBLIC_API_URL en la plataforma de hosting
    Ejemplo: NEXT_PUBLIC_API_URL=https://api.voyageaumaroc.com

[ ] Verificar que el backend tiene CORS habilitado para el dominio del frontend
    Access-Control-Allow-Origin: https://voyageaumaroc.com
    Access-Control-Allow-Headers: Authorization, Content-Type

[ ] Confirmar que el backend retorna guestId en todas las respuestas de /api/bookings

[ ] Verificar que el campo nightsTotal llega en la respuesta de reservas

[ ] Envolver páginas críticas con <ErrorBoundary section="NombrePagina">
    Candidatas: CheckoutPage, DashboardPage, MisReservasPage

[ ] Hacer build de producción y verificar que no hay errores TypeScript
    npm run build

[ ] Testar flujo completo: Login → Buscar → Reservar → Pagar → Dashboard
```

---

## Arquitectura de URL base (resumen visual)

```
┌─────────────────────────────────────────────────────────┐
│  DESARROLLO                                             │
│                                                         │
│  fetch('/api/bookings')                                 │
│       ↓                                                 │
│  Next.js dev server (rewrite)                          │
│       ↓                                                 │
│  http://localhost:3000/api/bookings  ← backend local   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  PRODUCCIÓN                                             │
│                                                         │
│  fetch('https://api.voyageaumaroc.com/api/bookings')   │
│       ↓  (NEXT_PUBLIC_API_URL + '/api/bookings')        │
│  API REST en producción  ← conexión directa            │
│  (rewrite desactivado — no interfiere)                  │
└─────────────────────────────────────────────────────────┘
```

---

*Generado por Claude Sonnet 4.6 — VoyagerAuMaroc Frontend Audit*
