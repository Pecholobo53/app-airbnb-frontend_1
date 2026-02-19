// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { UserService } from '@/lib/users/user-service';
import { User } from '@/types/auth';
import { isAdmin } from '@/lib/utils/admin';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, UserPlus, Eye, Edit, Trash2, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { UserFilters } from '@/components/admin/UserFilters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ITEMS_PER_PAGE = 20;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'email' | 'createdAt' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();

  // Cargar usuarios
  const loadUsers = async (page: number = 0, search: string = '') => {
    setLoading(true);
    try {
      let response;
      if (search.trim()) {
        response = await UserService.searchUsers(search, ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
      } else {
        response = await UserService.listUsers(ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
      }

      if (response.success && response.data) {
        let filteredUsers = response.data.users || [];
        
        // Aplicar filtros
        if (roleFilter !== 'all') {
          filteredUsers = filteredUsers.filter(user => {
            // Usar la función isAdmin que incluye la verificación especial
            const userIsAdmin = isAdmin(user);
            
            if (roleFilter === 'admin') {
              return userIsAdmin;
            } else {
              // Para usuarios regulares, excluir admins
              return !userIsAdmin && (!user.role || user.role === 'user');
            }
          });
        }
        
        if (verificationFilter !== 'all') {
          filteredUsers = filteredUsers.filter(user => 
            verificationFilter === 'verified' ? user.emailVerified : !user.emailVerified
          );
        }
        
        // Aplicar ordenamiento
        if (sortField) {
          filteredUsers.sort((a, b) => {
            let aValue: any;
            let bValue: any;
            
            if (sortField === 'name') {
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
            } else if (sortField === 'email') {
              aValue = a.email.toLowerCase();
              bValue = b.email.toLowerCase();
            } else if (sortField === 'createdAt') {
              aValue = new Date(a.createdAt).getTime();
              bValue = new Date(b.createdAt).getTime();
            }
            
            if (sortDirection === 'asc') {
              return aValue > bValue ? 1 : -1;
            } else {
              return aValue < bValue ? 1 : -1;
            }
          });
        }
        
        setUsers(filteredUsers);
        // Usar el total del backend si está disponible, sino usar el filtrado
        setTotal(response.data.total || filteredUsers.length);
      } else {
        // Manejar error de rate limiting
        const errorMessage = response.error?.message || 'Error al cargar usuarios';
        if (response.error?.code === 'RATE_LIMIT' || errorMessage.toLowerCase().includes('demasiadas') || errorMessage.toLowerCase().includes('rate limit')) {
          toast.error('Demasiadas peticiones. Espera unos segundos antes de intentar de nuevo.');
        } else {
          toast.error(errorMessage);
        }
        setUsers([]);
        setTotal(0);
      }
    } catch (error: any) {
      console.error('Error loading users:', error);
      
      // Manejar error de rate limiting
      const errorMessage = error?.message || '';
      if (errorMessage.toLowerCase().includes('429') || errorMessage.toLowerCase().includes('rate limit') || errorMessage.toLowerCase().includes('demasiadas')) {
        toast.error('Demasiadas peticiones. Espera unos segundos antes de intentar de nuevo.');
      } else {
        toast.error('Error al cargar usuarios');
      }
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios con debounce consolidado para evitar demasiadas peticiones
  useEffect(() => {
    // Debounce para evitar rate limiting
    const timer = setTimeout(() => {
      // Si cambió la búsqueda, resetear a página 0
      const pageToLoad = searchQuery !== '' ? 0 : currentPage;
      loadUsers(pageToLoad, searchQuery);
    }, 600); // Debounce de 600ms

    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, roleFilter, verificationFilter]);

  // Función para ordenar
  const handleSort = (field: 'name' | 'email' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: 'name' | 'email' | 'createdAt' }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1 text-[#FF385C]" />
      : <ArrowDown className="w-4 h-4 ml-1 text-[#FF385C]" />;
  };

  // Eliminar usuario
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      const response = await UserService.deleteUser(userToDelete.id);
      
      if (response.success) {
        toast.success('Usuario eliminado correctamente');
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        // Recargar usuarios
        loadUsers(currentPage, searchQuery);
      } else {
        toast.error(response.error?.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar usuario');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const cardStyle = {
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(8px)',
  };

  return (
    <div className="p-5 md:p-8 min-h-full">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#0ea5e9] uppercase tracking-[0.15em] mb-1">Administración</p>
          <h1 className="text-2xl md:text-3xl font-black text-[#f8fafc] tracking-tight">Gestión de Usuarios</h1>
          <p className="text-[#64748b] text-sm mt-1">Administra las cuentas y permisos del sistema</p>
        </div>
        <Link href="/admin/users/new">
          <button className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#0ea5e9]/20">
            <UserPlus className="w-4 h-4" />
            Nuevo Usuario
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4 rounded-2xl p-4" style={cardStyle}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1e293b]/60 border border-[#1e293b] text-[#f8fafc] placeholder-[#475569] text-sm focus:outline-none focus:border-[#0ea5e9]/50 transition-colors"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <UserFilters
          roleFilter={roleFilter}
          verificationFilter={verificationFilter}
          onRoleFilterChange={setRoleFilter}
          onVerificationFilterChange={setVerificationFilter}
        />
      </div>

      {/* Users List */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        {/* List header */}
        <div className="px-5 py-4 border-b border-[#1e293b]/60 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#f8fafc]">Lista de Usuarios</h2>
          <span className="text-xs text-[#64748b]">
            {total > 0 ? `${total} usuario${total !== 1 ? 's' : ''}` : 'Sin usuarios'}
          </span>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <Loader2 className="w-7 h-7 text-[#0ea5e9] animate-spin" />
            <p className="text-xs text-[#475569]">Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#64748b] text-sm">No se encontraron usuarios</p>
          </div>
        ) : (
          <>
            {/* Sort header */}
            <div className="px-5 py-2.5 border-b border-[#1e293b]/40 grid grid-cols-12 gap-4 text-[11px] font-bold text-[#475569] uppercase tracking-[0.1em]">
              <div className="col-span-4 sm:col-span-3">
                <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-[#0ea5e9] transition-colors">
                  Usuario <SortIcon field="name" />
                </button>
              </div>
              <div className="hidden sm:block sm:col-span-3">
                <button onClick={() => handleSort('email')} className="flex items-center gap-1 hover:text-[#0ea5e9] transition-colors">
                  Email <SortIcon field="email" />
                </button>
              </div>
              <div className="col-span-3 sm:col-span-2">Rol</div>
              <div className="hidden sm:block sm:col-span-2">
                <button onClick={() => handleSort('createdAt')} className="flex items-center gap-1 hover:text-[#0ea5e9] transition-colors">
                  Registro <SortIcon field="createdAt" />
                </button>
              </div>
              <div className="col-span-5 sm:col-span-2 text-right">Acciones</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#1e293b]/40">
              {users.map((user) => {
                const isUserAdmin = user.role === 'admin' || user.email === 'armandito@gmail.com';
                const initials = user.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??';
                return (
                  <div key={user.id} className="px-5 py-3.5 grid grid-cols-12 gap-4 items-center hover:bg-[#1e293b]/30 transition-colors">
                    {/* Avatar + Name */}
                    <div className="col-span-4 sm:col-span-3 flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#f8fafc] truncate">{user.name}</p>
                        <p className="text-[11px] text-[#475569] sm:hidden truncate">{user.email}</p>
                      </div>
                    </div>
                    {/* Email */}
                    <div className="hidden sm:block sm:col-span-3 min-w-0">
                      <p className="text-[13px] text-[#94a3b8] truncate">{user.email}</p>
                    </div>
                    {/* Role + Verified */}
                    <div className="col-span-3 sm:col-span-2 flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${
                        isUserAdmin
                          ? 'bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/25'
                          : 'bg-[#94a3b8]/10 text-[#94a3b8] border border-[#94a3b8]/20'
                      }`}>
                        {isUserAdmin ? 'Admin' : 'Usuario'}
                      </span>
                      {user.emailVerified ? (
                        <span className="text-[10px] text-[#34d399] font-medium">✓ Verificado</span>
                      ) : (
                        <span className="text-[10px] text-[#475569]">Sin verificar</span>
                      )}
                    </div>
                    {/* Date */}
                    <div className="hidden sm:block sm:col-span-2">
                      <p className="text-[12px] text-[#64748b]">{new Date(user.createdAt).toLocaleDateString('es-ES')}</p>
                    </div>
                    {/* Actions */}
                    <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        className="w-8 h-8 rounded-lg bg-[#1e293b] hover:bg-[#0ea5e9]/20 text-[#64748b] hover:text-[#0ea5e9] flex items-center justify-center transition-all"
                        title="Ver detalles"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/users/${user.id}?edit=true`)}
                        className="w-8 h-8 rounded-lg bg-[#1e293b] hover:bg-[#fbbf24]/20 text-[#64748b] hover:text-[#fbbf24] flex items-center justify-center transition-all"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="w-8 h-8 rounded-lg bg-[#1e293b] hover:bg-red-500/20 text-[#64748b] hover:text-red-400 flex items-center justify-center transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-[#1e293b]/60 flex items-center justify-between">
                <p className="text-xs text-[#64748b]">
                  Página {currentPage + 1} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1.5 rounded-lg bg-[#1e293b] border border-[#1e293b] text-xs font-semibold text-[#94a3b8] hover:text-[#f8fafc] disabled:opacity-40 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-1.5 rounded-lg bg-[#0ea5e9] text-xs font-semibold text-white hover:bg-[#0284c7] disabled:opacity-40 transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#0f172a] border border-[#1e293b] text-[#f8fafc]">
          <DialogHeader>
            <DialogTitle className="text-[#f8fafc]">¿Eliminar usuario?</DialogTitle>
            <DialogDescription className="text-[#64748b]">
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
              <strong className="text-[#f8fafc]">{userToDelete?.name}</strong> ({userToDelete?.email}).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => { setDeleteDialogOpen(false); setUserToDelete(null); }}
              disabled={deleting}
              className="px-4 py-2 rounded-xl bg-[#1e293b] border border-[#1e293b] text-sm font-semibold text-[#94a3b8] hover:text-[#f8fafc] disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-sm font-semibold text-red-400 hover:bg-red-500/25 disabled:opacity-50 transition-colors"
            >
              {deleting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Eliminando...</> : 'Eliminar'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

