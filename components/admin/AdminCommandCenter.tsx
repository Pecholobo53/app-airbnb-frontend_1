// components/admin/AdminCommandCenter.tsx
'use client';

import { useState } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { TrendingUp, Home, Sparkles, Server, ChevronDown } from 'lucide-react';

// Mini sparkline data (7 points)
const sparkData = [42, 68, 55, 80, 63, 90, 78];

// Occupancy
const OCCUPANCY = 78;
const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const occupancyOffset = CIRCUMFERENCE - (OCCUPANCY / 100) * CIRCUMFERENCE;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

const cardBase = {
  background: 'rgba(15, 23, 42, 0.85)',
  border: '1px solid rgba(30, 41, 59, 0.8)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
};

// ─── Progress bar helper ──────────────────────────────────────────
function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1 rounded-full bg-[#1e293b] overflow-hidden">
      <motion.div
        className="h-1 rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── "Ver detalles" footer toggle ────────────────────────────────
function CardFooter({ expanded }: { expanded: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#1e293b]/50">
      <span className="text-[10px] font-semibold text-[#475569]">
        {expanded ? 'Cerrar resumen' : 'Ver resumen'}
      </span>
      <motion.div
        animate={{ rotate: expanded ? 180 : 0 }}
        transition={{ duration: 0.22 }}
      >
        <ChevronDown className="w-3.5 h-3.5 text-[#475569]" />
      </motion.div>
    </div>
  );
}

// ─── Detail: Ingresos ─────────────────────────────────────────────
function DetailIngresos() {
  return (
    <div className="px-5 pb-5 pt-4 space-y-4">
      <div>
        <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-3">
          Ingresos por propiedad
        </p>
        <div className="space-y-2.5">
          {[
            { name: 'Villa Paraíso', amount: '€18.400', pct: 41 },
            { name: 'Ático Centro', amount: '€15.200', pct: 34 },
            { name: 'Riad Marrakech', amount: '€11.630', pct: 25 },
          ].map(({ name, amount, pct }) => (
            <div key={name}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#94a3b8]">{name}</span>
                <span className="text-texto-100 font-semibold">{amount}</span>
              </div>
              <Bar pct={pct} color="#0ea5e9" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-3">
          Evolución mensual
        </p>
        <div className="space-y-1.5">
          {[
            { month: 'Enero', amount: '€38.200', delta: '+8%' },
            { month: 'Febrero', amount: '€41.500', delta: '+9%' },
            { month: 'Marzo', amount: '€45.230', delta: '+12%', current: true },
          ].map(({ month, amount, delta, current }) => (
            <div key={month} className="flex items-center justify-between">
              <span className={`text-[11px] ${current ? 'text-texto-100 font-semibold' : 'text-[#64748b]'}`}>
                {month}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#94a3b8]">{amount}</span>
                <span className="text-[10px] font-bold text-[#34d399]">{delta}</span>
                {current && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(14,165,233,0.12)', color: '#0ea5e9' }}>
                    Actual
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[11px] mb-1.5">
          <span className="text-[#64748b]">Meta mensual: €50.000</span>
          <span className="font-bold text-[#0ea5e9]">90.5%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#1e293b] overflow-hidden">
          <motion.div
            className="h-1.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)' }}
            initial={{ width: 0 }}
            animate={{ width: '90.5%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Detail: Ocupación ────────────────────────────────────────────
function DetailOcupacion() {
  return (
    <div className="px-5 pb-5 pt-4 space-y-4">
      <div>
        <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-3">
          Próximos check-ins
        </p>
        <div className="space-y-2">
          {[
            { property: 'Villa Paraíso', date: '15 Mar', guest: 'María L.' },
            { property: 'Ático Centro', date: '17 Mar', guest: 'Carlos R.' },
            { property: 'Riad Fes', date: '20 Mar', guest: 'Sophie D.' },
          ].map(({ property, date, guest }) => (
            <div key={property} className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-texto-100 font-semibold">{property}</p>
                <p className="text-[10px] text-[#64748b]">{guest}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
                {date}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-3">
          Ocupación por propiedad
        </p>
        <div className="space-y-2.5">
          {[
            { name: 'Villa Paraíso', nights: 12, total: 15 },
            { name: 'Ático Centro', nights: 8, total: 15 },
            { name: 'Riad Marrakech', nights: 11, total: 15 },
          ].map(({ name, nights, total }) => (
            <div key={name}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#94a3b8]">{name}</span>
                <span className="text-texto-100 font-semibold">{nights}/{total} noches</span>
              </div>
              <Bar pct={(nights / total) * 100} color="#a78bfa" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1e293b]/60">
        <span className="text-[#64748b]">Estancia media</span>
        <span className="text-[#a78bfa] font-bold">4.3 noches</span>
      </div>
    </div>
  );
}

// ─── Detail: Newsletter ───────────────────────────────────────────
function DetailNewsletter() {
  return (
    <div className="px-5 pb-5 pt-4 space-y-4">
      <div className="p-3 rounded-xl"
        style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.12)' }}>
        <p className="text-[10px] font-bold text-[#fbbf24] mb-1">Última campaña</p>
        <p className="text-[11px] text-texto-100 font-semibold">"Ofertas Especiales de Primavera"</p>
        <p className="text-[10px] text-[#64748b] mt-0.5">Hace 3 días · 12.847 destinatarios</p>
      </div>

      <div>
        <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-3">
          Métricas de campaña
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Apertura', value: '68%' },
            { label: 'Clic', value: '12%' },
            { label: 'Bajas', value: '0.3%' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[14px] font-black text-texto-100">{value}</p>
              <p className="text-[9px] text-[#64748b] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-3">
          Top países de origen
        </p>
        <div className="space-y-2">
          {[
            { country: '🇪🇸 España', pct: 48 },
            { country: '🇫🇷 Francia', pct: 23 },
            { country: '🇲🇦 Marruecos', pct: 15 },
          ].map(({ country, pct }) => (
            <div key={country} className="flex items-center gap-2">
              <span className="text-[11px] text-[#94a3b8] w-24 flex-shrink-0">{country}</span>
              <div className="flex-1">
                <Bar pct={pct} color="#fbbf24" />
              </div>
              <span className="text-[10px] text-[#64748b] w-7 text-right">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Detail: Sistema ──────────────────────────────────────────────
function DetailSistema() {
  return (
    <div className="px-5 pb-5 pt-4 space-y-4">
      <div>
        <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-3">
          Tiempos de respuesta
        </p>
        <div className="space-y-2.5">
          {[
            { service: 'API Backend', ms: 42 },
            { service: 'Base de datos', ms: 18 },
            { service: 'Pasarela de pago', ms: 156 },
          ].map(({ service, ms }) => {
            const color = ms < 100 ? '#34d399' : '#fbbf24';
            return (
              <div key={service}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#94a3b8]">{service}</span>
                  <span className="font-bold" style={{ color }}>{ms}ms</span>
                </div>
                <Bar pct={(ms / 250) * 100} color={color} />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-3">
          Registro de eventos (24h)
        </p>
        <div className="space-y-2">
          {[
            { time: '02:15', event: 'Backup automático completado' },
            { time: '08:42', event: 'Certificado SSL renovado' },
          ].map(({ time, event }) => (
            <div key={time} className="flex items-center gap-2.5">
              <span className="text-[10px] text-[#475569] font-mono flex-shrink-0">{time}</span>
              <span className="text-[11px] text-[#94a3b8]">{event}</span>
              <span className="text-[10px] text-[#34d399] ml-auto">✓</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1e293b]/60">
        <span className="text-[#64748b]">Próximo mantenimiento</span>
        <span className="text-[#34d399] font-semibold">15 Mar · 02:00</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
export function AdminCommandCenter() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggle = (i: number) =>
    setExpandedCard((prev) => (prev === i ? null : i));

  return (
    <div className="relative">
      {/* Subtle background blobs */}
      <motion.div
        className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], x: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)' }}
        animate={{ scale: [1.1, 1, 1.1], y: [0, 8, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* ─── Card 1: Ingresos Totales ─── */}
        <motion.div
          variants={cardVariants}
          className="rounded-2xl cursor-pointer select-none"
          style={cardBase}
          whileHover={expandedCard !== 0
            ? { boxShadow: '0 0 0 1px rgba(14,165,233,0.25), 0 20px 40px rgba(0,0,0,0.3)' }
            : { boxShadow: '0 0 0 1px rgba(14,165,233,0.35), 0 20px 40px rgba(0,0,0,0.4)' }}
          onClick={() => toggle(0)}
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(14,165,233,0.12)' }}>
                <TrendingUp style={{ width: 18, height: 18, color: '#0ea5e9' }} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                ↑ 12% vs mes ant.
              </span>
            </div>
            <div className="text-2xl font-black text-texto-100 mb-0.5">€45.230</div>
            <div className="text-[11px] font-medium text-[#64748b] mb-4">Ingresos Totales</div>
            <div className="flex items-end gap-1 h-10">
              {sparkData.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: 'easeOut' }}
                  style={{
                    height: `${(v / 100) * 40}px`,
                    background: i === sparkData.length - 1 ? '#0ea5e9' : 'rgba(14,165,233,0.3)',
                    borderRadius: 3,
                    flex: 1,
                    transformOrigin: 'bottom',
                  }}
                />
              ))}
            </div>
            <div className="text-[10px] text-[#475569] mt-1.5">Últimos 7 días</div>
          </div>

          <CardFooter expanded={expandedCard === 0} />

          <AnimatePresence initial={false}>
            {expandedCard === 0 && (
              <motion.div
                key="detail-0"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: 'hidden' }}
              >
                <div className="border-t border-[#1e293b]/50">
                  <DetailIngresos />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── Card 2: Ocupación ─── */}
        <motion.div
          variants={cardVariants}
          className="rounded-2xl cursor-pointer select-none"
          style={cardBase}
          whileHover={expandedCard !== 1
            ? { boxShadow: '0 0 0 1px rgba(167,139,250,0.25), 0 20px 40px rgba(0,0,0,0.3)' }
            : { boxShadow: '0 0 0 1px rgba(167,139,250,0.35), 0 20px 40px rgba(0,0,0,0.4)' }}
          onClick={() => toggle(1)}
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(167,139,250,0.12)' }}>
                <Home style={{ width: 18, height: 18, color: '#a78bfa' }} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
                Este mes
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <svg width={72} height={72} viewBox="0 0 72 72">
                  <circle cx={36} cy={36} r={RADIUS} fill="none"
                    stroke="rgba(167,139,250,0.12)" strokeWidth={6} />
                  <motion.circle
                    cx={36} cy={36} r={RADIUS} fill="none"
                    stroke="#a78bfa" strokeWidth={6} strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    initial={{ strokeDashoffset: CIRCUMFERENCE }}
                    animate={{ strokeDashoffset: occupancyOffset }}
                    transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[15px] font-black text-texto-100">{OCCUPANCY}%</span>
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-texto-100 mb-0.5">31 / 40</div>
                <div className="text-[11px] text-[#64748b]">propiedades ocupadas</div>
                <div className="text-[11px] text-[#a78bfa] font-semibold mt-1">+5 vs semana pasada</div>
              </div>
            </div>
          </div>

          <CardFooter expanded={expandedCard === 1} />

          <AnimatePresence initial={false}>
            {expandedCard === 1 && (
              <motion.div
                key="detail-1"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: 'hidden' }}
              >
                <div className="border-t border-[#1e293b]/50">
                  <DetailOcupacion />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── Card 3: Nuevos Leads ─── */}
        <motion.div
          variants={cardVariants}
          className="rounded-2xl cursor-pointer select-none"
          style={cardBase}
          whileHover={expandedCard !== 2
            ? { boxShadow: '0 0 0 1px rgba(251,191,36,0.25), 0 20px 40px rgba(0,0,0,0.3)' }
            : { boxShadow: '0 0 0 1px rgba(251,191,36,0.35), 0 20px 40px rgba(0,0,0,0.4)' }}
          onClick={() => toggle(2)}
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(251,191,36,0.12)' }}>
                <motion.div
                  animate={{ rotate: [0, 12, -12, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles style={{ width: 18, height: 18, color: '#fbbf24' }} />
                </motion.div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                Newsletter
              </span>
            </div>
            <div className="text-2xl font-black text-texto-100 mb-0.5">127</div>
            <div className="text-[11px] font-medium text-[#64748b] mb-4">Nuevos suscriptores</div>
            <div className="space-y-1.5">
              {['ana.m@gmail.com', 'carlos.r@hotmail.com', 'lucia.v@yahoo.es'].map((email, i) => (
                <motion.div key={email}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] flex-shrink-0" />
                  <span className="text-[10px] text-[#475569] truncate">{email}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <CardFooter expanded={expandedCard === 2} />

          <AnimatePresence initial={false}>
            {expandedCard === 2 && (
              <motion.div
                key="detail-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: 'hidden' }}
              >
                <div className="border-t border-[#1e293b]/50">
                  <DetailNewsletter />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── Card 4: Estado del Sistema ─── */}
        <motion.div
          variants={cardVariants}
          className="rounded-2xl cursor-pointer select-none"
          style={cardBase}
          whileHover={expandedCard !== 3
            ? { boxShadow: '0 0 0 1px rgba(52,211,153,0.25), 0 20px 40px rgba(0,0,0,0.3)' }
            : { boxShadow: '0 0 0 1px rgba(52,211,153,0.35), 0 20px 40px rgba(0,0,0,0.4)' }}
          onClick={() => toggle(3)}
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(52,211,153,0.12)' }}>
                <Server style={{ width: 18, height: 18, color: '#34d399' }} />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34d399]" />
                </span>
                <span className="text-[10px] font-bold text-[#34d399]">LIVE</span>
              </div>
            </div>
            <div className="text-2xl font-black text-texto-100 mb-0.5">100%</div>
            <div className="text-[11px] font-medium text-[#64748b] mb-4">Uptime del sistema</div>
            <div className="space-y-2">
              {[
                { label: 'API Backend', ok: true },
                { label: 'Base de datos', ok: true },
                { label: 'Pasarela de pago', ok: true },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px] text-[#64748b]">{label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={ok
                      ? { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }
                      : { background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                    {ok ? '✓ Operativo' : '✗ Error'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <CardFooter expanded={expandedCard === 3} />

          <AnimatePresence initial={false}>
            {expandedCard === 3 && (
              <motion.div
                key="detail-3"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: 'hidden' }}
              >
                <div className="border-t border-[#1e293b]/50">
                  <DetailSistema />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </motion.div>
    </div>
  );
}
