# 🚀 Quick Start - Módulo de Búsqueda

## ⚡ Inicio Rápido (5 minutos)

### 1️⃣ Iniciar el Servidor

```bash
npm run dev
```

Abre: `http://localhost:3000`

---

## 🧪 Pruebas Rápidas

### 🔍 Búsqueda desde Home

1. **Scroll hasta "¿A dónde quieres ir?"**
2. **Ubicación**: Escribe "Barc" → Verás autocompletado
   - Selecciona "Barcelona, España"
3. **Fechas**: Click en selector
   - Selecciona check-in: Mañana
   - Selecciona check-out: +7 días
   - Verás "7 noches" calculado
4. **Huéspedes**: Click en contador
   - Incrementa adultos a 2
   - (Opcional) Añade 1 niño
5. **Click en botón rojo 🔍**

✅ Deberías ver resultados de Barcelona en `/buscar`

---

### 🎛️ Filtros Avanzados

1. **En `/buscar`**, click en botón "Filtros"
2. **Panel lateral se abre**
3. Prueba estos filtros:

#### Precio
- Mueve el slider a: **€50 - €150**
- Observa los precios se actualizan al cerrar

#### Tipo de Propiedad
- Selecciona: **"Alojamiento completo"**
- Verás propiedades filtradas

#### Amenidades
- Marca: **WiFi, Piscina**
- Solo propiedades con ambas aparecen

#### Calificación
- Click: **4.5+**
- Solo propiedades bien valoradas

4. **Click "Aplicar filtros"**

✅ Resultados filtrados correctamente

---

### 📊 Ordenamiento

En `/buscar`, click en dropdown de ordenamiento:

1. **"Precio: menor a mayor"**
   - Verifica: Primera propiedad es la más barata
   
2. **"Precio: mayor a menor"**
   - Verifica: Primera propiedad es la más cara

3. **"Mejor valorados"**
   - Verifica: Primera propiedad tiene rating más alto

---

### 🏠 Property Cards

Cada tarjeta tiene estas funcionalidades:

1. **Carrusel de Imágenes**
   - Hover sobre la imagen
   - Flechas ← → aparecen
   - Click para navegar imágenes
   - Puntos abajo indican imagen actual

2. **Favoritos** ❤️
   - Click en corazón (esquina superior derecha)
   - **Sin login**: Muestra error "Debes iniciar sesión"
   - **Con login**: Añade/quita de favoritos

3. **Badges**
   - 🏆 **Destacado**: Propiedades featured
   - ⚡ **Instantánea**: Reserva sin aprobación

4. **Info Visible**
   - Rating ⭐ y número de reviews
   - Ubicación (ciudad, país)
   - Capacidad (huéspedes, habitaciones)
   - Precio por noche

---

### 🎨 QuickFilters (Home)

1. **Scroll en home hasta "Busca por tipo"**
2. **8 categorías disponibles**:
   - 🏠 Casas
   - 🏢 Apartamentos
   - 🏰 Villas
   - 🏖️ Playa
   - ⛰️ Montaña
   - 🌲 Cabañas
   - 🌴 Tropical
   - ⛺ Aventura

3. **Click en "Villas"**
   - Redirige a `/buscar?propertyType=villa`
   - Muestra solo villas

---

## 🧪 Test Completo (15 minutos)

### Escenario: Familia planea vacaciones en Barcelona

#### Paso 1: Búsqueda Inicial
```
Ubicación: Barcelona
Check-in: Próximo lunes
Check-out: Próximo lunes + 5 días
Huéspedes: 2 adultos, 2 niños
```

✅ Debería mostrar ~8 propiedades en Barcelona

#### Paso 2: Aplicar Filtros
```
Precio: €80-€180
Tipo: Alojamiento completo
Habitaciones: 2+
Amenidades: WiFi, Cocina, Piscina
Calificación: 4.5+
```

✅ Resultados reducidos, todos cumplen criterios

#### Paso 3: Ordenar
```
Ordenar por: "Precio: menor a mayor"
```

✅ Primera propiedad es la más barata que cumple filtros

#### Paso 4: Explorar Propiedad
```
1. Ver imágenes (carrusel)
2. Revisar amenidades
3. Ver rating y reviews
4. Añadir a favoritos (requiere login)
```

✅ Toda la información visible y correcta

---

## 🔧 Datos de Testing

### Ubicaciones Disponibles (25)

**España** (8):
- Barcelona, Madrid, Valencia, Sevilla
- Málaga, Bilbao, Granada, Marbella

**Europa** (17):
- Lisboa, Porto (Portugal)
- París, Lyon, Marsella, Niza (Francia)
- Roma, Florencia, Venecia, Milán (Italia)
- Londres, Edimburgo (UK)
- Berlín, Múnich (Alemania)
- Ámsterdam, Rotterdam (Países Bajos)

### Propiedades Mock (20)

**Rango de precios**: €35 - €450/noche

**Ciudades con más propiedades**:
- Barcelona: 3 propiedades
- Madrid: 2 propiedades
- Lisboa: 2 propiedades

**Tipos disponibles**:
- 🏠 Casas: 3
- 🏢 Apartamentos: 10
- 🏰 Villas: 2
- 🏙️ Lofts: 3
- 🏔️ Cabañas: 2

### Filtros Testables

**Precio**:
- Económico: €35-€60
- Medio: €85-€130
- Premium: €175-€320
- Lujo: €450+

**Amenidades** (12):
- WiFi (casi todas)
- Cocina (mayoría)
- Piscina (5 propiedades)
- Aire acondicionado (mayoría)
- Estacionamiento (10 propiedades)
- Playa (3 propiedades)
- Vista montaña (1 propiedad)

**Calificaciones**:
- 5.0: 1 propiedad
- 4.9: 5 propiedades
- 4.8: 4 propiedades
- 4.7: 3 propiedades
- 4.5-4.6: resto

---

## 🐛 Troubleshooting

### No aparecen sugerencias de ubicación
**Problema**: Escribes en ubicación pero no hay dropdown

**Solución**:
- Escribe al menos **2 caracteres**
- Espera ~300ms (debounce)
- Verifica console logs (F12)

### Favoritos no funcionan
**Problema**: Click en ❤️ no hace nada

**Solución**:
- **Sin login**: Muestra toast "Debes iniciar sesión" ✅ Normal
- **Con login**: Debería añadir/quitar favoritos
  - Verifica que estás autenticado (UserMenu visible)

### Filtros no aplican
**Problema**: Cambio filtros pero resultados iguales

**Solución**:
- Asegúrate de hacer click en **"Aplicar filtros"**
- Los filtros solo aplican al confirmar, no en tiempo real

### Imágenes no cargan
**Problema**: Placeholders grises en lugar de imágenes

**Solución**:
- Verifica conexión a internet
- URLs de Unsplash requieren internet
- Revisa `next.config.js` permite dominios externos

### Búsqueda infinita
**Problema**: Loading spinner no para

**Solución**:
- Abre console (F12) y busca errores
- Verifica que `MockSearchService` está importado
- Revisa que no hay errores de TypeScript

---

## 💡 Tips de Testing

### 1. Usa DevTools
```
F12 → Console
```
Verás logs de:
- `🔍 [SEARCH] Buscando propiedades:`
- `📍 [LOCATIONS] Buscando:`
- `✅ [SEARCH] Encontradas: X propiedades`

### 2. Test en Mobile
```
F12 → Device Toolbar (Ctrl+Shift+M)
```
- Grid se adapta (1 columna)
- SearchBar cambia a vertical (futuro)
- Filtros funcionan en móvil

### 3. Test de Performance
```
F12 → Network → Throttling
```
- Cambia a "Slow 3G"
- Verás loading states más tiempo
- Verifica UX con conexión lenta

### 4. Test de Accesibilidad
```
F12 → Lighthouse → Accessibility
```
- Debería obtener 90+ score
- Verifica navegación con teclado
- Tab entre elementos

---

## 📱 Flujos Recomendados

### Flujo 1: Usuario Casual (3 min)
```
Home → QuickFilters → Click "Playa" → 
Ver resultados → Ordenar por precio → 
Click en property → (detalle - futuro)
```

### Flujo 2: Usuario Exigente (10 min)
```
Home → SearchBar → Configurar todo → Buscar →
Abrir Filtros → Aplicar múltiples →
Revisar resultados → Cambiar ordenamiento →
Explorar varias properties → Añadir favorito
```

### Flujo 3: Comparación de Destinos (8 min)
```
Buscar "Barcelona" → Ver resultados → Nota precios →
Cambiar a "Lisboa" → Comparar precios →
Cambiar a "Madrid" → Decidir destino →
Aplicar filtros específicos
```

---

## 🎯 Objetivos de Testing

### Funcionalidad ✅
- [ ] Búsqueda básica funciona
- [ ] Autocompletado responde
- [ ] Fechas se seleccionan
- [ ] Huéspedes se configuran
- [ ] Filtros aplican correctamente
- [ ] Ordenamiento funciona
- [ ] Paginación carga más
- [ ] Carrusel de imágenes funciona
- [ ] Favoritos requieren auth

### UX ✅
- [ ] UI es intuitiva
- [ ] Feedback visual claro
- [ ] Estados de carga visibles
- [ ] Errores informativos
- [ ] Responsive funciona
- [ ] Animaciones suaves

### Performance ✅
- [ ] Búsqueda < 500ms
- [ ] Autocompletado < 300ms
- [ ] Sin lags en scroll
- [ ] Imágenes cargan lazy

---

## 🚀 Siguiente Paso

Una vez probado el módulo de búsqueda, estás listo para:

### Milestone 3: Página de Detalle
- Ver propiedad completa
- Galería de imágenes
- Reviews y calificaciones
- Reservar alojamiento

---

## 📞 Soporte

¿Encontraste un bug? ¿Algo no funciona?

1. Revisa **Troubleshooting** arriba
2. Verifica **console logs** (F12)
3. Lee **SEARCH_DOCUMENTATION.md** para detalles técnicos
4. Crea un issue con:
   - Pasos para reproducir
   - Screenshots
   - Mensajes de error

---

**Happy Testing! 🎉**

Disfruta explorando las propiedades mock y probando todas las funcionalidades del módulo de búsqueda.

