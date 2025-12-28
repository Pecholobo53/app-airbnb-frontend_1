# 🔍 GUÍA: Cómo Revisar los Logs para Identificar el Campo Problemático

## 📋 LOGS MEJORADOS IMPLEMENTADOS

He agregado logs **MUY DETALLADOS** en todo el flujo de creación de propiedades para identificar exactamente qué campo está causando el error.

## 🔍 DÓNDE REVISAR LOS LOGS

### 1. **Consola del Navegador (F12 → Console)**

Cuando intentes crear una propiedad, verás estos logs en orden:

#### **A. Antes de Enviar (Formulario)**
```
🔍 [FORM] Verificación detallada antes de enviar:
  📍 location: { exists: true, city: "...", country: "...", ... }
  💰 pricing: { exists: true, basePrice: 100, currency: "EUR", ... }
  👥 capacity: { exists: true, guests: 2, bedrooms: 1, ... }
  📅 availability: { exists: true, minNights: 1, maxNights: 365, ... }
```

#### **B. En el Servicio (PropertyService)**
```
🔍 [PROPERTY SERVICE] Validando datos antes de enviar: { ... }
✅ [PROPERTY SERVICE] Verificación final del JSON serializado:
  📍 location: { exists: true, type: "object", keys: [...], ... }
  📍 location.coordinates: { exists: true, lat: 40.4168, lng: -3.7038, ... }
  💰 pricing: { exists: true, basePrice: 100, currency: "EUR", ... }
  ...
```

#### **C. Si hay Error 400 (MUY DETALLADO)**
```
🔴 [PROPERTY SERVICE] ========== ERROR 400 DETALLADO ==========
📋 [PROPERTY SERVICE] Respuesta completa del servidor: { ... }
📋 [PROPERTY SERVICE] Mensaje de error completo: "Invalid input: expected object, received undefined"
🔍 [PROPERTY SERVICE] PROBLEMA DETECTADO: Campo undefined detectado
🔍 [PROPERTY SERVICE] Campo problemático: [nombre del campo]

📤 [PROPERTY SERVICE] Payload enviado (completo): { ... }
🔍 [PROPERTY SERVICE] Verificación de objetos en payload:
  - location: true, ["city", "country", "coordinates"]
  - location.coordinates: { lat: 40.4168, lng: -3.7038 }
  - pricing: true, ["basePrice", "currency"]
  - capacity: true, ["guests", "bedrooms", "beds", "bathrooms"]
  - availability: true, ["minNights", "maxNights", "instantBook"]

⚠️ [PROPERTY SERVICE] CAMPOS UNDEFINED ENCONTRADOS EN PAYLOAD: [lista de campos]
```

## 🎯 QUÉ BUSCAR EN LOS LOGS

### **1. Campo Undefined en el Payload**

Busca esta línea:
```
⚠️ [PROPERTY SERVICE] CAMPOS UNDEFINED ENCONTRADOS EN PAYLOAD: [...]
```

**Ejemplo:**
```
⚠️ [PROPERTY SERVICE] CAMPOS UNDEFINED ENCONTRADOS EN PAYLOAD: ["location.region", "pricing.cleaningFee"]
```

Esto te dice **exactamente** qué campos están `undefined` en el payload que se envía.

### **2. Campo Problemático del Backend**

Busca esta línea:
```
🔍 [PROPERTY SERVICE] Campo problemático: location.coordinates
```

O revisa el mensaje de error completo:
```
📋 [PROPERTY SERVICE] Mensaje de error completo: "Invalid input: expected object, received undefined at 'location.coordinates'"
```

### **3. Verificación de Objetos**

Revisa que todos los objetos requeridos estén presentes:
- ✅ `location` debe existir y ser objeto
- ✅ `location.coordinates` debe existir y ser objeto
- ✅ `pricing` debe existir y ser objeto
- ✅ `capacity` debe existir y ser objeto
- ✅ `availability` debe existir y ser objeto

Si alguno dice `exists: false` o `type: "undefined"`, **ese es el problema**.

## 📝 PASOS PARA IDENTIFICAR EL ERROR

1. **Abre la consola del navegador** (F12 → Console)
2. **Intenta crear una propiedad**
3. **Busca los logs que empiezan con:**
   - `🔍 [FORM] Verificación detallada antes de enviar`
   - `✅ [PROPERTY SERVICE] Verificación final del JSON serializado`
   - `🔴 [PROPERTY SERVICE] ========== ERROR 400 DETALLADO ==========`

4. **Copia TODOS los logs** desde el inicio hasta el error
5. **Busca específicamente:**
   - `⚠️ CAMPOS UNDEFINED ENCONTRADOS`
   - `🔍 Campo problemático:`
   - `exists: false` o `type: "undefined"`

## 🔧 EJEMPLO DE LOGS ESPERADOS

### ✅ **Logs Correctos (Sin Errores)**
```
🔍 [FORM] Verificación detallada antes de enviar:
  📍 location: { exists: true, city: "Madrid", country: "España", hasCoordinates: true, ... }
  💰 pricing: { exists: true, basePrice: 100, currency: "EUR", ... }
  👥 capacity: { exists: true, guests: 2, bedrooms: 1, ... }
  📅 availability: { exists: true, minNights: 1, maxNights: 365, ... }

✅ [PROPERTY SERVICE] Verificación final del JSON serializado:
  📍 location: { exists: true, type: "object", keys: ["city", "country", "coordinates"], ... }
  📍 location.coordinates: { exists: true, lat: 40.4168, lng: -3.7038 }
  ...
✅ [PROPERTY SERVICE] No se encontraron campos undefined en el JSON serializado
```

### ❌ **Logs con Error**
```
🔍 [FORM] Verificación detallada antes de enviar:
  📍 location: { exists: true, ... }
  📍 location.coordinates: { exists: false, type: "undefined" }  ← PROBLEMA AQUÍ

🔴 [PROPERTY SERVICE] ========== ERROR 400 DETALLADO ==========
📋 [PROPERTY SERVICE] Mensaje de error completo: "Invalid input: expected object, received undefined"
🔍 [PROPERTY SERVICE] Campo problemático: location.coordinates

⚠️ [PROPERTY SERVICE] CAMPOS UNDEFINED ENCONTRADOS EN PAYLOAD: ["location.coordinates"]
```

## 🎯 ACCIÓN INMEDIATA

**Cuando veas el error, copia y pega aquí:**
1. Todos los logs que empiezan con `🔍 [FORM]`
2. Todos los logs que empiezan con `✅ [PROPERTY SERVICE]`
3. Todos los logs que empiezan con `🔴 [PROPERTY SERVICE]`
4. Especialmente la línea que dice `⚠️ CAMPOS UNDEFINED ENCONTRADOS`

Con esa información podré identificar **exactamente** qué campo está causando el problema y corregirlo.

---

**Nota:** Los logs están diseñados para ser **muy verbosos** y mostrar **todo** lo que está pasando. No te preocupes si hay muchos logs, eso es intencional para poder diagnosticar el problema.

