# 🏛️ Arquitectura del Proyecto - Landing Page Airbnb

## 📐 Vista General

```
┌─────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE                             │
│                      (Single Page Application)                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          NEXT.JS 13                              │
│                    (App Router + SSG Export)                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
        ┌───────────────┐              ┌───────────────┐
        │   FRONTEND    │              │    STYLES     │
        │               │              │               │
        │  React 18.2   │              │ Tailwind CSS  │
        │  TypeScript   │              │  Custom CSS   │
        └───────────────┘              └───────────────┘
                │                               │
                └───────────────┬───────────────┘
                                ▼
                        ┌───────────────┐
                        │  COMPONENTS   │
                        │   Library     │
                        │               │
                        │  Shadcn/UI    │
                        │  Radix UI     │
                        │  Lucide Icons │
                        └───────────────┘
```

---

## 🗂️ Estructura de Directorios (Detallada)

```
project/
│
├── 📁 app/                           # Next.js App Router (Core)
│   ├── 📄 layout.tsx                 # Root Layout + Metadata
│   ├── 📄 page.tsx                   # Home Page (Entry Point)
│   ├── 📄 globals.css                # Global Styles + CSS Variables
│   └── 📄 not-found.tsx              # 404 Page (Auto-generated)
│
├── 📁 components/                    # React Components
│   │
│   ├── 📄 Header.tsx                 # 🔝 Navigation Bar
│   │   └── Props: none
│   │   └── State: none (stateless)
│   │   └── Uses: lucide-react (Heart, Menu icons)
│   │
│   ├── 📄 HeroSection.tsx            # 🎯 Main Hero Banner
│   │   └── Props: none
│   │   └── State: none
│   │   └── Uses: lucide-react (Star, ArrowRight)
│   │   └── Features:
│   │       ├── Badge (Oferta Limitada)
│   │       ├── Main Headline
│   │       ├── Stats Grid (3 items)
│   │       ├── CTA Buttons (2)
│   │       └── Image + Floating Card
│   │
│   ├── 📄 PromotionsSection.tsx      # 🏠 Offers Grid
│   │   └── Props: none
│   │   └── State: promotions[] (static data)
│   │   └── Uses: lucide-react (MapPin, Users, Percent)
│   │   └── Data Structure:
│   │       └── PromoCard[] {
│   │           ├── id: string
│   │           ├── title: string
│   │           ├── location: string
│   │           ├── originalPrice: number
│   │           ├── discountPrice: number
│   │           ├── discount: number
│   │           ├── imageUrl: string
│   │           ├── rating: number
│   │           ├── guests: number
│   │           └── category: string
│   │       }
│   │
│   ├── 📄 FeaturesSection.tsx        # ✨ Benefits Grid
│   │   └── Props: none
│   │   └── State: features[] (static data)
│   │   └── Uses: lucide-react (Shield, Clock, Award, Headphones)
│   │   └── Grid: 4 items
│   │       ├── Reserva Segura
│   │       ├── Cancelación Flexible
│   │       ├── Calidad Garantizada
│   │       └── Soporte 24/7
│   │
│   ├── 📄 Footer.tsx                 # 🔻 Footer Links
│   │   └── Props: none
│   │   └── State: none
│   │   └── Uses: lucide-react (Heart, Instagram, Twitter, Facebook)
│   │   └── Sections:
│   │       ├── Brand
│   │       ├── Soporte (3 links)
│   │       ├── Anfitrión (3 links)
│   │       ├── Empresa (3 links)
│   │       ├── Copyright
│   │       └── Social Media (3 icons)
│   │
│   └── 📁 ui/                        # Shadcn UI Components
│       ├── 📄 accordion.tsx
│       ├── 📄 alert-dialog.tsx
│       ├── 📄 button.tsx
│       ├── 📄 card.tsx
│       ├── 📄 dialog.tsx
│       ├── 📄 input.tsx
│       ├── 📄 select.tsx
│       ├── 📄 toast.tsx
│       └── ... (27 more components)
│
├── 📁 hooks/                         # Custom React Hooks
│   └── 📄 use-toast.ts               # Toast notifications hook
│
├── 📁 lib/                           # Utility Functions
│   └── 📄 utils.ts                   # Helper functions (cn, etc.)
│
├── 📁 out/                           # Static Build Output
│   ├── 📄 index.html                 # Built HTML
│   ├── 📁 _next/                     # Next.js assets
│   └── ...
│
├── 📄 components.json                # Shadcn UI config
├── 📄 next.config.js                 # Next.js configuration
├── 📄 tailwind.config.ts             # Tailwind CSS config
├── 📄 tsconfig.json                  # TypeScript config
├── 📄 postcss.config.js              # PostCSS config
├── 📄 package.json                   # Dependencies
├── 📄 netlify.toml                   # Netlify deployment config
│
└── 📄 README.md                      # Project documentation
```

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REQUEST                              │
│              https://your-site.netlify.app                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   NETLIFY CDN                                │
│              (Serves Static HTML/CSS/JS)                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  index.html (SSG)                            │
│            Pre-rendered at Build Time                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 React Hydration                              │
│         (Makes page interactive)                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Components Render                               │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Header  │  │   Hero   │  │  Promos  │  │  Footer  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Renderizado Detallado

```
1. Build Time (npm run build)
   │
   ├─→ Next.js compila TypeScript → JavaScript
   ├─→ Tailwind genera CSS optimizado
   ├─→ Components se renderizan a HTML estático
   ├─→ Se genera out/ folder con archivos estáticos
   └─→ Ready para deploy
   
2. Deploy (Netlify)
   │
   ├─→ out/ se sube a Netlify CDN
   ├─→ index.html se convierte en entry point
   └─→ Assets se distribuyen globalmente
   
3. User Visit
   │
   ├─→ Browser descarga index.html
   ├─→ CSS se aplica (styled landing page)
   ├─→ JavaScript se ejecuta (React hydration)
   ├─→ Page se vuelve interactiva
   └─→ User puede hacer click en CTAs
```

---

## 🎨 Arquitectura de Estilos

```
┌─────────────────────────────────────────────────────────────┐
│                     CSS ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │  CSS Layers  │ │   Tailwind   │ │   Custom     │
    │              │ │              │ │              │
    │  @base       │ │  Utility     │ │  Variables   │
    │  @components │ │  Classes     │ │  (CSS Vars)  │
    │  @utilities  │ │              │ │              │
    └──────────────┘ └──────────────┘ └──────────────┘
            │               │               │
            └───────────────┼───────────────┘
                            ▼
                    ┌──────────────┐
                    │  Compiled    │
                    │     CSS      │
                    │              │
                    │ globals.css  │
                    └──────────────┘
```

### Jerarquía de Estilos

```css
/* 1. CSS Variables (Root Level) */
:root {
  --primario-100: #d4eaf7;
  --acento-200: #00668c;
  --texto-100: #1d1c1c;
  --bg-100: #fffefb;
}

/* 2. Base Styles (@layer base) */
body {
  background: var(--bg-100);
  color: var(--texto-100);
  font-family: var(--font-dm-sans);
}

/* 3. Component Styles (@layer components) */
.btn-primary { /* ... */ }
.btn-secondary { /* ... */ }
.promo-card { /* ... */ }

/* 4. Utility Styles (@layer utilities) */
.text-gradient { /* ... */ }

/* 5. Tailwind Utilities (Generated) */
.flex { display: flex; }
.justify-center { justify-content: center; }
/* ... thousands more */
```

---

## 🧩 Arquitectura de Componentes (React)

### Patrón de Composición

```tsx
// app/page.tsx (Composition Root)
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />              {/* Stateless */}
      <HeroSection />         {/* Stateless */}
      <PromotionsSection />   {/* Data-driven */}
      <FeaturesSection />     {/* Data-driven */}
      <Footer />              {/* Stateless */}
    </main>
  );
}
```

### Tipos de Componentes

#### 1. **Presentational Components** (90% del proyecto)
```tsx
// No tienen estado
// Solo reciben props y renderizan UI
// Ejemplo: Header, Footer

interface HeaderProps {
  // Props opcionales
}

export default function Header({ }: HeaderProps) {
  return <header>{/* JSX */}</header>;
}
```

#### 2. **Data-Driven Components** (10% del proyecto)
```tsx
// Contienen datos estáticos
// Mapean datos a UI
// Ejemplo: PromotionsSection, FeaturesSection

const promotions: PromoCard[] = [/* data */];

export default function PromotionsSection() {
  return (
    <section>
      {promotions.map(promo => (
        <PromoCard key={promo.id} {...promo} />
      ))}
    </section>
  );
}
```

---

## 🔌 Dependencias y Relaciones

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPENDENCIES GRAPH                        │
└─────────────────────────────────────────────────────────────┘

Next.js 13.5.1
    ├─→ React 18.2.0
    │   └─→ react-dom 18.2.0
    │
    ├─→ TypeScript 5.2.2
    │
    ├─→ Tailwind CSS 3.3.3
    │   ├─→ autoprefixer 10.4.15
    │   ├─→ postcss 8.4.30
    │   └─→ tailwindcss-animate
    │
    ├─→ Shadcn/UI
    │   ├─→ @radix-ui/* (15+ packages)
    │   ├─→ class-variance-authority
    │   ├─→ clsx
    │   └─→ tailwind-merge
    │
    ├─→ lucide-react 0.446.0 (Icons)
    │
    ├─→ react-hook-form 7.53.0
    │   ├─→ @hookform/resolvers 3.9.0
    │   └─→ zod 3.23.8
    │
    └─→ Google Fonts (DM Sans)

Build/Dev Tools
    ├─→ ESLint 8.49.0
    │   └─→ eslint-config-next
    │
    └─→ @next/swc-wasm-nodejs (Compiler)
```

---

## 📦 Build Process

```
┌─────────────────────────────────────────────────────────────┐
│                      BUILD PIPELINE                          │
└─────────────────────────────────────────────────────────────┘

Step 1: Type Checking
    │
    ├─→ TypeScript Compiler (tsc)
    ├─→ Verifica tipos
    └─→ Genera declaraciones (.d.ts)
    
Step 2: Transpilation
    │
    ├─→ Next.js SWC Compiler
    ├─→ TSX/JSX → JavaScript
    ├─→ ES6+ → ES5 (para compatibilidad)
    └─→ Tree shaking
    
Step 3: CSS Processing
    │
    ├─→ Tailwind CSS
    ├─→ PostCSS
    ├─→ Autoprefixer
    ├─→ Minification
    └─→ Output: optimized CSS
    
Step 4: Static Generation (SSG)
    │
    ├─→ Next.js renders components
    ├─→ Genera HTML estático
    ├─→ Inyecta CSS inline (critical)
    └─→ Output: index.html
    
Step 5: Asset Optimization
    │
    ├─→ JavaScript minification
    ├─→ Code splitting
    ├─→ Hash filenames (cache busting)
    └─→ Output: _next/ folder
    
Step 6: Output
    │
    └─→ out/
        ├── index.html
        ├── 404.html
        └── _next/
            ├── static/
            │   ├── chunks/ (JS bundles)
            │   └── css/ (Stylesheets)
            └── ...

TOTAL BUILD TIME: ~30-60 segundos
TOTAL OUTPUT SIZE: ~2-5 MB
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  DEPLOYMENT FLOW                             │
└─────────────────────────────────────────────────────────────┘

Local Development
    │
    ├─→ git push origin main
    │
    ▼
┌──────────────────┐
│   GitHub Repo    │
│   (main branch)  │
└──────────────────┘
    │
    │ (Webhook trigger)
    │
    ▼
┌──────────────────┐
│  Netlify Build   │
│                  │
│  1. npm install  │
│  2. npm run build│
│  3. Deploy out/  │
└──────────────────┘
    │
    │ (CDN Distribution)
    │
    ▼
┌──────────────────────────────────────────┐
│       Netlify Global CDN                 │
│                                          │
│  ┌────────┐  ┌────────┐  ┌────────┐    │
│  │  US-W  │  │  EU-C  │  │  ASIA  │    │
│  └────────┘  └────────┘  └────────┘    │
│                                          │
│  - Automatic HTTPS                       │
│  - Global edge caching                   │
│  - DDoS protection                       │
└──────────────────────────────────────────┘
    │
    ▼
┌──────────────────┐
│   End Users      │
│   (Browsers)     │
└──────────────────┘
```

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🎯 Rutas y Navegación

```
Landing Page (/)
    │
    ├─── #ofertas (Anchor Link)
    │    └─→ Scroll to PromotionsSection
    │
    ├─── #destinos (Anchor Link)
    │    └─→ Scroll to (Future Section)
    │
    └─── #experiencias (Anchor Link)
         └─→ Scroll to (Future Section)

Future Routes (Not Implemented):
    │
    ├─── /propiedad/[id]
    │    └─→ Property Detail Page
    │
    ├─── /reserva
    │    └─→ Booking Flow
    │
    └─── /buscar
         └─→ Search Results
```

---

## 🔒 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
└─────────────────────────────────────────────────────────────┘

1. Build Time Security
   ├─→ No sensitive data in source code
   ├─→ Environment variables for secrets
   └─→ Dependencies vulnerability scanning

2. Runtime Security
   ├─→ Static site (no server-side attacks)
   ├─→ HTTPS by default (Netlify)
   ├─→ CSP headers (Content Security Policy)
   └─→ XSS protection (React auto-escaping)

3. CDN Security
   ├─→ DDoS protection (Netlify)
   ├─→ Rate limiting
   └─→ WAF (Web Application Firewall)

4. Client-Side Security
   ├─→ Input sanitization (future forms)
   ├─→ CORS policies
   └─→ Secure cookies (future auth)
```

---

## 📊 Performance Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 PERFORMANCE STRATEGY                         │
└─────────────────────────────────────────────────────────────┘

1. Static Generation (SSG)
   ├─→ HTML pre-rendered at build time
   ├─→ Zero server processing
   └─→ Instant page loads

2. Code Splitting
   ├─→ Automatic by Next.js
   ├─→ Each route = separate bundle
   └─→ Lazy loading of heavy components

3. CSS Optimization
   ├─→ Tailwind purges unused classes
   ├─→ Critical CSS inlined
   └─→ Non-critical CSS deferred

4. Image Optimization (Future)
   ├─→ WebP format
   ├─→ Responsive images (srcset)
   ├─→ Lazy loading
   └─→ Blur placeholders

5. Caching Strategy
   ├─→ HTML: Cache-Control: public, max-age=0, must-revalidate
   ├─→ Static Assets: Cache-Control: public, max-age=31536000, immutable
   └─→ CDN edge caching

Target Metrics:
├─→ LCP: < 2.5s
├─→ FID: < 100ms
├─→ CLS: < 0.1
└─→ Bundle Size: < 200KB (gzipped)
```

---

## 🔧 Extensibility Points

### 1. Agregar Backend API

```tsx
// lib/api.ts
export async function getPromotions() {
  const res = await fetch('/api/promotions');
  return res.json();
}

// components/PromotionsSection.tsx
const [promotions, setPromotions] = useState([]);

useEffect(() => {
  getPromotions().then(setPromotions);
}, []);
```

### 2. Agregar State Management (Redux/Zustand)

```tsx
// store/useStore.ts
import create from 'zustand';

interface Store {
  favorites: string[];
  addFavorite: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  favorites: [],
  addFavorite: (id) => set((state) => ({
    favorites: [...state.favorites, id]
  })),
}));
```

### 3. Agregar Routing Dinámico

```tsx
// app/propiedad/[id]/page.tsx
export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((prop) => ({
    id: prop.id,
  }));
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  // ...
}
```

---

## 📈 Escalabilidad

```
Current State (1 página)
    │
    ├─→ ~5 componentes
    ├─→ ~100 líneas CSS custom
    ├─→ ~500 líneas TypeScript
    └─→ Build time: 30-60s

Escalado a 10 páginas
    │
    ├─→ ~50 componentes
    ├─→ ~500 líneas CSS custom
    ├─→ ~5,000 líneas TypeScript
    └─→ Build time: 2-3min

Escalado a 100 páginas
    │
    ├─→ ~200 componentes
    ├─→ ~2,000 líneas CSS custom
    ├─→ ~50,000 líneas TypeScript
    ├─→ Build time: 10-15min
    └─→ Considerar:
        ├─→ Incremental Static Regeneration (ISR)
        ├─→ Server-Side Rendering (SSR)
        ├─→ API Routes
        └─→ Database integration
```

---

## 🎓 Principios de Arquitectura

### 1. **Separation of Concerns**
- Componentes = UI
- Hooks = Lógica reutilizable
- Lib = Utilidades
- Styles = Presentación

### 2. **Component Composition**
- Componentes pequeños y reutilizables
- Composición sobre herencia
- Props para customización

### 3. **Performance First**
- Static generation por defecto
- Code splitting automático
- Optimización de assets

### 4. **Type Safety**
- TypeScript en todo el proyecto
- Interfaces explícitas
- No `any` types

### 5. **Maintainability**
- Código autodocumentado
- Comentarios JSDoc
- Estructura clara y consistente

---

**Última actualización**: 13 de Noviembre, 2025  
**Versión**: 1.0.0

---

Este documento describe la arquitectura actual del proyecto. Para cambios arquitectónicos mayores, consultar con el equipo técnico. 🏗️

