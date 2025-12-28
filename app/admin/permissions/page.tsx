// app/admin/permissions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { UserService } from '@/lib/users/user-service';
import { User } from '@/types/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Shield, Users, Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/utils/admin';

interface RoleAssignment {
  userId: string;
  userName: string;
  userEmail: string;
  currentRole: 'admin' | 'user';
  newRole?: 'admin' | 'user';
}

export default function PermissionsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roleAssignments, setRoleAssignments] = useState<Map<string, RoleAssignment>>(new Map());

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await UserService.listUsers(100, 0);
      if (response.success && response.data?.users) {
        const usersList = response.data.users;
        setUsers(usersList);
        
        // Inicializar asignaciones de roles
        const assignments = new Map<string, RoleAssignment>();
        usersList.forEach(user => {
          // Usar isAdmin() para determinar el rol real (incluye verificación especial)
          const userIsAdmin = isAdmin(user);
          assignments.set(user.id, {
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            currentRole: userIsAdmin ? 'admin' : (user.role || 'user'),
          });
        });
        setRoleAssignments(assignments);
      } else {
        toast.error('Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId: string, newRole: 'admin' | 'user') => {
    const updated = new Map(roleAssignments);
    const assignment = updated.get(userId);
    if (assignment) {
      updated.set(userId, {
        ...assignment,
        newRole,
      });
      setRoleAssignments(updated);
    }
  };

  const handleSaveRoles = async () => {
    setSaving(true);
    try {
      const changes = Array.from(roleAssignments.values()).filter(
        assignment => assignment.newRole && assignment.newRole !== assignment.currentRole
      );

      if (changes.length === 0) {
        toast.info('No hay cambios para guardar');
        setSaving(false);
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const change of changes) {
        try {
          const response = await UserService.patchUser(change.userId, {
            role: change.newRole,
          });

          if (response.success) {
            successCount++;
            // Actualizar el rol actual
            const updated = new Map(roleAssignments);
            const assignment = updated.get(change.userId);
            if (assignment) {
              updated.set(change.userId, {
                ...assignment,
                currentRole: change.newRole!,
                newRole: undefined,
              });
              setRoleAssignments(updated);
            }
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error(`Error updating role for ${change.userId}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} rol(es) actualizado(s) correctamente`);
        // Recargar usuarios para reflejar cambios
        await loadUsers();
      }

      if (errorCount > 0) {
        toast.error(`${errorCount} error(es) al actualizar rol(es)`);
      }
    } catch (error) {
      console.error('Error saving roles:', error);
      toast.error('Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = Array.from(roleAssignments.values()).some(
    assignment => assignment.newRole && assignment.newRole !== assignment.currentRole
  );

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
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Permisos</h1>
          <p className="text-gray-600 mt-2">
            Asigna y gestiona roles de usuario en el sistema
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Roles Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Administrador</h3>
              </div>
              <p className="text-sm text-purple-700">
                Acceso completo al sistema, puede gestionar usuarios, permisos y ver toda la actividad.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Usuario</h3>
              </div>
              <p className="text-sm text-gray-700">
                Acceso estándar, puede gestionar su perfil y realizar reservas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Asignación de Roles</CardTitle>
              <CardDescription>
                {users.length} usuarios encontrados
              </CardDescription>
            </div>
            {hasChanges && (
              <Button onClick={handleSaveRoles} disabled={saving}>
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
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol Actual</TableHead>
                  <TableHead>Nuevo Rol</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const assignment = roleAssignments.get(user.id);
                  // Usar isAdmin() para determinar el rol real
                  const userIsAdmin = isAdmin(user);
                  const currentRole = assignment?.currentRole || (userIsAdmin ? 'admin' : (user.role || 'user'));
                  const newRole = assignment?.newRole;
                  const hasChange = newRole && newRole !== currentRole;

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={currentRole === 'admin' ? 'default' : 'secondary'}
                          className={
                            currentRole === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {currentRole === 'admin' ? 'Admin' : 'Usuario'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={newRole || currentRole}
                          onValueChange={(value) =>
                            handleRoleChange(user.id, value as 'admin' | 'user')
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Usuario</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {hasChange ? (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                            Cambio pendiente
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                            Sin cambios
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

