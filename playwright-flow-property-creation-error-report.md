# 🐛 REPORTE: Error en Creación de Propiedades

**Fecha:** 2025-12-28  
**Tester:** Playwright MCP  
**Usuario de Prueba:** armandito@gmail.com (Admin)  
**Flujo:** Creación de Nueva Propiedad

---

## 📋 RESUMEN EJECUTIVO

**Estado:** ❌ **FALLO CRÍTICO**  
**Problema Principal:** El formulario de creación de propiedades no envía la petición al backend.  
**Severidad:** 🔴 **ALTA** - Bloquea funcionalidad principal del módulo admin

---

## 🔍 HALLAZGOS DEL TEST

### 1. Problema de Envío del Formulario

**Síntoma:**
- Al hacer click en "Guardar Propiedad", NO se envía petición HTTP al backend
- Timeout esperando respuesta de `/api/properties` (30 segundos)
- No aparecen logs de `📤 [FORM] Enviando datos` en consola
- El formulario permanece en la misma página sin mostrar errores

**Evidencia:**
- Screenshot `12-before-submit.png`: Formulario completo y listo
- Screenshot `13-after-submit-final.png`: Sin cambios después de submit
- No hay petición HTTP en Network tab
- No hay logs de envío en consola

**Causa Probable:**
- El `handleSubmit` no se está ejecutando
- Hay una validación que está bloqueando el envío silenciosamente
- El evento `onSubmit` no está conectado correctamente

---

### 2. Validación de Imágenes

**Síntoma:**
- Primera validación detectada: "Debes agregar al menos una imagen"
- El método de agregar imagen usa `window.prompt()` que no es interactivo en Playwright

**Evidencia:**
- Toast error: "Errores de validación: Debes agregar al menos una imagen"
- Screenshot `07-after-submit-error.png` muestra el error

**Estado:** ⚠️ **PARCIALMENTE RESUELTO** - Se puede agregar imagen con override de prompt

---

### 3. Error Backend: "expected object, received undefined"

**Síntoma:**
- Error 400 del backend: "Invalid input: expected object, received undefined"
- Aparece cuando se intenta crear propiedad con datos completos

**Evidencia:**
- Error visible en UI: "Error: Errores de validación: Invalid input: expected object, received undefined"
- Network tab muestra status 400 para `/api/properties`

**Causa Probable:**
- Algún campo requerido está llegando como `undefined` al backend
- El backend espera un objeto pero recibe `undefined` en algún campo anidado
- Posibles campos problemáticos: `location.coordinates`, `pricing`, `capacity`, `availability`

---

## 🔧 ANÁLISIS TÉCNICO

### Código Revisado

**Archivo:** `app/admin/properties/new/page.tsx`

**Problemas Identificados:**

1. **Validación de Imágenes (Línea 111-113):**
   ```typescript
   if (formData.images.length === 0) {
     errors.push('Debes agregar al menos una imagen');
   }
   ```
   ✅ Funciona correctamente

2. **Construcción del Objeto (Líneas 204-241):**
   - Se construye `dataToSend` con todos los campos requeridos
   - Se agregan campos opcionales solo si tienen valor
   - Se limpia con `JSON.stringify/parse`

3. **Validación de Objetos (Líneas 243-258):**
   - Valida que todos los objetos requeridos estén presentes
   - Lanza errores si falta algún objeto

4. **Problema Potencial:**
   - El `handleSubmit` podría estar fallando antes de llegar al envío
   - Las validaciones podrían estar bloqueando sin mostrar error
   - El formulario podría no estar conectado correctamente

---

## 🎯 PROBLEMA RAÍZ IDENTIFICADO

**Hipótesis Principal:**

El problema más probable es que **el formulario no está ejecutando `handleSubmit` correctamente** o hay una **validación que está bloqueando el envío antes de que se haga la petición HTTP**.

**Posibles Causas:**

1. ❌ El evento `onSubmit` del formulario no está conectado
2. ❌ Hay un `e.preventDefault()` que está bloqueando
3. ❌ Una validación está retornando antes de llegar al `PropertyService.createProperty()`
4. ❌ El botón de submit no tiene `type="submit"` o está fuera del formulario

---

## ✅ SOLUCIÓN PROPUESTA

### Paso 1: Verificar Conexión del Formulario

Revisar que el `form` tenga el `onSubmit` correctamente conectado:

```typescript
<form onSubmit={handleSubmit} className="space-y-6">
```

### Paso 2: Agregar Logging en handleSubmit

Agregar logs al inicio de `handleSubmit` para verificar que se ejecuta:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('🚀 [FORM] handleSubmit ejecutado');
  setIsSaving(true);
  // ... resto del código
```

### Paso 3: Verificar Validaciones

Asegurar que las validaciones no estén bloqueando silenciosamente:

```typescript
if (errors.length > 0) {
  console.error('❌ [FORM] Errores de validación:', errors);
  toast.error(`Errores de validación: ${errors.join(', ')}`);
  setIsSaving(false);
  return;
}
```

### Paso 4: Verificar que el Botón Esté Dentro del Form

Asegurar que el botón "Guardar Propiedad" esté dentro del `<form>` y tenga `type="submit"`.

---

## 📸 CAPTURAS DE PANTALLA

1. `01-login-page.png` - Página de login
2. `02-login-filled.png` - Login con credenciales
3. `03-new-property-page.png` - Página de creación (sin sesión)
4. `04-admin-properties-new.png` - Página de creación (con sesión)
5. `05-form-loaded.png` - Formulario cargado
6. `06-form-filled.png` - Formulario parcialmente lleno
7. `07-after-submit-error.png` - Error de validación (sin imagen)
8. `08-image-added.png` - Imagen agregada
9. `09-final-error-state.png` - Estado después de submit
10. `10-form-complete-ready.png` - Formulario completo listo
11. `11-error-details.png` - Detalles del error
12. `12-before-submit.png` - Antes de enviar
13. `13-after-submit-final.png` - Después de enviar (sin cambios)

---

## ✅ SOLUCIONES IMPLEMENTADAS

### 1. Logging Detallado Agregado

**Archivo:** `app/admin/properties/new/page.tsx`

**Cambios realizados:**

1. **Log al inicio de handleSubmit (Línea 68):**
   ```typescript
   console.log('🚀 [FORM] handleSubmit ejecutado');
   console.log('📋 [FORM] Estado actual del formulario:', {
     title: formData.title,
     description: formData.description,
     city: formData.location.city,
     country: formData.location.country,
     basePrice: formData.pricing.basePrice,
     imagesCount: formData.images.length,
     amenitiesCount: formData.amenities.length,
   });
   ```

2. **Log antes de llamar al servicio (Línea 339):**
   ```typescript
   console.log('🚀 [FORM] Llamando a PropertyService.createProperty...');
   const response = await PropertyService.createProperty(cleanedData);
   console.log('📥 [FORM] Respuesta recibida:', response);
   ```

3. **Logs mejorados de validación:**
   - Todos los logs ahora tienen prefijo `[FORM]` para fácil identificación
   - Logs de estado del formulario antes de enviar
   - Logs de respuesta del backend

### 2. Verificación de Conexión del Formulario

✅ **Confirmado:** El formulario está correctamente conectado:
- `<form onSubmit={handleSubmit} className="space-y-6">` (Línea 395)
- Botón tiene `type="submit"` (Línea 846)
- Botón está dentro del formulario

### 3. Mejoras en Manejo de Errores

- Logs más descriptivos con prefijos `[FORM]`
- Validación mejorada de objetos requeridos
- Mensajes de error más claros

---

## 🔄 PRÓXIMOS PASOS PARA DEBUGGING

1. ✅ **COMPLETADO:** Agregar logging detallado
2. ⏳ **PENDIENTE:** Probar el formulario manualmente y revisar logs en consola
3. ⏳ **PENDIENTE:** Identificar qué campo específico está causando "expected object, received undefined"
4. ⏳ **PENDIENTE:** Verificar que los campos se actualicen correctamente en el estado de React
5. ⏳ **PENDIENTE:** Si el problema persiste, revisar el backend para ver qué campo espera

---

## 📝 NOTAS ADICIONALES

- El backend está respondiendo (no es problema de conexión)
- La sesión de admin se establece correctamente
- El formulario se llena correctamente
- El problema está en el envío o en la validación previa al envío

---

**Reporte generado por:** Playwright MCP Test Suite  
**Próxima acción:** Revisar código de `handleSubmit` y agregar logging detallado

