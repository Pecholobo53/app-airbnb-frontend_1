# 🔍 INSPECCIÓN: PROBLEMA DE BUCLE EN CHECKOUT

**Fecha:** 31 de Diciembre de 2024  
**URL Problemática:** `http://localhost:3001/checkout?id=6954e9a62f77822bca5c8202&propertyId=6951575b171ec464a14d3516&checkIn=2026-01-26&checkOut=2026-01-28&adults=1&children=0&infants=0`

**Síntoma:** La página se queda en bucle cargando ("Cargando checkout...") y no pasa a la siguiente URL.

---

## 🔍 ANÁLISIS DEL PROBLEMA

### Posibles Causas Identificadas

1. **Bucle en `useEffect`:**
   - El `useEffect` tiene dependencias que pueden cambiar constantemente
   - `urlParams` se recrea en cada render si `useMemo` no funciona correctamente
   - `bookingId` en las dependencias puede causar bucles si se actualiza dentro del efecto

2. **`loadCheckoutData` no termina correctamente:**
   - Si hay un error no manejado, `isLoadingRef.current` puede quedar en `true`
   - Si `setIsLoading(false)` no se llama en algún caso, la página queda cargando

3. **Redirección con `window.location.href`:**
   - La redirección puede causar que el componente se monte de nuevo
   - Si los parámetros son los mismos, puede entrar en bucle

4. **Caché de disponibilidad:**
   - El caché puede estar causando que se intente cargar datos incorrectos

---

## 🔧 CORRECCIONES IMPLEMENTADAS

### 1. Mejora en `useMemo` para `urlParams`

**Antes:**
```typescript
const urlParams = useMemo(() => ({
  bookingId: searchParams.get('id'),
  ...
}), [searchParams]); // ❌ searchParams es un objeto que cambia en cada render
```

**Después:**
```typescript
const urlParamsKey = useMemo(() => {
  return searchParams.toString();
}, [searchParams.toString()]);

const urlParams = useMemo(() => ({
  bookingId: searchParams.get('id'),
  ...
}), [urlParamsKey]); // ✅ Depende de una clave estable
```

**Resultado:** `urlParams` solo se recrea cuando los parámetros realmente cambian.

---

### 2. Eliminación de `bookingId` de dependencias del `useEffect`

**Antes:**
```typescript
}, [..., bookingId]); // ❌ bookingId puede cambiar dentro del efecto, causando bucle
```

**Después:**
```typescript
}, [..., urlParamsKey, urlParams.bookingId, ...]); // ✅ Depende de valores primitivos
```

**Resultado:** El efecto no se ejecuta cuando `bookingId` cambia internamente.

---

### 3. Logs de Depuración Agregados

Se agregaron logs detallados para rastrear:
- Cuándo se ejecuta el `useEffect`
- Qué condiciones se cumplen o no
- Cuándo se inicia y termina `loadCheckoutData`
- Estado de `isLoadingRef` y `hasLoadedRef`

**Logs agregados:**
```typescript
console.log('🔄 [CHECKOUT] useEffect ejecutado', {...});
console.log('🔑 [CHECKOUT] Load key calculada:', loadKey);
console.log('✅ [CHECKOUT] Condiciones cumplidas, iniciando carga...');
console.log('🚀 [CHECKOUT] loadCheckoutData INICIADO', {...});
console.log('✅ [CHECKOUT] loadCheckoutData completado exitosamente');
console.log('🏁 [CHECKOUT] loadCheckoutData finally - reseteando isLoadingRef');
```

---

### 4. Asegurar que `isLoadingRef` siempre se resetee

**Mejora:**
- Se agregó `.finally()` al `loadCheckoutData()` para asegurar que siempre se resetee
- Se agregó manejo de errores con `.catch()` para evitar que errores no manejados dejen el estado en `true`

---

## 🐛 PROBLEMAS POTENCIALES RESTANTES

### 1. Redirección con `window.location.href`

**Problema:** En la línea 449, se usa `window.location.href` para redirigir cuando se crea una reserva desde parámetros. Esto puede causar que:
- El componente se desmonte y monte de nuevo
- Los parámetros sean los mismos
- El `useEffect` se ejecute de nuevo
- Entre en bucle si `hasLoadedRef` no se maneja correctamente

**Solución Implementada:**
- Se limpia `hasLoadedRef.current = null` antes de redirigir
- Se resetea `isLoadingRef.current = false`
- Se usa `window.location.href` para forzar recarga completa

---

### 2. Caché de Disponibilidad

**Problema:** El caché puede estar devolviendo datos incorrectos o desactualizados.

**Solución:** El caché se limpia automáticamente cuando se crea una nueva reserva.

---

## 📊 FLUJO ESPERADO (Después de Correcciones)

```
1. Usuario accede a /checkout?id=...&propertyId=...&checkIn=...&checkOut=...
   ↓
2. useEffect se ejecuta (solo una vez para esta URL)
   ↓
3. Se calcula loadKey = "6954e9a62f77822bca5c8202"
   ↓
4. hasLoadedRef.current !== loadKey → TRUE (primera vez)
   ↓
5. isLoadingRef.current = false → TRUE (no está cargando)
   ↓
6. Se marca: hasLoadedRef.current = loadKey, isLoadingRef.current = true
   ↓
7. Se llama loadCheckoutData()
   ↓
8. loadCheckoutData() detecta parámetros en URL
   ↓
9. Usa fallback directo (más rápido)
   ↓
10. Carga propiedad desde API
   ↓
11. Crea checkoutData desde parámetros
   ↓
12. setProperty(), setCheckoutData()
   ↓
13. setIsLoading(false), isLoadingRef.current = false
   ↓
14. ✅ Página muestra checkout (no más loading)
```

---

## 🔍 CÓMO VERIFICAR EL PROBLEMA

### 1. Abrir DevTools Console

Verás logs como:
```
🔄 [CHECKOUT] useEffect ejecutado {...}
🔑 [CHECKOUT] Load key calculada: 6954e9a62f77822bca5c8202
✅ [CHECKOUT] Condiciones cumplidas, iniciando carga...
🚀 [CHECKOUT] loadCheckoutData INICIADO {...}
✅ [CHECKOUT] Parámetros encontrados en URL, usando fallback directo...
✅ [CHECKOUT] Checkout cargado desde parámetros de URL (fallback) - COMPLETADO
✅ [CHECKOUT] loadCheckoutData completado exitosamente
🏁 [CHECKOUT] loadCheckoutData finally - reseteando isLoadingRef
```

### 2. Si hay Bucle, verás:

```
🔄 [CHECKOUT] useEffect ejecutado {...} (repetido múltiples veces)
⏭️ [CHECKOUT] Condiciones NO cumplidas, saltando carga: { keysMatch: true }
```

**Esto indica:** El efecto se ejecuta pero no carga porque `hasLoadedRef.current === loadKey`.

### 3. Si `loadCheckoutData` no termina:

```
🚀 [CHECKOUT] loadCheckoutData INICIADO {...}
(No hay más logs después)
```

**Esto indica:** `loadCheckoutData` se quedó colgado en alguna petición.

---

## ✅ CHECKLIST DE VERIFICACIÓN

Al probar la URL problemática, verifica en la consola:

- [ ] ¿El `useEffect` se ejecuta solo UNA vez?
- [ ] ¿`loadCheckoutData` se completa (ve el log "COMPLETADO")?
- [ ] ¿`isLoadingRef` se resetea a `false`?
- [ ] ¿`setIsLoading(false)` se llama?
- [ ] ¿La página muestra el checkout (no el spinner)?

---

## 🎯 PRÓXIMOS PASOS SI PERSISTE EL PROBLEMA

1. **Revisar logs en consola:**
   - Identificar qué condición falla
   - Ver si `loadCheckoutData` se completa
   - Verificar si hay errores no manejados

2. **Verificar Network Tab:**
   - Ver si hay peticiones que se quedan colgadas
   - Verificar tiempos de respuesta
   - Identificar peticiones duplicadas

3. **Verificar Estado del Componente:**
   - Ver si `property` y `checkoutData` se establecen
   - Verificar si `isLoading` se resetea a `false`

---

**Última actualización:** 31 de Diciembre de 2024  
**Estado:** 🔧 Correcciones implementadas - Requiere testing

