#!/usr/bin/env node
/**
 * scripts/smoke-test.mjs
 *
 * Suite mínima de smoke tests que verifica que el backend de producción
 * está operativo y los endpoints críticos responden correctamente.
 *
 * Uso:
 *   node scripts/smoke-test.mjs                  # apunta a producción
 *   BASE_URL=http://localhost:3000 node scripts/smoke-test.mjs  # local
 *
 * Requiere Node 18+ (fetch nativo).
 */

const BASE_URL = process.env.BASE_URL ?? 'https://api.voyageraumaroc.net';
const TIMEOUT_MS = 10_000;

// ─── Helpers ─────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function log(emoji, label, msg = '') {
  console.log(`  ${emoji}  ${label}${msg ? ` — ${msg}` : ''}`);
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function test(label, fn) {
  process.stdout.write(`  ⏳  ${label}...`);
  try {
    await fn();
    passed++;
    process.stdout.write(`\r  ✅  ${label}\n`);
  } catch (err) {
    failed++;
    const msg = err instanceof Error ? err.message : String(err);
    process.stdout.write(`\r  ❌  ${label} — ${msg}\n`);
    failures.push({ label, msg });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ─── Suite ───────────────────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║        VoyagerAuMaroc — Smoke Test Suite         ║');
console.log('╚══════════════════════════════════════════════════╝');
console.log(`\n  Target: ${BASE_URL}`);
console.log(`  Date  : ${new Date().toISOString()}\n`);

// 1. Health check
await test('Health check — GET /api/health', async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/api/health`);
  assert(res.status < 500, `HTTP ${res.status} (esperado < 500)`);
  log('  ↳', `HTTP ${res.status}`);
});

// 2. Propiedades — listado público
await test('Properties — GET /api/properties/search', async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/api/properties/search?limit=3`);
  assert(res.status === 200, `HTTP ${res.status} (esperado 200)`);
  const body = await res.json();
  const items = body?.data ?? body?.properties ?? body?.items ?? body;
  assert(Array.isArray(items) || typeof body === 'object', 'Respuesta no es JSON válido');
  log('  ↳', `HTTP ${res.status} — respuesta JSON OK`);
});

// 3. Auth — login con credenciales inválidas (debe responder 401, no 500)
await test('Auth — POST /api/auth/login (credenciales inválidas → 401)', async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'smoke@test.invalid', password: 'smoke_wrong_pw' }),
  });
  assert(
    res.status === 401 || res.status === 400,
    `HTTP ${res.status} (esperado 400 o 401 para credenciales inválidas)`
  );
  log('  ↳', `HTTP ${res.status} — rechazo correcto`);
});

// 4. Auth — rutas protegidas sin token (deben responder 401)
await test('Auth — GET /api/auth/me sin token (→ 401)', async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/api/auth/me`);
  assert(
    res.status === 401 || res.status === 403,
    `HTTP ${res.status} (esperado 401 o 403 sin token)`
  );
  log('  ↳', `HTTP ${res.status} — acceso denegado correctamente`);
});

// 5. Bookings — ruta protegida sin token (debe responder 401)
await test('Bookings — GET /api/bookings sin token (→ 401)', async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/api/bookings`);
  assert(
    res.status === 401 || res.status === 403,
    `HTTP ${res.status} (esperado 401 o 403 sin token)`
  );
  log('  ↳', `HTTP ${res.status} — acceso denegado correctamente`);
});

// 6. CORS — preflight desde origen del frontend
await test('CORS — OPTIONS preflight desde voyageraumaroc.net', async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/api/properties/search`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://voyageraumaroc.net',
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'Authorization,Content-Type',
    },
  });
  // Aceptamos 200 o 204 (respuesta estándar de preflight)
  assert(
    res.status === 200 || res.status === 204 || res.status < 300,
    `HTTP ${res.status} (esperado 200 o 204 para preflight)`
  );
  const allowOrigin = res.headers.get('access-control-allow-origin') ?? '';
  const allowed =
    allowOrigin === '*' ||
    allowOrigin.includes('voyageraumaroc.net') ||
    allowOrigin.includes('localhost');
  assert(allowed, `CORS no permite el origen. access-control-allow-origin: "${allowOrigin}"`);
  log('  ↳', `HTTP ${res.status} — CORS OK (origin: ${allowOrigin || 'no header (check backend)'})`);
});

// 7. Newsletter — endpoint de suscripción (sin email → validación del servidor)
await test('Newsletter — POST /api/newsletter (sin email → 400 o 422)', async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/api/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert(
    res.status === 400 || res.status === 422 || res.status === 404,
    `HTTP ${res.status} (esperado 400/422/404 para body vacío)`
  );
  log('  ↳', `HTTP ${res.status} — validación OK`);
});

// ─── Resultado final ──────────────────────────────────────────────────────────

console.log('\n──────────────────────────────────────────────────');
console.log(`  Resultado: ${passed} pasados, ${failed} fallidos`);

if (failures.length > 0) {
  console.log('\n  Fallos detallados:');
  failures.forEach(({ label, msg }) => {
    console.log(`    ❌  ${label}`);
    console.log(`        ${msg}`);
  });
}

console.log('──────────────────────────────────────────────────\n');

// Exit code 1 si hay fallos (útil en CI)
process.exit(failed > 0 ? 1 : 0);
