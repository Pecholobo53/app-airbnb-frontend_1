'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Instagram, Twitter, Facebook, Youtube, ArrowRight, MapPin, Phone, Mail, ShieldCheck, Sparkles, Gift, Bell, Zap, CheckCircle2, Users, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { subscribeNewsletter, getSubscriptionStatus } from '@/lib/newsletter/newsletter-service';
import BrandLogo from '@/components/BrandLogo';

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

const benefits = [
  { icon: Gift, label: 'Descuentos de hasta 40%' },
  { icon: Bell, label: 'Alertas antes que nadie' },
  { icon: Zap, label: 'Ofertas flash exclusivas' },
];

/**
 * Footer — Diseño premium con jerarquía tipográfica clara y paleta rica.
 * Incluye franja newsletter animada, columnas de enlaces con hover accent, legales.
 */
export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [focused, setFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('newsletter_last_email');
    if (saved && getSubscriptionStatus(saved)) {
      setSubscribed(true);
      setSuccessMessage('¡Ya estás suscrito!');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    setError('');
    setIsLoading(true);

    const result = await subscribeNewsletter(email);

    setIsLoading(false);

    if (result.success) {
      localStorage.setItem('newsletter_last_email', email.trim().toLowerCase());
      setSuccessMessage(result.message);
      setSubscribed(true);
    } else {
      setError(result.message);
    }
  };

  return (
    <footer className="bg-[#0D0D0D] text-white">

      {/* ══════════ NEWSLETTER — Full impact section ══════════ */}
      <div className="relative overflow-hidden border-b border-white/8">

        {/* Animated blob 1 */}
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,56,92,0.22) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.18, 1], x: [0, 30, 0], y: [0, -15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Animated blob 2 */}
        <motion.div
          className="absolute -bottom-24 -right-16 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,56,92,0.14) 0%, transparent 65%)' }}
          animate={{ scale: [1.15, 1, 1.15], x: [0, -20, 0], y: [0, 12, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,56,92,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,56,92,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-acento-200 pointer-events-none"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              opacity: 0.4 + (i % 3) * 0.2,
            }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">

          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-6"
            style={{
              background: 'rgba(255,56,92,0.12)',
              borderColor: 'rgba(255,56,92,0.35)',
              color: '#FF385C',
            }}
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.span>
            Acceso anticipado exclusivo
          </motion.div>

          {/* Heading */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3"
          >
            Estancias irrepetibles,{' '}
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #FF385C 0%, #ff7e95 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              solo para ti
            </span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed"
          >
            Suscríbete y recibe ofertas exclusivas antes de que se publiquen.
            Sin spam, solo alojamientos de élite.
          </motion.p>

          {/* Benefit pills */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
            }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {benefits.map(({ icon: Icon, label }) => (
              <motion.span
                key={label}
                variants={{
                  hidden: { opacity: 0, scale: 0.85, y: 8 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-300 border border-white/10 bg-white/5"
              >
                <Icon className="w-3.5 h-3.5 text-acento-200" />
                {label}
              </motion.span>
            ))}
          </motion.div>

          {/* Form / Success */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border"
                  style={{ background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-emerald-400">¡Ya eres parte del club!</p>
                    <p className="text-xs text-gray-400">{successMessage || 'Revisa tu email para confirmarlo.'}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
                >
                  {/* Input con borde cónico giratorio */}
                  <div className="relative flex-1 p-[1.5px] rounded-xl overflow-hidden">
                    {/* Conic gradient giratorio — crea el borde animado */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background:
                          'conic-gradient(from 0deg at 50% 50%, rgba(255,56,92,0) 0deg, rgba(255,56,92,0.5) 45deg, #FF385C 90deg, #ff9eb0 135deg, #FF385C 180deg, rgba(255,56,92,0.5) 225deg, rgba(255,56,92,0) 270deg, rgba(255,56,92,0) 360deg)',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Glow exterior pulsante */}
                    <motion.div
                      className="absolute -inset-1 rounded-xl pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(255,56,92,0.25) 0%, transparent 70%)',
                        filter: 'blur(8px)',
                      }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {/* Fondo oscuro del input — crea la ilusión de borde */}
                    <div className="relative rounded-[10px] overflow-hidden" style={{ background: '#0D0D0D' }}>
                      {focused && (
                        <div
                          className="absolute inset-0 rounded-[10px] pointer-events-none z-10"
                          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,56,92,0.5), 0 0 20px rgba(255,56,92,0.2)' }}
                        />
                      )}
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="tu@email.com"
                        required
                        className="relative z-[1] w-full text-white placeholder-gray-500 text-sm px-4 py-3.5 focus:outline-none"
                        style={{ background: 'transparent', border: 'none' }}
                      />
                    </div>
                  </div>
                  {/* CTA button with pulse glow */}
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-acento-200 blur-md opacity-50 pointer-events-none"
                      animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.05, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={isLoading ? {} : { scale: 1.04 }}
                      whileTap={isLoading ? {} : { scale: 0.97 }}
                      className="relative flex items-center justify-center gap-2 bg-acento-200 hover:bg-acento-100 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors whitespace-nowrap shadow-lg shadow-acento-200/25 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Suscribiendo...
                        </>
                      ) : (
                        <>
                          Suscribirme gratis
                          <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-xs text-red-400 sm:col-span-2 justify-center mt-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-500"
          >
            <div className="flex -space-x-2">
              {['bg-acento-200', 'bg-admin-accent', 'bg-emerald-500', 'bg-amber-500'].map((bg, i) => (
                <div key={i} className={`w-6 h-6 rounded-full ${bg} border-2 border-[#0D0D0D] flex items-center justify-center text-[9px] font-bold text-white`}>
                  {['A', 'M', 'J', 'S'][i]}
                </div>
              ))}
            </div>
            <span>
              <span className="text-white font-semibold">+52.000 viajeros</span> ya suscritos · Sin spam · Cancela cuando quieras
            </span>
          </motion.div>

        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand col — spans 2 on md */}
          <div className="col-span-2 space-y-5">
            {/* Logo */}
            <BrandLogo variant="dark" size="lg" />

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
              <h4 className="text-xs font-bold text-acento-200 uppercase tracking-[0.18em] mb-5">
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
              <span>© {new Date().getFullYear()} VoyagerAuMaroc. Todos los derechos reservados.</span>
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
                  className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-acento-200 hover:border-acento-200 transition-all duration-200"
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
