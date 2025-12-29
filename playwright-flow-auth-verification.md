# 🧪 Verificación Módulo de Autenticación con Playwright

**Fecha:** 27 de Diciembre, 2025  
**URL Base:** http://localhost:3001  
**Backend API:** http://localhost:3000  
**Flujo:** Verificación completa del módulo de autenticación (login y registro)  
**Credenciales de Prueba:**
- Usuario: `armando@yahoo.es` / `Pecholobo33,,`
- Usuario nuevo: `testnuevo123@example.com` / `TestPassword123`

---

## 📋 RESUMEN EJECUTIVO

❌ **PROBLEMA CRÍTICO IDENTIFICADO**

Las pruebas con Playwright confirman que **el formulario no está ejecutando la función `onSubmit`**. No aparecen los logs de depuración agregados, lo que indica que hay un problema antes de que se ejecute el código de autenticación.

---

## 🔍 PRUEBAS REALIZADAS

### Prueba 1: Login de Usuario

**Configuración:**
- URL: `http://localhost:3001/login`
- Credenciales: `armando@yahoo.es` / `Pecholobo33,,`
- Selectores:
  - Email: `#email` ✅
  - Password: `#password` ✅
  - Submit: `button[type="submit"]` ✅

**Resultado:** ❌ **FALLO**

**Observaciones:**
- ✅ La página de login se carga correctamente
- ✅ Los campos se llenan correctamente
- ✅ El botón submit se hace click
- ❌ **NO aparecen logs de `[LOGIN FORM] onSubmit llamado`**
- ❌ **NO se hace petición HTTP a `/api/auth/login`** (timeout esperando respuesta)
- ❌ **NO hay logs de `[AUTH SERVICE]` en la consola**
- ❌ La página redirige a `/buscar` (página principal) sin mostrar errores

**Logs de Consola (NO aparecen los esperados):**
```
❌ NO aparece: 🔐 [LOGIN FORM] onSubmit llamado con datos
❌ NO aparece: 🔐 [LOGIN FORM] Llamando a login()...
❌ NO aparece: 🔐 [AUTH SERVICE] Iniciando login:
❌ NO aparece: 📤 [AUTH SERVICE] Enviando request a:
```

**Logs que SÍ aparecen:**
```
[log] 📭 [LOAD SESSION] No hay sesión guardada en localStorage
[log] 🔍 [HEADER] Búsqueda iniciada:
[log] 🔗 [HEADER] Navegando a búsqueda sin filtros
```

---

### Prueba 2: Registro de Usuario Nuevo

**Configuración:**
- URL: `http://localhost:3001/registro`
- Datos:
  - Nombre: `Test User Nuevo`
  - Email: `testnuevo123@example.com`
  - Password: `TestPassword123`
  - Confirm Password: `TestPassword123`
- Selectores:
  - Nombre: `#name` ✅
  - Email: `#email` ✅
  - Password: `#password` ✅
  - Confirm Password: `#confirmPassword` ✅
  - Submit: `button[type="submit"]` ✅

**Resultado:** ❌ **FALLO**

**Observaciones:**
- ✅ La página de registro se carga correctamente
- ✅ Los campos se llenan correctamente
- ✅ El botón submit se hace click
- ❌ **NO aparecen logs de `[REGISTER FORM] onSubmit llamado`**
- ❌ **NO se hace petición HTTP a `/api/auth/register`** (timeout esperando respuesta)
- ❌ **NO hay logs de `[AUTH SERVICE]` o `[REGISTER]` en la consola**

---

## 🐛 PROBLEMA IDENTIFICADO

### Causa Raíz: El Formulario No Ejecuta `onSubmit`

**Severidad:** 🔴 **CRÍTICA**

**Descripción:**
El problema principal es que la función `onSubmit` de los formularios **NO se está ejecutando**. Esto se confirma porque:

1. ❌ No aparecen los logs agregados al inicio de `onSubmit`
2. ❌ No se hacen peticiones HTTP al backend
3. ❌ La página redirige sin mostrar errores

**Posibles Causas:**

1. **Error de Validación de React Hook Form** 🔴 **MÁS PROBABLE**
   - `react-hook-form` está bloqueando el submit por errores de validación
   - Los errores de validación no se están mostrando al usuario
   - El `handleSubmit` no está llamando a `onSubmit` porque la validación falla

2. **Problema con el Event Handler del Formulario** 🟡 **PROBABLE**
   - El `onSubmit` del formulario HTML podría estar siendo prevenido incorrectamente
   - Hay un `e.preventDefault()` que está bloqueando el flujo
   - El `handleSubmit` de react-hook-form no está conectado correctamente

3. **Error JavaScript Silenciado** 🟡 **POSIBLE**
   - Hay un error JavaScript que está siendo capturado y silenciado
   - Un Error Boundary está capturando el error sin mostrarlo
   - Hay un try-catch que está silenciando el error

---

## 🔧 CORRECCIONES APLICADAS

### Corrección 1: Mejora del Manejo de Errores en `auth-service.ts`

**Archivo:** `lib/auth/auth-service.ts`

**Cambios:**
- ✅ Agregado try-catch específico alrededor del `fetch` para capturar errores de conexión
- ✅ Mejorado el logging de errores con más detalles (tipo, mensaje, stack)
- ✅ Agregado detección específica de errores de red (Failed to fetch, NetworkError)
- ✅ Agregado log del body antes de hacer el fetch
- ✅ Mejorado el manejo de errores en el catch general

**Código Agregado:**
```typescript
let response: Response;
try {
  console.log('🔄 [AUTH SERVICE] Ejecutando fetch...');
  response = await fetch(url, {
    ...options,
    headers,
  });
  console.log('✅ [AUTH SERVICE] Fetch completado, status:', response.status);
} catch (fetchError) {
  // Manejo detallado de errores de fetch
  // ...
}
```

### Corrección 2: Logs de Depuración en Formularios

**Archivos:** 
- `components/auth/LoginForm.tsx`
- `components/auth/RegisterForm.tsx`

**Cambios:**
- ✅ Agregado log al inicio de `onSubmit` para verificar que se ejecute
- ✅ Agregado log antes de llamar a `login()` / `registerUser()`
- ✅ Agregado log después de recibir respuesta
- ✅ Agregado try-catch en `RegisterForm.tsx`

---

## 📊 ANÁLISIS DETALLADO

### Verificación del Flujo de Ejecución

Según el stack trace mostrado en las capturas del inspector:
- ✅ El código SÍ llega a `auth-service.ts:102` (donde se hace el fetch)
- ✅ El código SÍ llega a `auth-service.ts:315` (función login)
- ✅ El código SÍ llega a `auth-context.tsx:181` (función login del contexto)
- ✅ El código SÍ llega a `LoginForm.tsx:51` y `LoginForm.tsx:102`

**Conclusión:**
El código SÍ se está ejecutando cuando se prueba manualmente en el navegador, pero NO cuando se prueba con Playwright. Esto sugiere que:

1. Hay un problema específico con cómo Playwright interactúa con el formulario
2. Hay un problema de timing (el formulario no está listo cuando Playwright hace click)
3. Hay un problema con la validación que solo se activa en ciertas condiciones

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

### Prioridad 1: Verificar Validación del Formulario

1. **Agregar logs de validación:**
   ```tsx
   const onSubmit = async (data: LoginFormData) => {
     console.log('🔐 [LOGIN FORM] onSubmit llamado');
     console.log('🔐 [LOGIN FORM] Errores de validación:', errors);
     console.log('🔐 [LOGIN FORM] Datos validados:', data);
     // ...
   };
   ```

2. **Verificar que handleSubmit esté conectado:**
   ```tsx
   <form 
     onSubmit={(e) => {
       console.log('📝 [FORM] onSubmit del HTML llamado');
       e.preventDefault();
       e.stopPropagation();
       console.log('📝 [FORM] Llamando a handleSubmit...');
       handleSubmit(onSubmit)(e);
     }}
   >
   ```

3. **Agregar validación manual antes del submit:**
   ```tsx
   const handleFormSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     console.log('📝 [FORM] handleFormSubmit llamado');
     
     const isValid = await trigger(); // Disparar validación
     console.log('📝 [FORM] Validación:', isValid);
     console.log('📝 [FORM] Errores:', errors);
     
     if (isValid) {
       const data = getValues();
       console.log('📝 [FORM] Datos válidos, llamando a onSubmit');
       await onSubmit(data);
     } else {
       console.error('❌ [FORM] Validación falló');
     }
   };
   ```

### Prioridad 2: Verificar Problemas de Timing

1. **Agregar espera antes de hacer click:**
   ```typescript
   // En Playwright
   await page.waitForSelector('button[type="submit"]:not([disabled])');
   await page.click('button[type="submit"]');
   ```

2. **Verificar que el formulario esté listo:**
   ```typescript
   await page.waitForFunction(() => {
     const form = document.querySelector('form');
     return form && !form.querySelector('[aria-invalid="true"]');
   });
   ```

### Prioridad 3: Verificar Errores de JavaScript

1. **Capturar todos los errores de consola:**
   ```typescript
   page.on('console', msg => {
     if (msg.type() === 'error') {
       console.error('Error en consola:', msg.text());
     }
   });
   ```

2. **Capturar errores no manejados:**
   ```typescript
   page.on('pageerror', error => {
     console.error('Error de página:', error.message);
   });
   ```

---

## 📋 CHECKLIST DE VERIFICACIÓN

Antes de reportar como resuelto, verificar:

- [ ] Los logs de `[LOGIN FORM] onSubmit llamado` aparecen en la consola
- [ ] Los logs de `[AUTH SERVICE]` aparecen en la consola
- [ ] Las peticiones HTTP se hacen correctamente (visible en Network tab)
- [ ] Los errores de validación se muestran al usuario
- [ ] El formulario no redirige silenciosamente cuando hay errores
- [ ] El backend recibe las peticiones (verificar logs del backend)
- [ ] Las respuestas del backend se procesan correctamente

---

## 🔄 ESTADO ACTUAL

**Última actualización:** 27 de Diciembre, 2025 - 08:15 UTC  
**Estado:** ⚠️ **PROBLEMA IDENTIFICADO - REQUIERE INVESTIGACIÓN ADICIONAL**

**Problema Principal:**
El formulario no está ejecutando `onSubmit`, posiblemente debido a:
1. Errores de validación de React Hook Form que no se muestran
2. Problema con el event handler del formulario
3. Problema de timing con Playwright

**Correcciones Aplicadas:**
- ✅ Mejorado manejo de errores en `auth-service.ts`
- ✅ Agregado logs de depuración en formularios
- ✅ Mejorado detección de errores de red

**Próximos Pasos:**
1. Agregar logs de validación en los formularios
2. Verificar que `handleSubmit` esté conectado correctamente
3. Probar manualmente en el navegador para comparar con Playwright

---

**Generado por:** Playwright MCP Agent  
**Herramientas usadas:** Playwright Navigation, Screenshots, Console Logs, JavaScript Evaluation








