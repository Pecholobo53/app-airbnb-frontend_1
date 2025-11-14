# 🏠 Airbnb Clone - Plataforma Completa

> Plataforma completa tipo Airbnb construida con Next.js 13, React 18, TypeScript y Tailwind CSS. Implementación progresiva por milestones con datos MOCK.

![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38bdf8)
![Progreso](https://img.shields.io/badge/Progreso-20%25-green)

## 📊 Estado del Proyecto

| Milestone | Estado | Progreso |
|-----------|--------|----------|
| **M1: Autenticación** | ✅ Completado | 100% (25/25 tareas) |
| **M2: Búsqueda y Filtros** | 🔵 Planificado | 0% (0/28 tareas) |
| **M3: Detalle de Propiedad** | ⚪ Pendiente | - |
| **M4: Sistema de Favoritos** | ⚪ Pendiente | - |
| **M5: Backend Real** | ⚪ Pendiente | - |

## ✨ Características Implementadas

### ✅ Milestone 1: Sistema de Autenticación (COMPLETADO)
- 🔐 Registro con email/password
- 🔑 Login con email/password
- 🌐 OAuth social (Google/Facebook) - Simulado
- 📧 Recuperación de contraseña
- ✉️ Verificación de email
- 👤 Gestión de perfil de usuario
- 🛡️ Protección de rutas privadas
- 💾 Persistencia de sesión
- 🎨 UI/UX profesional con Shadcn/UI

### 🔵 Milestone 2: Búsqueda y Filtros (PLANIFICADO)
- 🔍 Búsqueda por ubicación con autocompletado
- 📅 Selector de fechas (check-in/check-out)
- 👥 Selector de huéspedes
- 💰 Filtro por rango de precio
- 🏠 Filtro por tipo de propiedad
- ✨ Filtro por amenidades
- ⭐ Filtro por calificación
- 📊 Grid de resultados responsive
- 🗺️ Vista de mapa (opcional)

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo
npm run dev

# 3. Abrir en navegador
# http://localhost:3000
```

### ⚡ Probar Autenticación (30 segundos)

1. Click en **"Iniciar sesión"** en el header
2. Usar credenciales:
   ```
   Email: demo@airbnb.com
   Password: password123
   ```
3. ¡Listo! Verás tu perfil en el header

📚 **Guía completa**: Ver `QUICK_START_AUTH.md`

## 📦 Stack Tecnológico

- **Framework**: Next.js 13.5.1
- **UI Library**: React 18.2.0
- **Lenguaje**: TypeScript 5.2.2
- **Estilos**: Tailwind CSS 3.3.3
- **Componentes**: Shadcn/UI + Radix UI
- **Iconos**: Lucide React
- **Fuente**: DM Sans (Google Fonts)

## 📚 Documentación Disponible

| Documento | Descripción | Para Quién |
|-----------|-------------|------------|
| `PROJECT_INDEX.md` | 📚 Índice completo del proyecto | Todos |
| `ONBOARDING.md` | 🎓 Guía para nuevos desarrolladores | Nuevos |
| `ARCHITECTURE.md` | 🏗️ Arquitectura técnica completa | Técnicos |
| `MILESTONE_1.md` | ✅ Plan auth (completado) | Desarrolladores |
| `MILESTONE_2.md` | 🔵 Plan búsqueda (planificado) | Desarrolladores |
| `AUTH_DOCUMENTATION.md` | 🔐 Guía completa de auth | Desarrolladores |
| `QUICK_START_AUTH.md` | ⚡ Inicio rápido auth (5 min) | Todos |
| `QUICK_START_MILESTONE2.md` | ⚡ Inicio rápido búsqueda | Desarrolladores |
| `IMPLEMENTATION_SUMMARY.md` | 📊 Resumen ejecutivo | Stakeholders |

📖 **Empieza aquí**: `PROJECT_INDEX.md` para vista completa

## 🎯 Estructura del Proyecto

```
project/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Páginas de autenticación ✅
│   │   ├── login/        # Login
│   │   ├── registro/     # Registro
│   │   └── recuperar-password/
│   ├── perfil/           # Perfil de usuario ✅
│   ├── buscar/           # Búsqueda (Milestone 2) 🔵
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Home
│
├── components/           # Componentes React
│   ├── auth/            # Auth components ✅
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── UserMenu.tsx
│   │   └── ...
│   ├── search/          # Search components 🔵
│   ├── ui/              # Shadcn/UI components
│   └── ...
│
├── lib/                 # Servicios y utilidades
│   ├── auth/           # Auth services ✅
│   │   ├── auth-context.tsx
│   │   ├── mock-auth-service.ts
│   │   └── validators.ts
│   └── search/         # Search services 🔵
│
└── types/              # TypeScript interfaces
    ├── auth.ts         # Auth types ✅
    └── search.ts       # Search types 🔵
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

## 🎯 Roadmap y Próximos Pasos

### ✅ Completado
- [x] **Milestone 1**: Sistema de autenticación completo
- [x] Landing page con diseño profesional
- [x] Componentes UI base con Shadcn
- [x] Documentación completa del proyecto

### 🔵 En Progreso / Planificado
- [ ] **Milestone 2**: Sistema de búsqueda y filtros (Semana 3)
- [ ] **Milestone 3**: Página de detalle de propiedad (Semana 4)
- [ ] **Milestone 4**: Sistema de favoritos (Semana 5-6)

### ⚪ Futuro
- [ ] **Milestone 5**: Integración con backend real
- [ ] Sistema de reservas funcional
- [ ] Sistema de pagos (Stripe)
- [ ] Chat en tiempo real
- [ ] Panel de administrador
- [ ] App móvil (React Native)
- [ ] Tests automatizados (E2E + Unit)

## 🐛 Issues Conocidos

### Limitaciones Actuales (Modo MOCK)
- ⚠️ Datos en memoria (se pierden al cerrar navegador)
- ⚠️ Sin backend real (todo simulado)
- ⚠️ OAuth social simulado (no OAuth real)
- ⚠️ Emails no se envían (solo logs en consola)

### Para Producción
- Migrar a backend real (Next.js API Routes + Supabase/Firebase)
- Implementar NextAuth.js para OAuth real
- Añadir envío de emails (SendGrid/Mailgun)
- Optimización de imágenes con next/image
- Analytics tracking (Google Analytics / Mixpanel)
- Testing automatizado completo

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



