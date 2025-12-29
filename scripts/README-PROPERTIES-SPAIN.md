# 📋 Script de Actualización y Creación de Propiedades en España

Este script actualiza las propiedades existentes y crea 21 nuevas propiedades distribuidas en 7 provincias españolas.

## 🎯 Objetivo

- **Actualizar propiedades existentes**: Cambiar fotos (3 por cada una, sin repetir) y mejorar descripciones
- **Crear 21 nuevas propiedades**: 3 por cada provincia (Sevilla, Málaga, Madrid, Galicia, Las Palmas, Tenerife, Lanzarote)
- **Garantizar imágenes únicas**: Sistema de tracking para evitar repeticiones
- **Descripciones detalladas**: Textos al estilo Airbnb, específicos por ciudad y tipo

## 📍 Provincias y Propiedades

| Provincia | Propiedades | Tipos |
|-----------|-------------|-------|
| **Sevilla** | 3 | Apartamento, Casa, Villa |
| **Málaga** | 3 | Apartamento, Casa, Villa |
| **Madrid** | 3 | Apartamento, Casa, Loft |
| **Galicia** | 3 | Cabaña, Casa, Cottage |
| **Las Palmas** | 3 | Apartamento, Casa, Villa |
| **Tenerife** | 3 | Apartamento, Casa, Villa |
| **Lanzarote** | 3 | Cabaña, Casa, Villa |

**Total: 21 nuevas propiedades**

## 🚀 Cómo Ejecutar

### Paso 1: Obtener Token de Autenticación

1. Inicia sesión en la aplicación como administrador
2. Abre la consola del navegador (F12)
3. Ejecuta el siguiente comando:
```javascript
JSON.parse(sessionStorage.getItem("airbnb_session")).accessToken
```
4. Copia el token que aparece

### Paso 2: Ejecutar el Script

```bash
# Con el token obtenido
AUTH_TOKEN=tu_token_aqui npx tsx scripts/update-and-create-properties-spain.ts
```

**Ejemplo:**
```bash
AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... npx tsx scripts/update-and-create-properties-spain.ts
```

### Paso 3: Verificar Resultados

El script mostrará:
- ✅ Propiedades actualizadas exitosamente
- ✅ Propiedades creadas exitosamente
- ❌ Errores (si los hay)
- 📸 Total de imágenes únicas utilizadas

## 📝 Características del Script

### 1. Actualización de Propiedades Existentes
- Obtiene todas las propiedades existentes vía API
- Actualiza cada una con:
  - 3 nuevas fotos únicas (según el tipo)
  - Descripción mejorada y detallada

### 2. Creación de Nuevas Propiedades
- 21 propiedades con datos completos:
  - Títulos descriptivos
  - Descripciones detalladas al estilo Airbnb
  - Ubicaciones con coordenadas precisas
  - Precios variados (75€ - 375€/noche)
  - Capacidades diversas (2-10 huéspedes)
  - Amenidades apropiadas por tipo
  - 3 fotos únicas por propiedad

### 3. Sistema de Imágenes Únicas
- Pool de imágenes organizadas por categoría
- Tracking de imágenes usadas
- Garantiza que no se repitan fotos entre propiedades

### 4. Descripciones Detalladas
- Descripciones específicas por ciudad (Sevilla, Málaga, Madrid)
- Descripciones genéricas mejoradas para otras ciudades
- Textos al estilo Airbnb: detallados, auténticos y acogedores

## ⚙️ Configuración

### Variables de Entorno

- `AUTH_TOKEN`: Token de autenticación (requerido)
- `NEXT_PUBLIC_API_URL`: URL de la API (por defecto: `http://localhost:3000`)

### Estructura de Datos

Cada propiedad incluye:
- `title`: Título descriptivo
- `description`: Descripción detallada
- `location`: Ciudad, región, dirección, coordenadas
- `propertyType`: `entire_place`
- `roomType`: `apartment`, `house`, `villa`, `cabin`, `cottage`, `loft`
- `pricing`: Precio base, moneda, tasas
- `capacity`: Huéspedes, habitaciones, camas, baños
- `amenities`: Lista de comodidades
- `availability`: Noches mínimas/máximas, check-in/out
- `images`: Array de 3 URLs de imágenes únicas

## 🔍 Verificación

Después de ejecutar el script, verifica:

1. **En el panel de administración**: Ver que las propiedades existentes tienen nuevas fotos
2. **En la base de datos**: Confirmar que se crearon las 21 nuevas propiedades
3. **En la búsqueda**: Verificar que todas las propiedades aparecen correctamente
4. **Imágenes**: Confirmar que no hay imágenes repetidas

## ⚠️ Notas Importantes

- El script incluye delays de 500ms entre peticiones para evitar rate limiting
- Si hay errores, el script continuará con las siguientes propiedades
- Las imágenes son de Unsplash (URLs públicas)
- Todas las descripciones están en español
- Los precios están en EUR (Euros)

## 🐛 Solución de Problemas

### Error: "No se encontró token de autenticación"
- Asegúrate de haber iniciado sesión como administrador
- Verifica que el token esté correctamente copiado
- El token debe estar en el formato: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Error: "Rate limiting" o "Demasiadas peticiones"
- El script ya incluye delays, pero si persiste:
- Espera unos minutos y vuelve a ejecutar
- El script puede continuar desde donde se quedó

### Error: "Propiedad no encontrada" al actualizar
- Algunas propiedades pueden haber sido eliminadas
- El script continuará con las siguientes

## 📊 Resultados Esperados

Después de una ejecución exitosa:

```
🔄 PROPIEDADES ACTUALIZADAS:
   ✅ Exitosas: X/Y
   ❌ Fallidas: 0/Y

🆕 PROPIEDADES CREADAS:
   ✅ Exitosas: 21/21
   ❌ Fallidas: 0/21

📸 IMÁGENES UTILIZADAS:
   Total: 63+ imágenes únicas (3 por propiedad)
```

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs del script
2. Verifica que el backend esté corriendo
3. Confirma que tienes permisos de administrador
4. Revisa la consola del navegador para obtener el token correcto

