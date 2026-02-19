// components/admin/NotificationCenter.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, ShoppingCart, CreditCard, User, AlertTriangle, Mail,
  CheckCheck, ArrowRight,
} from 'lucide-react';

interface Notification {
  id: number;
  icon: React.ElementType;
  title: string;
  desc: string;
  time: string;
  cat: string;
  catColor: string;
  catBg: string;
  catBorder: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1, icon: ShoppingCart,
    title: 'Nueva reserva en Villa Paraíso',
    desc: 'Juan García · 5 noches · €1.250',
    time: 'Hace 5 min',
    cat: 'Ventas', catColor: '#34d399', catBg: 'rgba(52,211,153,0.12)', catBorder: 'rgba(52,211,153,0.25)',
    read: false,
  },
  {
    id: 2, icon: CreditCard,
    title: 'Pago verificado · €340',
    desc: 'María López · Ático Centro · Confirmado',
    time: 'Hace 12 min',
    cat: 'Ventas', catColor: '#34d399', catBg: 'rgba(52,211,153,0.12)', catBorder: 'rgba(52,211,153,0.25)',
    read: false,
  },
  {
    id: 3, icon: User,
    title: 'Nuevo usuario registrado',
    desc: 'carlos.ruiz@example.com se ha unido',
    time: 'Hace 1h',
    cat: 'Usuarios', catColor: '#0ea5e9', catBg: 'rgba(14,165,233,0.12)', catBorder: 'rgba(14,165,233,0.25)',
    read: false,
  },
  {
    id: 4, icon: Mail,
    title: 'Nueva suscripción al Newsletter',
    desc: 'ana.martin@gmail.com · Desde Footer',
    time: 'Hace 2h',
    cat: 'Marketing', catColor: '#a78bfa', catBg: 'rgba(167,139,250,0.12)', catBorder: 'rgba(167,139,250,0.25)',
    read: true,
  },
  {
    id: 5, icon: AlertTriangle,
    title: 'Propiedad sin disponibilidad',
    desc: 'Ático Centro · Julio totalmente ocupado',
    time: 'Hace 3h',
    cat: 'Alertas', catColor: '#fbbf24', catBg: 'rgba(251,191,36,0.12)', catBorder: 'rgba(251,191,36,0.25)',
    read: true,
  },
];

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-xl bg-[#1e293b] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-texto-100 hover:border-admin-accent/40 transition-all duration-200"
      >
        <Bell className="w-4 h-4" />
        {/* Unread badge with ping */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="absolute -top-1 -right-1"
            >
              {/* Ping ring */}
              <span className="absolute inline-flex h-full w-full rounded-full bg-acento-200 opacity-60 animate-ping" />
              {/* Badge */}
              <span className="relative flex items-center justify-center w-4 h-4 rounded-full bg-acento-200 text-[9px] font-black text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.94, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl overflow-hidden z-50 shadow-2xl"
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(30, 41, 59, 0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(30,41,59,0.5)',
            }}
          >
            {/* Radial gradient accent top-right */}
            <div
              className="absolute top-0 right-0 w-48 h-32 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top right, rgba(14,165,233,0.12) 0%, transparent 70%)' }}
            />

            {/* Header */}
            <div className="relative px-4 py-3.5 border-b border-[#1e293b]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-admin-accent" />
                <span className="text-sm font-bold text-texto-100">Notificaciones</span>
                {unreadCount > 0 && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,56,92,0.15)', color: '#FF385C', border: '1px solid rgba(255,56,92,0.3)' }}
                  >
                    {unreadCount} nuevas
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-[#64748b] hover:text-[#94a3b8] transition-colors"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Todo leído
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#475569] hover:text-texto-100 hover:bg-[#1e293b] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              >
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <motion.div
                      key={notif.id}
                      variants={{
                        hidden: { opacity: 0, x: -8 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
                      }}
                      className={`relative px-4 py-3.5 border-b border-[#1e293b]/40 flex gap-3 hover:bg-[#1e293b]/30 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-admin-accent/3' : ''
                      }`}
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                        )
                      }
                    >
                      {/* Unread dot */}
                      {!notif.read && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-admin-accent" />
                      )}

                      {/* Icon */}
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: notif.catBg, border: `1px solid ${notif.catBorder}` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: notif.catColor }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <p className={`text-[12px] font-semibold leading-tight ${notif.read ? 'text-[#94a3b8]' : 'text-texto-100'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-[#475569] whitespace-nowrap flex-shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-[#475569] truncate mb-1.5">{notif.desc}</p>
                        {/* Category pill */}
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ color: notif.catColor, background: notif.catBg, border: `1px solid ${notif.catBorder}` }}
                        >
                          {notif.cat}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 flex items-center justify-center border-t border-[#1e293b]/60">
              <button className="flex items-center gap-1.5 text-[12px] font-semibold text-admin-accent hover:text-[#38bdf8] transition-colors">
                Ver todo el historial
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
