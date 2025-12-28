# 🔍 INSTRUCCIONES: Cómo Expandir los Errores en la Consola

## 🎯 OBJETIVO

Necesito ver **exactamente** qué campo está causando el error "expected object, received undefined". Los arrays de errores están colapsados en la consola y necesito que los expandas.

## 📋 PASOS PARA VER EL ERROR COMPLETO

### **Paso 1: Abre la Consola del Navegador**
1. Presiona `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. Ve a la pestaña **"Console"**

### **Paso 2: Intenta Crear la Propiedad**
1. Llena el formulario de creación de propiedad
2. Haz clic en "Guardar Propiedad"
3. Espera a que aparezcan los errores en la consola

### **Paso 3: Busca Estos Logs Específicos**

Busca y **EXPANDE** (haz clic en la flecha ▶) estos logs:

#### **A. Log de Errores de Validación del Servidor**
```
📋 [PROPERTY SERVICE] Errores de validación del servidor (COMPLETO): Array(1)
```

**Haz clic en la flecha** para expandir el array y ver:
- `[0]` - El primer error
- Dentro de ese error, busca:
  - `path` - El campo que está causando el problema
  - `message` - El mensaje de error
  - `expected` - Qué tipo esperaba el backend
  - `received` - Qué tipo recibió

#### **B. Log de Detalles del Error**
```
📋 [PROPERTY SERVICE] Detalles del error (data.error.details): Array(1)
```

**Expande este array** para ver los detalles completos.

#### **C. Log de Respuesta Completa del Servidor**
```
🔴 [PROPERTY SERVICE] Respuesta completa del servidor: { ... }
```

**Expande este objeto** y busca:
- `error.details` - Array con los errores específicos
- `error.message` - Mensaje completo del error
- `errors` - Array alternativo de errores

### **Paso 4: Copia la Información Completa**

**Copia y pega aquí:**

1. **El log completo de `📋 [PROPERTY SERVICE] Errores de validación del servidor (COMPLETO)`** - Debe mostrar el JSON completo del array
2. **El log de `📋 [PROPERTY SERVICE] Detalle 1:`** - Debe mostrar el campo específico
3. **El log de `🔴 CAMPO PROBLEMÁTICO:`** - Debe mostrar el path del campo
4. **Cualquier log que diga `🔴 CAMPO EN DETAILS:`**

## 🎯 EJEMPLO DE LO QUE NECESITO

En lugar de esto (colapsado):
```
📋 [PROPERTY SERVICE] Errores de validación del servidor: Array(1)
  [0]: {…}
```

Necesito esto (expandido):
```
📋 [PROPERTY SERVICE] Errores de validación del servidor: Array(1)
  [0]: {
    path: ["location", "coordinates"],
    message: "Invalid input: expected object, received undefined",
    expected: "object",
    received: "undefined"
  }
```

## ⚠️ SI NO PUEDES EXPANDIR

Si los arrays no se expanden, **copia el log completo** que dice:
```
📋 [PROPERTY SERVICE] Errores de validación del servidor (COMPLETO): ...
```

Ese log debería mostrar el JSON completo del array de errores.

---

**Una vez que tengas esa información, pégala aquí y podré identificar exactamente qué campo está causando el problema y corregirlo.**

