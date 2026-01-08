# 📝 Instrucciones: Actualizar Propiedades de Prueba

## 🎯 Objetivo
Reescribir automáticamente los títulos y descripciones de propiedades que tienen títulos de prueba (como "casa test stripe") con títulos y descripciones profesionales estilo Airbnb.

---

## 🚀 Método 1: Desde la Consola del Navegador (Recomendado)

### Paso 1: Iniciar Sesión como Administrador
1. Abre `http://localhost:3001/login`
2. Inicia sesión con tus credenciales de administrador
3. Verifica que estés en el panel de administración

### Paso 2: Abrir Consola del Navegador
1. Presiona `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. Ve a la pestaña **"Console"**

### Paso 3: Ejecutar el Script
1. Abre el archivo `scripts/update-test-properties-browser.js`
2. **Copia TODO el contenido** del archivo
3. **Pega** en la consola del navegador
4. Presiona **Enter**
5. Espera a que se ejecute (verás mensajes en la consola)

### Paso 4: Verificar Resultados
- El script mostrará un resumen de las propiedades actualizadas
- Navega a `/admin/properties` para ver los cambios
- O visita una propiedad actualizada para verificar el nuevo título y descripción

---

## 🖥️ Método 2: Desde Node.js (Terminal)

### Requisitos
- Node.js instalado
- Estar autenticado (el script usará el token del sessionStorage si está disponible)

### Ejecutar
```bash
npx tsx scripts/update-test-properties.ts
```

---

## 📋 ¿Qué hace el script?

1. **Busca todas las propiedades** en la base de datos
2. **Identifica propiedades de prueba** que contengan palabras clave:
   - "test"
   - "stripe"
   - "prueba"
   - "demo"
   - "ejemplo"
3. **Actualiza cada propiedad** con:
   - Un título profesional (ej: "Villa con Piscina Privada en Maspalomas")
   - Una descripción detallada y profesional estilo Airbnb
   - Mantiene la ubicación original de la propiedad

---

## 🏠 Plantillas de Propiedades Profesionales

El script usa 5 plantillas diferentes basadas en ubicaciones de Canarias:

1. **Villa con Piscina Privada en Maspalomas**
   - Descripción de villa de lujo con todas las comodidades

2. **Apartamento Moderno con Vista al Mar en Las Palmas**
   - Descripción de apartamento contemporáneo con vistas

3. **Casa Tradicional Canaria con Encanto en Teguise**
   - Descripción de casa tradicional restaurada

4. **Villa de Lujo con Piscina Infinita en Costa Teguise**
   - Descripción de villa exclusiva con piscina infinita

5. **Apartamento Acogedor en el Centro Histórico de Arrecife**
   - Descripción de apartamento en zona histórica

Cada propiedad de prueba se actualizará con una de estas plantillas seleccionada aleatoriamente.

---

## ✅ Ejemplo de Salida

```
🔍 Buscando propiedades con títulos de prueba...
📋 Encontradas 25 propiedades
🎯 Encontradas 3 propiedades con títulos de prueba

🔄 Actualizando: "casa test stripe"
   Nuevo título: "Villa con Piscina Privada en Maspalomas"
   ✅ Actualizada exitosamente

🔄 Actualizando: "propiedad prueba"
   Nuevo título: "Apartamento Moderno con Vista al Mar en Las Palmas"
   ✅ Actualizada exitosamente

📊 RESUMEN DE ACTUALIZACIONES:
==================================================
✅ Exitosas: 3
❌ Fallidas: 0

Detalles:
1. ✅ "casa test stripe" → "Villa con Piscina Privada en Maspalomas"
2. ✅ "propiedad prueba" → "Apartamento Moderno con Vista al Mar en Las Palmas"
3. ✅ "test demo" → "Casa Tradicional Canaria con Encanto en Teguise"
```

---

## ⚠️ Notas Importantes

1. **Backup**: Aunque el script mantiene la ubicación original, es recomendable hacer un backup de las propiedades antes de ejecutar el script.

2. **Autenticación**: Debes estar logueado como administrador para que el script funcione.

3. **Ubicación**: El script mantiene la ubicación original de cada propiedad. Solo actualiza título y descripción.

4. **Palabras clave**: Si una propiedad tiene "test" o "stripe" en el título, será actualizada. Si quieres excluir alguna propiedad, cambia su título antes de ejecutar el script.

5. **Velocidad**: El script hace una pausa de 500ms entre cada actualización para no sobrecargar el servidor.

---

## 🔧 Personalización

Si quieres modificar las plantillas o agregar más:

1. Edita el archivo `scripts/update-test-properties-browser.js`
2. Modifica el array `PROFESSIONAL_PROPERTIES`
3. Agrega o modifica las plantillas según necesites

---

## ❓ Solución de Problemas

### Error: "No hay sesión"
- **Solución**: Asegúrate de estar logueado antes de ejecutar el script

### Error: "No se encontró el token"
- **Solución**: Cierra sesión y vuelve a iniciar sesión

### Error: "Error al buscar propiedades"
- **Solución**: Verifica que el backend esté corriendo en `http://localhost:3000`

### No se actualizan propiedades
- **Solución**: Verifica que los títulos contengan alguna de las palabras clave: "test", "stripe", "prueba", "demo", "ejemplo"

---

## 📞 Soporte

Si tienes problemas ejecutando el script, verifica:
1. ✅ Estás logueado como administrador
2. ✅ El backend está corriendo
3. ✅ Tienes conexión a internet
4. ✅ Los títulos de las propiedades contienen palabras clave de prueba
