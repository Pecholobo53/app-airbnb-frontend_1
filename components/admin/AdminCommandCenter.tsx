// components/admin/AdminCommandCenter.tsx
'use client';

import { motion, type Variants } from 'framer-motion';
import { TrendingUp, Home, Sparkles, Server } from 'lucide-react';

// Mini sparkline data (7 points, % de ingresos diarios relativos)
const sparkData = [42, 68, 55, 80, 63, 90, 78];

// Occupancy %
const OCCUPANCY = 78;

// Circular progress helpers
const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const occupancyOffset = CIRCUMFERENCE - (OCCUPANCY / 100) * CIRCUMFERENCE;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
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

export function AdminCommandCenter() {
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
          className="rounded-2xl p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
          style={{
            ...cardBase,
            boxShadow: '0 0 0 0px rgba(14,165,233,0)',
          }}
          whileHover={{ boxShadow: '0 0 0 1px rgba(14,165,233,0.2), 0 20px 40px rgba(0,0,0,0.3)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(14,165,233,0.12)' }}>
              <TrendingUp className="w-4.5 h-4.5 text-admin-accent" style={{ width: 18, height: 18 }} />
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}
            >
              ↑ 12% vs mes ant.
            </span>
          </div>
          <div className="text-2xl font-black text-texto-100 mb-0.5">€45.230</div>
          <div className="text-[11px] font-medium text-[#64748b] mb-4">Ingresos Totales</div>

          {/* Mini sparkline */}
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
        </motion.div>

        {/* ─── Card 2: Ocupación ─── */}
        <motion.div
          variants={cardVariants}
          className="rounded-2xl p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
          style={cardBase}
          whileHover={{ boxShadow: '0 0 0 1px rgba(167,139,250,0.2), 0 20px 40px rgba(0,0,0,0.3)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.12)' }}>
              <Home className="w-4.5 h-4.5 text-[#a78bfa]" style={{ width: 18, height: 18 }} />
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}
            >
              Este mes
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Circular SVG progress */}
            <div className="relative flex-shrink-0">
              <svg width={72} height={72} viewBox="0 0 72 72">
                {/* Track */}
                <circle
                  cx={36} cy={36} r={RADIUS}
                  fill="none"
                  stroke="rgba(167,139,250,0.12)"
                  strokeWidth={6}
                />
                {/* Progress */}
                <motion.circle
                  cx={36} cy={36} r={RADIUS}
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth={6}
                  strokeLinecap="round"
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
        </motion.div>

        {/* ─── Card 3: Nuevos Leads ─── */}
        <motion.div
          variants={cardVariants}
          className="rounded-2xl p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
          style={cardBase}
          whileHover={{ boxShadow: '0 0 0 1px rgba(251,191,36,0.2), 0 20px 40px rgba(0,0,0,0.3)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.12)' }}>
              <motion.div
                animate={{ rotate: [0, 12, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="text-[#fbbf24]" style={{ width: 18, height: 18 }} />
              </motion.div>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}
            >
              Newsletter
            </span>
          </div>
          <div className="text-2xl font-black text-texto-100 mb-0.5">127</div>
          <div className="text-[11px] font-medium text-[#64748b] mb-4">Nuevos suscriptores</div>

          {/* Recent subscriber pills */}
          <div className="space-y-1.5">
            {['ana.m@gmail.com', 'carlos.r@hotmail.com', 'lucia.v@yahoo.es'].map((email, i) => (
              <motion.div
                key={email}
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
        </motion.div>

        {/* ─── Card 4: Estado del Sistema ─── */}
        <motion.div
          variants={cardVariants}
          className="rounded-2xl p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
          style={cardBase}
          whileHover={{ boxShadow: '0 0 0 1px rgba(52,211,153,0.2), 0 20px 40px rgba(0,0,0,0.3)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.12)' }}>
              <Server className="text-[#34d399]" style={{ width: 18, height: 18 }} />
            </div>
            {/* Live badge with pulse */}
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

          {/* Service status rows */}
          <div className="space-y-2">
            {[
              { label: 'API Backend', ok: true },
              { label: 'Base de datos', ok: true },
              { label: 'Pasarela de pago', ok: true },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[11px] text-[#64748b]">{label}</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={
                    ok
                      ? { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }
                      : { background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }
                  }
                >
                  {ok ? '✓ Operativo' : '✗ Error'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
