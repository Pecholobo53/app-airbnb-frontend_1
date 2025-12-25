// app/admin/users/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UserService } from '@/lib/users/user-service';
import { User } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const userSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'user']).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = params.id as string;
  const isEditMode = searchParams.get('edit') === 'true';

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const role = watch('role');

  // Cargar usuario
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const response = await UserService.getUserById(userId);
        
        if (response.success && response.data) {
          setUser(response.data);
          reset({
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone || '',
            role: response.data.role || 'user',
          });
        } else {
          toast.error(response.error?.message || 'Error al cargar usuario');
          router.push('/admin/users');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        toast.error('Error al cargar usuario');
        router.push('/admin/users');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUser();
    }
  }, [userId, reset, router]);

  // Guardar cambios
  const onSubmit = async (data: UserFormData) => {
    if (!user) return;

    setSaving(true);
    try {
      // Intentar con PATCH primero (actualización parcial)
      const response = await UserService.patchUser(userId, {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        role: data.role || undefined,
      });

      if (response.success) {
        toast.success('Usuario actualizado correctamente');
        // Recargar usuario
        const reloadResponse = await UserService.getUserById(userId);
        if (reloadResponse.success && reloadResponse.data) {
          setUser(reloadResponse.data);
        }
        router.push(`/admin/users/${userId}`);
      } else {
        toast.error(response.error?.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar usuario');
    } finally {
      setSaving(false);
    }
  };

  // Eliminar usuario
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user) return;

    setDeleting(true);
    try {
      const response = await UserService.deleteUser(userId);
      
      if (response.success) {
        toast.success('Usuario eliminado correctamente');
        router.push('/admin/users');
      } else {
        toast.error(response.error?.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar usuario');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
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

  if (!user) {
    return (
      <div className="p-6 md:p-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Usuario no encontrado</p>
            <Link href="/admin/users">
              <Button className="mt-4 w-full">Volver a la lista</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Editar Usuario' : 'Detalles de Usuario'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode ? 'Modifica la información del usuario' : 'Información completa del usuario'}
          </p>
        </div>
      </div>

      {/* User Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Información del Usuario</CardTitle>
              <CardDescription>
                {isEditMode ? 'Modifica los datos del usuario' : 'Datos del usuario'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <Select
                      value={role || 'user'}
                      onValueChange={(value) => setValue('role', value as 'admin' | 'user')}
                    >
                      <SelectTrigger id="role" className={errors.role ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuario</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/admin/users/${userId}`)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Nombre</Label>
                    <p className="text-gray-900 font-medium">{user.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <p className="text-gray-900">{user.phone || '-'}</p>
                  </div>
                  <div>
                    <Label>Rol</Label>
                    <p className="text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Usuario'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Label>Email Verificado</Label>
                    <p className="text-gray-900">
                      {user.emailVerified ? '✓ Sí' : '✗ No'}
                    </p>
                  </div>
                  <div>
                    <Label>Fecha de Registro</Label>
                    <p className="text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button onClick={() => router.push(`/admin/users/${userId}?edit=true`)}>
                      Editar Usuario
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-gray-500">ID</Label>
                <p className="text-sm font-mono text-gray-700 break-all">{user.id}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Proveedor</Label>
                <p className="text-sm text-gray-700 capitalize">{user.provider}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Favoritos</Label>
                <p className="text-sm text-gray-700">{user.favorites?.length || 0} propiedades</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Última Actualización</Label>
                <p className="text-sm text-gray-700">
                  {new Date(user.updatedAt).toLocaleDateString('es-ES')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar usuario?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
              <strong>{user.name}</strong> ({user.email}).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
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

