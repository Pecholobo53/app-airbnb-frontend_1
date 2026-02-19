// app/admin/activity/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Activity, ArrowLeft, Search, Filter, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface ActivityLog {
  id: string;
  type: 'user' | 'system' | 'auth' | 'admin';
  action: string;
  description: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  timestamp: Date;
  ipAddress?: string;
  status: 'success' | 'error' | 'warning' | 'info';
}

// Mock data - En producción esto vendría del backend
const generateMockLogs = (): ActivityLog[] => {
  const actions = [
    { action: 'Login', type: 'auth' as const, status: 'success' as const },
    { action: 'Logout', type: 'auth' as const, status: 'info' as const },
    { action: 'Crear Usuario', type: 'admin' as const, status: 'success' as const },
    { action: 'Actualizar Usuario', type: 'admin' as const, status: 'success' as const },
    { action: 'Eliminar Usuario', type: 'admin' as const, status: 'warning' as const },
    { action: 'Cambiar Rol', type: 'admin' as const, status: 'success' as const },
    { action: 'Error de Autenticación', type: 'auth' as const, status: 'error' as const },
    { action: 'Actualización de Sistema', type: 'system' as const, status: 'info' as const },
  ];

  const users = [
    { name: 'Armando', email: 'armandito@gmail.com' },
    { name: 'Juan Pérez', email: 'juan@example.com' },
    { name: 'María García', email: 'maria@example.com' },
  ];

  const logs: ActivityLog[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const hoursAgo = Math.floor(Math.random() * 168); // Últimas 7 días
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

    logs.push({
      id: `log-${i}`,
      type: action.type,
      action: action.action,
      description: `${action.action} realizado por ${user.name}`,
      userId: `user-${i % 3}`,
      userName: user.name,
      userEmail: user.email,
      timestamp,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      status: action.status,
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchQuery, typeFilter, statusFilter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      // Simular carga de logs
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockLogs = generateMockLogs();
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        log =>
          log.action.toLowerCase().includes(query) ||
          log.description.toLowerCase().includes(query) ||
          log.userName?.toLowerCase().includes(query) ||
          log.userEmail?.toLowerCase().includes(query)
      );
    }

    // Filtrar por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(log => log.type === typeFilter);
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    setFilteredLogs(filtered);
  };

  const getStatusBadge = (status: ActivityLog['status']) => {
    const variants = {
      success: { className: 'bg-green-100 text-green-800', label: 'Éxito' },
      error: { className: 'bg-red-100 text-red-800', label: 'Error' },
      warning: { className: 'bg-yellow-100 text-yellow-800', label: 'Advertencia' },
      info: { className: 'bg-blue-100 text-blue-800', label: 'Info' },
    };

    const variant = variants[status];
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: ActivityLog['type']) => {
    const variants = {
      user: { className: 'bg-gray-100 text-gray-800', label: 'Usuario' },
      system: { className: 'bg-blue-100 text-blue-800', label: 'Sistema' },
      auth: { className: 'bg-purple-100 text-purple-800', label: 'Autenticación' },
      admin: { className: 'bg-orange-100 text-orange-800', label: 'Administración' },
    };

    const variant = variants[type];
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const cardStyle = {
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(8px)',
  };

  const statusConfig = {
    success: { dot: '#34d399', label: 'Éxito', bg: 'rgba(52,211,153,0.12)', text: '#34d399', border: 'rgba(52,211,153,0.25)' },
    error:   { dot: '#f87171', label: 'Error', bg: 'rgba(248,113,113,0.12)', text: '#f87171', border: 'rgba(248,113,113,0.25)' },
    warning: { dot: '#fbbf24', label: 'Alerta', bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
    info:    { dot: '#0ea5e9', label: 'Info', bg: 'rgba(14,165,233,0.12)', text: '#0ea5e9', border: 'rgba(14,165,233,0.25)' },
  };
  const typeConfig = {
    user:   { label: 'Usuario', color: '#94a3b8' },
    system: { label: 'Sistema', color: '#0ea5e9' },
    auth:   { label: 'Auth', color: '#a78bfa' },
    admin:  { label: 'Admin', color: '#fb923c' },
  };

  if (loading) {
    return (
      <div className="p-5 md:p-8 flex flex-col gap-4">
        <div className="h-8 w-48 rounded-xl bg-[#1e293b] animate-pulse" />
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#1e293b] animate-pulse flex-shrink-0 mt-1" />
            <div className="flex-1 rounded-2xl h-16 bg-[#0f172a] animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 min-h-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <button className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <p className="text-xs font-bold text-[#0ea5e9] uppercase tracking-[0.15em] mb-0.5">Monitoreo</p>
            <h1 className="text-2xl md:text-3xl font-black text-[#f8fafc] tracking-tight">Actividad del Sistema</h1>
          </div>
        </div>
        <button
          onClick={loadLogs}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1e293b] border border-[#1e293b] text-sm font-semibold text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Actualizar</span>
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Logs', value: filteredLogs.length, color: '#0ea5e9' },
          { label: 'Éxitos', value: filteredLogs.filter(l => l.status === 'success').length, color: '#34d399' },
          { label: 'Errores', value: filteredLogs.filter(l => l.status === 'error').length, color: '#f87171' },
          { label: 'Acciones Admin', value: filteredLogs.filter(l => l.type === 'admin').length, color: '#fb923c' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={cardStyle}>
            <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11px] text-[#64748b] font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-4 mb-5" style={cardStyle}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] w-4 h-4" />
            <input
              placeholder="Buscar en logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1e293b]/60 border border-[#1e293b] text-[#f8fafc] placeholder-[#475569] text-sm focus:outline-none focus:border-[#0ea5e9]/50 transition-colors"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-[#1e293b]/60 border-[#1e293b] text-[#94a3b8] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0f172a] border-[#1e293b] text-[#f8fafc]">
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="user">Usuario</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
              <SelectItem value="auth">Autenticación</SelectItem>
              <SelectItem value="admin">Administración</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-[#1e293b]/60 border-[#1e293b] text-[#94a3b8] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0f172a] border-[#1e293b] text-[#f8fafc]">
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="success">Éxito</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Advertencia</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="px-5 py-4 border-b border-[#1e293b]/60 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#0ea5e9]" />
          <h2 className="text-sm font-bold text-[#f8fafc]">Registros de Actividad</h2>
          <span className="ml-auto text-xs text-[#64748b]">{filteredLogs.length} registros</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#64748b] text-sm">No se encontraron registros</p>
          </div>
        ) : (
          <div className="p-5">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-px bg-[#1e293b]" />

              <div className="space-y-4">
                {filteredLogs.map((log, idx) => {
                  const sc = statusConfig[log.status];
                  const tc = typeConfig[log.type];
                  return (
                    <div key={log.id} className="relative flex gap-4 pl-9">
                      {/* Dot */}
                      <div
                        className="absolute left-[11px] top-[14px] w-2 h-2 rounded-full ring-2 ring-[#020617] flex-shrink-0"
                        style={{ background: sc.dot }}
                      />
                      {/* Card */}
                      <div className="flex-1 rounded-xl p-3.5 border border-[#1e293b]/60 bg-[#0f172a]/50 hover:border-[#1e293b] transition-colors">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-bold text-[#f8fafc]">{log.action}</span>
                            {/* Type badge */}
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ color: tc.color, background: `${tc.color}15`, border: `1px solid ${tc.color}30` }}
                            >
                              {tc.label}
                            </span>
                            {/* Status badge */}
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ color: sc.text, background: sc.bg, border: `1px solid ${sc.border}` }}
                            >
                              {sc.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#475569] font-mono flex-shrink-0">
                            {format(log.timestamp, 'dd/MM HH:mm')}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#64748b] mb-2">{log.description}</p>
                        <div className="flex items-center gap-3 text-[11px] text-[#475569]">
                          {log.userName && (
                            <span className="font-medium text-[#94a3b8]">{log.userName}</span>
                          )}
                          {log.ipAddress && (
                            <span className="font-mono">{log.ipAddress}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

