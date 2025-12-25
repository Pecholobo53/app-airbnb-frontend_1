// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { UserService } from '@/lib/users/user-service';
import { User } from '@/types/auth';
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
          filteredUsers = filteredUsers.filter(user => 
            roleFilter === 'admin' ? user.role === 'admin' : (!user.role || user.role === 'user')
          );
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
        setTotal(filteredUsers.length);
      } else {
        toast.error(response.error?.message || 'Error al cargar usuarios');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar usuarios
  useEffect(() => {
    loadUsers(currentPage, searchQuery);
  }, [currentPage]);

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(0);
      loadUsers(0, searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Recargar cuando cambian los filtros
  useEffect(() => {
    loadUsers(currentPage, searchQuery);
  }, [roleFilter, verificationFilter]);

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

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">
            Administra los usuarios del sistema
          </p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar usuarios por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="mb-6">
        <UserFilters
          roleFilter={roleFilter}
          verificationFilter={verificationFilter}
          onRoleFilterChange={setRoleFilter}
          onVerificationFilterChange={setVerificationFilter}
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {total > 0 ? `${total} usuario${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}` : 'No hay usuarios'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#FF385C] animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron usuarios</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center hover:text-[#FF385C] transition-colors"
                        >
                          Nombre
                          <SortIcon field="name" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('email')}
                          className="flex items-center hover:text-[#FF385C] transition-colors"
                        >
                          Email
                          <SortIcon field="email" />
                        </button>
                      </TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Verificado</TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('createdAt')}
                          className="flex items-center hover:text-[#FF385C] transition-colors"
                        >
                          Fecha de Registro
                          <SortIcon field="createdAt" />
                        </button>
                      </TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : 'Usuario'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.emailVerified ? (
                            <span className="text-green-600">✓ Verificado</span>
                          ) : (
                            <span className="text-gray-400">No verificado</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/users/${user.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/users/${user.id}?edit=true`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(user)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Página {currentPage + 1} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar usuario?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
              <strong>{userToDelete?.name}</strong> ({userToDelete?.email}).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setUserToDelete(null);
              }}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

