'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Instagram, Twitter, Facebook, Youtube, ArrowRight, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

const links = {
  soporte: [
    { label: 'Centro de Ayuda', href: '#' },
    { label: 'Contactar con soporte', href: '#' },
    { label: 'Cancelar reserva', href: '#' },
    { label: 'Política de reembolsos', href: '#' },
  ],
  anfitrion: [
    { label: 'Publicar mi propiedad', href: '#' },
    { label: 'Recursos para anfitriones', href: '#' },
    { label: 'Comunidad de anfitriones', href: '#' },
    { label: 'Programa premium', href: '#' },
  ],
  empresa: [
    { label: 'Quiénes somos', href: '#' },
    { label: 'Sala de prensa', href: '#' },
    { label: 'Trabaja con nosotros', href: '#' },
    { label: 'Sostenibilidad', href: '#' },
  ],
};

const socials = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
];

/**
 * Footer — Diseño premium con jerarquía tipográfica clara y paleta rica.
 * Incluye franja newsletter, columnas de enlaces con hover accent, legales.
 */
export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white">

      {/* Newsletter strip */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Ofertas exclusivas, solo para suscriptores
              </h3>
              <p className="text-sm text-gray-400">
                Recibe primero las mejores estancias antes de que se publiquen al público.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full md:w-auto gap-2"
            >
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 md:w-64 bg-white/8 border border-white/12 text-white placeholder-gray-500 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#FF385C]/60 transition-colors"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
              >
                Suscribirme
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand col — spans 2 on md */}
          <div className="col-span-2 space-y-5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF385C] to-[#E31C5F] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF385C]/30">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tight">StayLux</span>
            </Link>

            {/* Tagline */}
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Residencias de élite curadas a mano. Cada estancia es una experiencia
              que merece ser recordada.
            </p>

            {/* Trust pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/6 border border-white/10 rounded-full text-xs text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              +2 millones de huéspedes satisfechos
            </div>

            {/* Contact */}
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                hola@staylux.es
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                +34 900 123 456
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Madrid, España
              </div>
            </div>
          </div>

          {/* Links columns */}
          {(
            [
              { title: 'Soporte', items: links.soporte },
              { title: 'Anfitrión', items: links.anfitrion },
              { title: 'Empresa', items: links.empresa },
            ] as const
          ).map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold text-[#FF385C] uppercase tracking-[0.18em] mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Legal links */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500">
              <span>© 2025 StayLux, S.L. Todos los derechos reservados.</span>
              <Link href="#" className="hover:text-gray-300 transition-colors">Privacidad</Link>
              <Link href="#" className="hover:text-gray-300 transition-colors">Términos</Link>
              <Link href="#" className="hover:text-gray-300 transition-colors">Cookies</Link>
              <Link href="#" className="hover:text-gray-300 transition-colors">Aviso legal</Link>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF385C] hover:border-[#FF385C] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
