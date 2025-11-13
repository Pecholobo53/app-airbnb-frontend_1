# 🔧 Guía Técnica - Landing Page Airbnb

## 📋 Tabla de Contenidos

1. [Configuración del Entorno](#configuración-del-entorno)
2. [Arquitectura de Componentes](#arquitectura-de-componentes)
3. [Sistema de Estilos](#sistema-de-estilos)
4. [Optimizaciones](#optimizaciones)
5. [Troubleshooting](#troubleshooting)
6. [Guías de Desarrollo](#guías-de-desarrollo)

---

## 🛠️ Configuración del Entorno

### Pre-requisitos

```bash
Node.js: >= 18.0.0
npm: >= 9.0.0
Git: >= 2.30.0
```

### Instalación Paso a Paso

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd project

# 2. Instalar dependencias
npm install

# 3. Verificar instalación
npm run dev

# 4. Verificar que no hay errores de linting
npm run lint
```

### Extensiones Recomendadas para VS Code

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "styled-components.vscode-styled-components"
  ]
}
```

### Configuración de VS Code (settings.json)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"]
  ]
}
```

---

## 🏗️ Arquitectura de Componentes

### Diagrama de Jerarquía

```
RootLayout (layout.tsx)
    │
    └─── HomePage (page.tsx)
            │
            ├─── Header
            │
            ├─── HeroSection
            │      ├─── Badge
            │      ├─── Headline
            │      ├─── Stats
            │      ├─── CTAs
            │      └─── FloatingCard
            │
            ├─── PromotionsSection
            │      ├─── SectionHeader
            │      └─── PromoCard[] (x3)
            │            ├─── Image
            │            ├─── DiscountBadge
            │            ├─── CategoryBadge
            │            ├─── Content
            │            └─── CTA Button
            │
            ├─── FeaturesSection
            │      ├─── SectionHeader
            │      └─── FeatureCard[] (x4)
            │            ├─── Icon
            │            ├─── Title
            │            └─── Description
            │
            └─── Footer
                   ├─── Brand
                   ├─── Links[]
                   └─── Social Icons
```

### Convenciones de Componentes

#### 1. Estructura de un Componente

```typescript
import { IconName } from 'lucide-react';

/**
 * Component Name - Brief description
 * 
 * @description Detailed description if needed
 * 
 * Props:
 * @param {string} title - Description
 * @param {number} count - Description
 * 
 * TODO: Pending tasks
 * FIXME: Known issues
 */
interface ComponentProps {
  title: string;
  count?: number;
}

export default function ComponentName({ title, count = 0 }: ComponentProps) {
  // Hooks
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Handlers
  const handleClick = () => {
    // ...
  };

  // Render
  return (
    <section className="...">
      {/* Content */}
    </section>
  );
}
```

#### 2. Tipos y Interfaces

```typescript
// En components/PromotionsSection.tsx
interface PromoCard {
  id: string;              // Unique identifier
  title: string;           // Property title
  location: string;        // City, Country
  originalPrice: number;   // Price in EUR
  discountPrice: number;   // Discounted price
  discount: number;        // Percentage (0-100)
  imageUrl: string;        // External URL
  rating: number;          // 0-5 stars
  guests: number;          // Max guests
  category: string;        // Villa, Apartamento, Casa
}
```

---

## 🎨 Sistema de Estilos

### Tailwind Configuration Deep Dive

```typescript
// tailwind.config.ts
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom colors con soporte de opacidad
      colors: {
        'primario': {
          100: 'rgb(var(--primario-100-rgb) / <alpha-value>)',
          200: 'rgb(var(--primario-200-rgb) / <alpha-value>)', 
          300: 'rgb(var(--primario-300-rgb) / <alpha-value>)',
        },
        // ...
      },
      
      // Custom animations
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
      },
    },
  },
};
```

### Clases Personalizadas

```css
/* app/globals.css */

/* Botones */
.btn-primary {
  @apply bg-[var(--acento-200)] 
         hover:bg-[var(--acento-100)] 
         text-white 
         px-6 py-3 
         rounded-lg 
         font-medium 
         transition-all 
         duration-200 
         hover:shadow-lg;
}

.btn-secondary {
  @apply bg-[var(--primario-100)] 
         hover:bg-[var(--primario-200)] 
         text-[var(--texto-100)] 
         px-6 py-3 
         rounded-lg 
         font-medium 
         transition-all 
         duration-200 
         hover:shadow-md;
}

/* Cards */
.promo-card {
  @apply bg-white 
         rounded-2xl 
         shadow-sm 
         hover:shadow-lg 
         transition-all 
         duration-300 
         overflow-hidden 
         border 
         border-bg-300/30;
}

/* Gradientes */
.text-gradient {
  background: linear-gradient(135deg, 
    var(--acento-200), 
    var(--acento-100)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Uso de Clases Utility

```tsx
// ✅ BIEN: Uso correcto de Tailwind
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <h1 className="text-4xl lg:text-6xl font-bold text-texto-100">
    Título
  </h1>
</div>

// ❌ MAL: Evitar estilos inline
<div style={{ maxWidth: '1280px', margin: '0 auto' }}>
  <h1 style={{ fontSize: '60px', fontWeight: 'bold' }}>
    Título
  </h1>
</div>
```

---

## ⚡ Optimizaciones

### 1. Imágenes

#### Estado Actual (Pexels URLs)
```tsx
<img 
  src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg"
  alt="Alojamiento"
  className="w-full h-[500px] object-cover"
/>
```

#### Optimización Recomendada (next/image)
```tsx
import Image from 'next/image';

<Image
  src="/images/alojamiento.webp"
  alt="Alojamiento único de Airbnb"
  width={800}
  height={500}
  priority // Para hero images
  placeholder="blur"
  blurDataURL="data:image/..."
  className="rounded-3xl"
/>
```

### 2. Fonts

#### Configuración Actual
```typescript
// app/layout.tsx
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap', // FOUT prevention
});
```

### 3. Code Splitting

Next.js 13 hace code splitting automático, pero puedes optimizar con:

```tsx
import dynamic from 'next/dynamic';

// Lazy load componentes pesados
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Si no necesitas SSR
});
```

### 4. Metadata y SEO

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Ofertas Especiales - Airbnb',
  description: 'Descubre las mejores promociones y ofertas exclusivas',
  keywords: ['airbnb', 'ofertas', 'alojamientos', 'vacaciones'],
  authors: [{ name: 'Airbnb' }],
  openGraph: {
    title: 'Ofertas Especiales - Airbnb',
    description: 'Hasta 40% de descuento en alojamientos únicos',
    images: ['/og-image.jpg'],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ofertas Especiales - Airbnb',
    description: 'Hasta 40% de descuento',
    images: ['/twitter-image.jpg'],
  },
};
```

---

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Error: "Module not found"

```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 2. Estilos de Tailwind no aplican

```bash
# Verificar que tailwind.config.ts tiene los paths correctos
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
]

# Reiniciar servidor
npm run dev
```

#### 3. Error de build en Netlify

```toml
# Verificar netlify.toml
[build]
  command = "npm run build"
  publish = "out"

# Agregar next.config.js
module.exports = {
  output: 'export',
  images: { unoptimized: true }
}
```

#### 4. Variables CSS no funcionan

```css
/* ✅ BIEN: Usar var() */
color: var(--acento-200);

/* ❌ MAL */
color: --acento-200;
```

---

## 📚 Guías de Desarrollo

### Agregar una Nueva Sección

```bash
# 1. Crear componente
touch components/NuevaSeccion.tsx

# 2. Estructura básica
```

```tsx
// components/NuevaSeccion.tsx
export default function NuevaSeccion() {
  return (
    <section className="py-16 lg:py-24 bg-bg-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content */}
      </div>
    </section>
  );
}
```

```tsx
// 3. Importar en app/page.tsx
import NuevaSeccion from '@/components/NuevaSeccion';

export default function HomePage() {
  return (
    <main>
      <Header />
      <HeroSection />
      <NuevaSeccion /> {/* Agregar aquí */}
      <Footer />
    </main>
  );
}
```

### Agregar un Nuevo Componente UI de Shadcn

```bash
# Instalar componente específico
npx shadcn-ui@latest add button

# Se creará en components/ui/button.tsx
# Usar en tu componente:
```

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">
  Click Me
</Button>
```

### Crear una Nueva Página

```bash
# 1. Crear directorio y archivo
mkdir app/nueva-pagina
touch app/nueva-pagina/page.tsx
```

```tsx
// app/nueva-pagina/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nueva Página - Airbnb',
  description: 'Descripción de la página',
};

export default function NuevaPagina() {
  return (
    <main className="min-h-screen">
      <h1>Nueva Página</h1>
    </main>
  );
}
```

### Agregar Analytics

```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: any) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

```tsx
// Usar en componentes
import { event } from '@/lib/gtag';

const handleClick = () => {
  event({
    action: 'click_cta',
    category: 'engagement',
    label: 'hero_explore_offers',
  });
};
```

### Testing (Futuro)

```bash
# Instalar dependencias
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Crear test
```

```tsx
// __tests__/components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

describe('Header', () => {
  it('renders logo and navigation', () => {
    render(<Header />);
    expect(screen.getByText('airbnb')).toBeInTheDocument();
    expect(screen.getByText('Ofertas')).toBeInTheDocument();
  });
});
```

---

## 📊 Performance Checklist

### Build Time
- [ ] Tree shaking habilitado
- [ ] Minificación CSS/JS
- [ ] Code splitting por rutas
- [ ] Lazy loading de componentes pesados

### Runtime
- [ ] Imágenes optimizadas (WebP, tamaños múltiples)
- [ ] Fonts preloaded y optimizados
- [ ] CSS crítico inline
- [ ] Prefetch de rutas importantes

### Métricas Target
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 600ms

### Herramientas de Medición

```bash
# Lighthouse (Chrome DevTools)
# PageSpeed Insights: https://pagespeed.web.dev/

# Next.js Bundle Analyzer
npm install @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // config
});

// Ejecutar:
// ANALYZE=true npm run build
```

---

## 🔐 Seguridad

### Variables de Entorno

```bash
# .env.local (NO subir a Git)
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=secret_key_here

# .env.example (Sí subir a Git)
NEXT_PUBLIC_API_URL=
API_SECRET_KEY=
```

### Sanitización de Inputs

```tsx
import DOMPurify from 'isomorphic-dompurify';

const clean = DOMPurify.sanitize(dirty);
```

---

## 🚀 Deployment Checklist

### Pre-Deploy
- [ ] Ejecutar `npm run lint` sin errores
- [ ] Ejecutar `npm run build` exitoso
- [ ] Verificar que todas las imágenes cargan
- [ ] Probar en diferentes dispositivos
- [ ] Verificar enlaces externos
- [ ] Revisar metadata y SEO
- [ ] Probar performance (Lighthouse)

### Post-Deploy
- [ ] Verificar que el sitio está online
- [ ] Probar todas las rutas
- [ ] Verificar analytics funcionando
- [ ] Revisar errores en consola
- [ ] Verificar responsive en dispositivos reales

---

## 📞 Recursos Adicionales

### Comandos Útiles

```bash
# Limpiar todo
npm run clean && rm -rf node_modules package-lock.json && npm install

# Verificar versiones
node --version
npm --version

# Analizar bundle
ANALYZE=true npm run build

# Verificar tipos de TypeScript
npx tsc --noEmit
```

### Links Importantes

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

---

**Última actualización**: 13 de Noviembre, 2025  
**Versión**: 1.0.0

---

¿Preguntas técnicas? Consulta primero este documento. Si no encuentras la respuesta, contacta al equipo. 🚀

