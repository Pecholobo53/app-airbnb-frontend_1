# 🏠 Landing Page Airbnb - Promociones

> Una landing page moderna y responsive para promocionar ofertas especiales de alojamientos en Airbnb.

![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38bdf8)

## ✨ Características

- 🎨 Diseño moderno y minimalista inspirado en Airbnb
- 📱 Totalmente responsive (Mobile, Tablet, Desktop)
- ⚡ Optimizado con Next.js 13 (App Router)
- 🎭 Animaciones suaves y transiciones elegantes
- 🎯 CTAs estratégicos para maximizar conversión
- 🛡️ TypeScript para código más seguro
- 🎨 Tailwind CSS + Componentes Shadcn/UI

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Build para producción
npm run build

# Ejecutar producción
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Stack Tecnológico

- **Framework**: Next.js 13.5.1
- **UI Library**: React 18.2.0
- **Lenguaje**: TypeScript 5.2.2
- **Estilos**: Tailwind CSS 3.3.3
- **Componentes**: Shadcn/UI + Radix UI
- **Iconos**: Lucide React
- **Fuente**: DM Sans (Google Fonts)

## 🎯 Estructura del Proyecto

```
project/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página home
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── PromotionsSection.tsx
│   ├── FeaturesSection.tsx
│   ├── Footer.tsx
│   └── ui/                # Componentes Shadcn
└── lib/                   # Utilidades
```

## 🌟 Secciones

### Header
Navegación sticky con logo, menú y CTA principal.

### Hero Section
- Promoción destacada con oferta del 40%
- Estadísticas: 2M+ huéspedes, 150K+ alojamientos
- Doble CTA: Explorar ofertas y ver destinos

### Promociones
Grid de 3 ofertas principales:
- Villa Mediterránea (Barcelona) - €89/noche
- Loft Moderno (Madrid) - €75/noche
- Casa Rural (Toscana) - €140/noche

### Features
4 beneficios clave:
- 🛡️ Reserva Segura
- ⏰ Cancelación Flexible
- 🏆 Calidad Garantizada
- 🎧 Soporte 24/7

### Footer
Enlaces organizados y redes sociales.

## 🎨 Paleta de Colores

```css
--primario-100: #d4eaf7  /* Azul claro */
--acento-200: #00668c    /* Azul profundo (CTAs) */
--texto-100: #1d1c1c     /* Negro principal */
--bg-100: #fffefb        /* Blanco cálido */
```

## 🚀 Deployment

Configurado para deployment en **Netlify**:

```toml
[build]
  command = "npm run build"
  publish = "out"
```

## 📚 Documentación Completa

Para una guía detallada de onboarding, consulta [ONBOARDING.md](./ONBOARDING.md) que incluye:
- Arquitectura completa del proyecto
- Guía paso a paso para nuevos desarrolladores
- Sistema de diseño detallado
- Issues conocidos y roadmap
- Mejores prácticas y convenciones

## 🐛 Issues Conocidos

- Menú móvil hamburguesa pendiente de implementación completa
- Funcionalidad de reservas no implementada
- Analytics tracking pendiente
- Optimización de imágenes con next/image

## 🛣️ Roadmap

### Próximas Funcionalidades
- [ ] Sistema de reservas funcional
- [ ] Integración con backend/API
- [ ] Filtros y búsqueda de ofertas
- [ ] Analytics y tracking de conversiones
- [ ] Optimización de imágenes
- [ ] Tests unitarios y e2e
- [ ] Mejoras de accesibilidad (A11y)

## 📄 Licencia

Este proyecto es privado y está sujeto a los términos de uso de Airbnb.

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

Desarrollado con ❤️ para Airbnb

