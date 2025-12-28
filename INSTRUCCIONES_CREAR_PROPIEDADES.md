# 📝 Instrucciones: Crear 5 Propiedades de Prueba

## Método 1: Desde la Consola del Navegador (Recomendado)

### Paso 1: Iniciar Sesión
1. Abre `http://localhost:3001/login`
2. Ingresa las credenciales:
   - **Email:** `armandito@gmail.com`
   - **Password:** `Pecholobo33`
3. Haz clic en "Iniciar sesión"
4. Verifica que te redirija al panel de administración

### Paso 2: Abrir Consola del Navegador
1. Presiona `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. Ve a la pestaña "Console"

### Paso 3: Ejecutar Script
1. Copia todo el contenido del archivo `scripts/create-properties-direct.js`
2. Pega en la consola
3. Presiona Enter
4. Espera a que se creen las 5 propiedades

### Paso 4: Verificar Resultados
- El script mostrará un resumen en la consola
- Navega a `/admin/properties` para ver las propiedades creadas

---

## Método 2: Manualmente desde el Panel

### Paso 1: Acceder al Panel
1. Inicia sesión como administrador
2. Navega a `/admin/properties`
3. Haz clic en "Nueva Propiedad"

### Paso 2: Completar Formulario
Para cada propiedad, completa:

**Información Básica:**
- Título: (ver propiedades de prueba abajo)
- Descripción: (ver propiedades de prueba abajo)
- Tipo de Propiedad: Selecciona según la propiedad
- Tipo de Alojamiento: Selecciona según la propiedad

**Ubicación:**
- Ciudad: (ver propiedades de prueba abajo)
- País: España
- Región: (opcional)
- Dirección: (opcional)
- Coordenadas: (ver propiedades de prueba abajo)

**Precios:**
- Precio Base: (ver propiedades de prueba abajo)
- Tarifa de Limpieza: (opcional)
- Tarifa de Servicio: (opcional)

**Capacidad:**
- Huéspedes, Habitaciones, Camas, Baños: (ver propiedades de prueba abajo)

**Amenidades:**
- Selecciona las amenidades disponibles

**Disponibilidad:**
- Noches mínimas: 2-3
- Noches máximas: 14-90
- Reserva instantánea: (opcional)

**Imágenes:**
- Agrega al menos una URL de imagen

### Paso 3: Guardar
1. Haz clic en "Guardar Propiedad"
2. Espera la confirmación
3. Repite para las otras 4 propiedades

---

## 📋 Datos de las 5 Propiedades de Prueba

### Propiedad 1: Villa de Lujo en Marbella
```json
{
  "title": "Villa de Lujo con Piscina en Marbella",
  "description": "Hermosa villa moderna con piscina privada, vistas al mar y todas las comodidades. Perfecta para familias o grupos grandes.",
  "location": {
    "city": "Marbella",
    "country": "España",
    "region": "Andalucía",
    "address": "Calle del Mar, 123",
    "coordinates": { "lat": 36.5109, "lng": -4.8862 }
  },
  "propertyType": "entire_place",
  "roomType": "villa",
  "pricing": { "basePrice": 250, "currency": "EUR", "cleaningFee": 50, "serviceFee": 30 },
  "capacity": { "guests": 8, "bedrooms": 4, "beds": 5, "bathrooms": 3 },
  "amenities": ["wifi", "kitchen", "pool", "ac", "parking", "beach_access", "tv", "heating"],
  "availability": { "minNights": 3, "maxNights": 30, "instantBook": true, "checkInTime": "15:00", "checkOutTime": "11:00" },
  "images": [
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
  ]
}
```

### Propiedad 2: Apartamento en Madrid
```json
{
  "title": "Apartamento Moderno en el Centro de Madrid",
  "description": "Acogedor apartamento completamente renovado en el corazón de Madrid. Cerca de los principales puntos de interés.",
  "location": {
    "city": "Madrid",
    "country": "España",
    "region": "Comunidad de Madrid",
    "address": "Calle Gran Vía, 45",
    "coordinates": { "lat": 40.4168, "lng": -3.7038 }
  },
  "propertyType": "entire_place",
  "roomType": "apartment",
  "pricing": { "basePrice": 120, "currency": "EUR", "cleaningFee": 25, "serviceFee": 20 },
  "capacity": { "guests": 4, "bedrooms": 2, "beds": 2, "bathrooms": 1 },
  "amenities": ["wifi", "kitchen", "ac", "tv", "workspace", "heating"],
  "availability": { "minNights": 2, "maxNights": 90, "instantBook": true, "checkInTime": "14:00", "checkOutTime": "11:00" },
  "images": [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    "https://images.unsplash.com/photo-1502672260256-1c1ef2d93688?w=800"
  ]
}
```

### Propiedad 3: Casa Rústica en Pirineos
```json
{
  "title": "Casa Rústica en la Montaña - Pirineos",
  "description": "Encantadora casa de piedra restaurada en los Pirineos. Rodeada de naturaleza, perfecta para desconectar.",
  "location": {
    "city": "Jaca",
    "country": "España",
    "region": "Aragón",
    "address": "Carretera de la Montaña, km 12",
    "coordinates": { "lat": 42.5700, "lng": -0.5500 }
  },
  "propertyType": "entire_place",
  "roomType": "cottage",
  "pricing": { "basePrice": 95, "currency": "EUR", "cleaningFee": 30, "serviceFee": 15 },
  "capacity": { "guests": 6, "bedrooms": 3, "beds": 4, "bathrooms": 2 },
  "amenities": ["wifi", "kitchen", "fireplace", "heating", "mountain_view", "parking", "garden"],
  "availability": { "minNights": 2, "maxNights": 60, "instantBook": false, "checkInTime": "16:00", "checkOutTime": "10:00" },
  "images": [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
  ]
}
```

### Propiedad 4: Loft en Barcelona
```json
{
  "title": "Loft Industrial en Barcelona - El Born",
  "description": "Espacioso loft en el barrio más trendy de Barcelona. Diseño industrial con techos altos y decoración moderna.",
  "location": {
    "city": "Barcelona",
    "country": "España",
    "region": "Cataluña",
    "address": "Calle del Born, 28",
    "coordinates": { "lat": 41.3851, "lng": 2.1734 }
  },
  "propertyType": "entire_place",
  "roomType": "loft",
  "pricing": { "basePrice": 180, "currency": "EUR", "cleaningFee": 40, "serviceFee": 25 },
  "capacity": { "guests": 4, "bedrooms": 1, "beds": 2, "bathrooms": 1 },
  "amenities": ["wifi", "kitchen", "ac", "tv", "workspace", "balcony", "heating"],
  "availability": { "minNights": 2, "maxNights": 30, "instantBook": true, "checkInTime": "15:00", "checkOutTime": "11:00" },
  "images": [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    "https://images.unsplash.com/photo-1502672260256-1c1ef2d93688?w=800"
  ]
}
```

### Propiedad 5: Cabaña junto al Lago
```json
{
  "title": "Cabaña Acogedora junto al Lago",
  "description": "Pequeña cabaña de madera con encanto junto a un lago tranquilo. Perfecta para una escapada romántica.",
  "location": {
    "city": "Sanabria",
    "country": "España",
    "region": "Castilla y León",
    "address": "Lago de Sanabria, Zona Norte",
    "coordinates": { "lat": 42.1234, "lng": -6.7890 }
  },
  "propertyType": "entire_place",
  "roomType": "cabin",
  "pricing": { "basePrice": 75, "currency": "EUR", "cleaningFee": 20, "serviceFee": 15 },
  "capacity": { "guests": 2, "bedrooms": 1, "beds": 1, "bathrooms": 1 },
  "amenities": ["wifi", "kitchen", "fireplace", "heating", "mountain_view", "bbq", "garden"],
  "availability": { "minNights": 2, "maxNights": 14, "instantBook": false, "checkInTime": "15:00", "checkOutTime": "11:00" },
  "images": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
  ]
}
```

---

## ✅ Verificación

Después de crear las propiedades:

1. ✅ Navega a `/admin/properties`
2. ✅ Verifica que aparezcan las 5 propiedades en la lista
3. ✅ Prueba hacer clic en "Ver detalles" (ojo) de una propiedad
4. ✅ Prueba hacer clic en "Editar" (lápiz) de una propiedad
5. ✅ Prueba editar y guardar cambios
6. ✅ Prueba la búsqueda de propiedades

---

**Nota:** Si el backend no está disponible, las propiedades no se crearán pero el código está listo para cuando el backend funcione.

