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

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#FF385C] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Actividad del Sistema</h1>
            <p className="text-gray-600 mt-2">
              Logs y registros de actividad del sistema
            </p>
          </div>
        </div>
        <Button onClick={loadLogs} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar en logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tipo
              </label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                  <SelectItem value="auth">Autenticación</SelectItem>
                  <SelectItem value="admin">Administración</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Estado
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="success">Éxito</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Advertencia</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{filteredLogs.length}</div>
            <div className="text-sm text-gray-600">Total de Logs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {filteredLogs.filter(l => l.status === 'success').length}
            </div>
            <div className="text-sm text-gray-600">Éxitos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {filteredLogs.filter(l => l.status === 'error').length}
            </div>
            <div className="text-sm text-gray-600">Errores</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {filteredLogs.filter(l => l.type === 'admin').length}
            </div>
            <div className="text-sm text-gray-600">Acciones Admin</div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Registros de Actividad
          </CardTitle>
          <CardDescription>
            {filteredLogs.length} registro(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {format(log.timestamp, 'dd/MM/yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell>{getTypeBadge(log.type)}</TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>
                        {log.userName ? (
                          <div>
                            <div className="font-medium">{log.userName}</div>
                            <div className="text-xs text-gray-500">{log.userEmail}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Sistema</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-md truncate">{log.description}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell className="font-mono text-xs">{log.ipAddress || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

