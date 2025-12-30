# Inventario de Elementos UI/UX - Homepage Flow

## Ruta: `/` (Homepage)

| Elemento | Tipo | Selector Sugerido | Estado | Observaciones |
|----------|------|-------------------|--------|---------------|
| Logo Airbnb | Link | `a[href="/"]` | ✅ Visible | Navegación principal |
| Botón Inicio | Button | `button:has-text("Inicio")` | ✅ Visible | Navegación |
| Botón Buscar | Button | `button:has-text("Buscar")` | ✅ Visible | Navegación |
| Botón Experiencias | Button | `button:has-text("Experiencias")` | ✅ Visible | Navegación |
| Botón Reservar ahora | Button | `button:has-text("¡Reservar ahora!")` | ✅ Visible | CTA principal |
| Botón Cerrar banner | Button | `button:has-text("Cerrar banner")` | ✅ Visible | Cerrar oferta flash |
| Input Búsqueda | Input | `input[placeholder*="Buscar"]` | ✅ Visible | Campo de búsqueda principal |
| Link Ofertas | Link | `a[href="/#ofertas"]` | ✅ Visible | Sección de ofertas |
| Link Ver Destinos Populares | Link | `a[href="/buscar"]` | ✅ Visible | Navegación a búsqueda |
| Link Ver Todas las Ofertas | Link | `a[href="/buscar"]` | ✅ Visible | Navegación a búsqueda |
| Cards de Propiedades | Link | `a[href^="/propiedad/"]` | ✅ Visible | 6 propiedades destacadas |
| Filtros por Tipo | Link | `a[href*="propertyType"]` | ✅ Visible | Casas, Apartamentos, Villas, Cabañas |
| Filtros por Amenidades | Link | `a[href*="amenities"]` | ✅ Visible | Playa, Montaña |
| Formulario de Búsqueda | Form | `form` | ✅ Visible | Formulario principal |

## Ruta: `/login`

| Elemento | Tipo | Selector Sugerido | Estado | Observaciones |
|----------|------|-------------------|--------|---------------|
| Input Email | Input | `#email` | ✅ Visible | Campo requerido |
| Input Password | Input | `#password` | ✅ Visible | Campo requerido |
| Botón Iniciar sesión | Button | `button[type="submit"]` | ✅ Visible | Submit del formulario |
| Heading | Heading | `h1, h2` | ✅ Visible | "¡Bienvenido de vuelta!" |

## Ruta: `/dashboard`

| Elemento | Tipo | Selector Sugerido | Estado | Observaciones |
|----------|------|-------------------|--------|---------------|
| Saludo Usuario | Text | - | ✅ Visible | "Hola, ARMANDO 👋" |
| Sección Próximos Viajes | Section | - | ✅ Visible | Información de viajes |
| Estadísticas | Cards | - | ✅ Visible | Viajes, Favoritos, Gasto total |

## Heurística UI/UX

### ✅ Aspectos Positivos
- Elementos interactivos claramente identificables
- Navegación intuitiva con enlaces descriptivos
- Formularios con campos etiquetados
- CTAs visibles y accesibles

### ⚠️ Áreas de Mejora
- Algunos elementos podrían beneficiarse de `data-testid` para testing
- Errores 404 en recursos estáticos podrían afectar la experiencia visual
- Validaciones de formularios no verificadas en detalle







<<<<<<< HEAD


=======
>>>>>>> 23cbeb270db5b790c19aefad1bb60cc9c22ed085








