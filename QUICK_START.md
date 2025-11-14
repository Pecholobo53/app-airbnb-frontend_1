# ⚡ Quick Start - Landing Page Airbnb

> 5 minutos para empezar a trabajar en el proyecto

---

## 🎯 ¿Qué es este proyecto?

**Una landing page promocional de Airbnb** con ofertas especiales y descuentos de hasta 40%.

### Vista Previa de Secciones:

```
┌────────────────────────────────────┐
│         🔝 HEADER                  │  ← Navegación sticky
│  [Logo] [Ofertas] [Destinos] [CTA]│
└────────────────────────────────────┘
┌────────────────────────────────────┐
│         🎯 HERO SECTION            │  ← Promoción principal
│  "Vive experiencias únicas"        │     - Badge de oferta
│  [40% OFF] 2M+ huéspedes          │     - Estadísticas
│  [Explorar] [Ver Destinos]        │     - 2 CTAs
└────────────────────────────────────┘
┌────────────────────────────────────┐
│      🏠 PROMOCIONES (x3)           │  ← Grid de ofertas
│  ┌──────┐ ┌──────┐ ┌──────┐       │     - Villa Barcelona
│  │ €89  │ │ €75  │ │ €140 │       │     - Loft Madrid
│  └──────┘ └──────┘ └──────┘       │     - Casa Toscana
└────────────────────────────────────┘
┌────────────────────────────────────┐
│       ✨ FEATURES (x4)             │  ← Beneficios
│  🛡️ Seguro  ⏰ Flexible            │     - Garantías
│  🏆 Calidad 🎧 Soporte             │     - Confianza
└────────────────────────────────────┘
┌────────────────────────────────────┐
│         🔻 FOOTER                  │  ← Links y social
│  [Links] [Redes] [Copyright]      │
└────────────────────────────────────┘
```

---

## 🚀 Setup en 3 Pasos

### 1️⃣ Clonar e Instalar

```bash
# Clonar el repo
git clone <url-del-repo>
cd project

# Instalar dependencias (toma ~2 minutos)
npm install
```

### 2️⃣ Ejecutar en Dev

```bash
# Iniciar servidor de desarrollo
npm run dev
```

**✅ Listo!** Abre → [http://localhost:3000](http://localhost:3000)

### 3️⃣ Explorar el Código

```bash
# Estructura principal
app/
  page.tsx          # ← EMPIEZA AQUÍ (Composición de la página)
  layout.tsx        # Layout y metadata

components/
  Header.tsx        # Navegación
  HeroSection.tsx   # Banner principal  
  PromotionsSection.tsx  # Ofertas (DATOS AQUÍ)
  FeaturesSection.tsx    # Beneficios (DATOS AQUÍ)
  Footer.tsx        # Footer
```

---

## 📝 Tareas Comunes

### ✏️ Cambiar Textos

```tsx
// components/HeroSection.tsx
<h1>
  Vive experiencias
  <span className="text-gradient">únicas</span>  ← Cambiar aquí
</h1>
```

### 🏠 Agregar una Promoción

```tsx
// components/PromotionsSection.tsx
const promotions: PromoCard[] = [
  // ... promociones existentes
  {
    id: '4',                              // ← Nuevo ID
    title: 'Tu Nueva Propiedad',          // ← Título
    location: 'Ciudad, País',             // ← Ubicación
    originalPrice: 200,                   // ← Precio original
    discountPrice: 120,                   // ← Precio con descuento
    discount: 40,                          // ← % descuento
    imageUrl: 'https://imagen.jpg',       // ← URL de imagen
    rating: 4.8,                           // ← Rating
    guests: 4,                             // ← Capacidad
    category: 'Apartamento'                // ← Categoría
  }
];
```

### 🎨 Cambiar Colores

```css
/* app/globals.css */
:root {
  --acento-200: #00668c;   /* ← Color de botones CTA */
  --primario-100: #d4eaf7; /* ← Color de fondo suave */
  --texto-100: #1d1c1c;    /* ← Color de texto principal */
  --bg-100: #fffefb;       /* ← Color de fondo principal */
}
```

### ➕ Agregar una Nueva Sección

```tsx
// 1. Crear componente
// components/NuevaSeccion.tsx
export default function NuevaSeccion() {
  return (
    <section className="py-16 lg:py-24 bg-bg-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tu contenido */}
      </div>
    </section>
  );
}

// 2. Importar en app/page.tsx
import NuevaSeccion from '@/components/NuevaSeccion';

export default function HomePage() {
  return (
    <main>
      <Header />
      <HeroSection />
      <NuevaSeccion />  {/* ← Agregar aquí */}
      <Footer />
    </main>
  );
}
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev        # Servidor de desarrollo (http://localhost:3000)
npm run build      # Build para producción (genera out/)
npm start          # Servidor de producción

# Calidad
npm run lint       # Verificar errores de código
```

---

## 📁 Archivos Clave

| Archivo | Qué hace | Cuándo editarlo |
|---------|----------|-----------------|
| `app/page.tsx` | Composición de la página | Para reorganizar secciones |
| `components/PromotionsSection.tsx` | Ofertas y promociones | Para cambiar datos de propiedades |
| `components/HeroSection.tsx` | Banner principal | Para cambiar headline o stats |
| `app/globals.css` | Estilos globales | Para cambiar colores o fuentes |
| `tailwind.config.ts` | Config de Tailwind | Para agregar colores personalizados |
| `package.json` | Dependencias | Para agregar librerías |

---

## 🎨 Clases CSS Útiles

### Botones
```tsx
<button className="btn-primary">      {/* Azul con hover */}
<button className="btn-secondary">    {/* Azul claro con hover */}
```

### Tarjetas
```tsx
<div className="promo-card">          {/* Card con sombra y hover */}
```

### Texto con Gradiente
```tsx
<span className="text-gradient">     {/* Gradiente azul */}
```

### Responsive
```tsx
<div className="
  grid 
  grid-cols-1          {/* 1 columna en mobile */}
  md:grid-cols-2       {/* 2 columnas en tablet */}
  lg:grid-cols-3       {/* 3 columnas en desktop */}
">
```

---

## 🐛 Solución Rápida de Problemas

### ❌ Error: "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ❌ Estilos no aparecen

```bash
# Reiniciar servidor
Ctrl+C
npm run dev
```

### ❌ TypeScript muestra errores

```bash
# Verificar tipos
npx tsc --noEmit
```

### ❌ Puerto 3000 ocupado

```bash
# Usar otro puerto
PORT=3001 npm run dev
```

---

## 📚 Documentación Completa

¿Necesitas más detalles? Consulta estos documentos:

| Documento | Contenido | Para quién |
|-----------|-----------|------------|
| **[README.md](./README.md)** | Vista general del proyecto | Todos |
| **[ONBOARDING.md](./ONBOARDING.md)** | Guía completa de onboarding | Nuevos developers |
| **[TECHNICAL_GUIDE.md](./TECHNICAL_GUIDE.md)** | Guía técnica detallada | Developers |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Arquitectura del sistema | Tech leads |

---

## 🎯 Tu Primer Task

### Cambiar el Descuento del Hero

1. Abre `components/HeroSection.tsx`
2. Busca la línea 31:
   ```tsx
   Descubre alojamientos extraordinarios con hasta <strong>40% de descuento</strong>
   ```
3. Cambia `40%` por `50%`
4. Guarda el archivo
5. ✅ El navegador se recarga automáticamente!

---

## 🚢 Deploy en Netlify

### Opción 1: Deploy Automático (Recomendado)

1. Push tu código a GitHub
2. Conecta el repo en Netlify
3. ✅ Deploy automático en cada push!

### Opción 2: Deploy Manual

```bash
# 1. Build
npm run build

# 2. Subir la carpeta out/ a Netlify
# (Arrastra out/ a Netlify UI)
```

---

## 💡 Tips Rápidos

### ✅ DO's (Hacer)

- ✅ Usar clases de Tailwind
- ✅ Componentes pequeños y reutilizables
- ✅ TypeScript para tipos
- ✅ Comentarios en código complejo
- ✅ Probar en mobile y desktop

### ❌ DON'Ts (No hacer)

- ❌ Estilos inline (`style={{...}}`)
- ❌ Componentes gigantes (>200 líneas)
- ❌ `any` en TypeScript
- ❌ Commits sin mensaje descriptivo
- ❌ Push directo a main sin probar

---

## 🎓 Stack Tecnológico (Resumido)

```
Next.js 13        → Framework principal
React 18          → UI Library
TypeScript        → Tipado estático
Tailwind CSS      → Estilos utility-first
Shadcn/UI         → Componentes pre-hechos
Lucide React      → Iconos
Netlify           → Hosting
```

---

## 📞 ¿Necesitas Ayuda?

1. **Consulta la documentación completa** → [ONBOARDING.md](./ONBOARDING.md)
2. **Pregunta en el equipo** → Slack #proyecto-airbnb
3. **Revisa los comentarios en el código** → Busca `TODO:` y `FIXME:`

---

## ✨ ¡Todo Listo!

Ya tienes todo lo necesario para empezar a trabajar en el proyecto.

**Próximos pasos:**
1. ✅ Familiarízate con la estructura
2. ✅ Haz pequeños cambios para practicar
3. ✅ Lee [ONBOARDING.md](./ONBOARDING.md) para profundizar
4. ✅ ¡Empieza a construir features!

---

**Creado**: 13 de Noviembre, 2025  
**Versión**: 1.0.0

¡Bienvenido al proyecto! 🎉 Happy coding! 💻



