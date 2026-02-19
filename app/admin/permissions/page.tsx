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

  const cardStyle = {
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(8px)',
  };

  if (loading) {
    return (
      <div className="p-5 md:p-8 space-y-4">
        <div className="h-8 w-56 rounded-xl bg-[#1e293b] animate-pulse" />
        {[1,2,3].map(i => (
          <div key={i} className="h-16 rounded-2xl bg-[#0f172a] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 min-h-full space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin">
          <button className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-texto-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div>
          <p className="text-xs font-bold text-admin-accent uppercase tracking-[0.15em] mb-0.5">Seguridad</p>
          <h1 className="text-2xl md:text-3xl font-black text-texto-100 tracking-tight">Gestión de Permisos</h1>
        </div>
      </div>

      {/* Role info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(167,139,250,0.08)', borderColor: 'rgba(167,139,250,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-[#a78bfa]" />
            <h3 className="text-sm font-bold text-[#a78bfa]">Administrador</h3>
          </div>
          <p className="text-[12px] text-[#64748b] leading-relaxed">
            Acceso completo al sistema. Puede gestionar usuarios, permisos y ver toda la actividad.
          </p>
        </div>
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(148,163,184,0.06)', borderColor: 'rgba(148,163,184,0.15)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#94a3b8]" />
            <h3 className="text-sm font-bold text-[#94a3b8]">Usuario</h3>
          </div>
          <p className="text-[12px] text-[#64748b] leading-relaxed">
            Acceso estándar. Puede gestionar su perfil y realizar reservas en la plataforma.
          </p>
        </div>
      </div>

      {/* Roles Table */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="px-5 py-4 border-b border-[#1e293b]/60 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-texto-100">Asignación de Roles</h2>
            <p className="text-xs text-[#64748b] mt-0.5">{users.length} usuarios encontrados</p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSaveRoles}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-admin-accent hover:bg-admin-accent-hover text-white text-sm font-semibold transition-colors shadow-lg shadow-admin-accent/20 disabled:opacity-50"
            >
              {saving ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...</>
              ) : (
                <><Save className="w-3.5 h-3.5" /> Guardar Cambios</>
              )}
            </button>
          )}
        </div>

        <div className="divide-y divide-[#1e293b]/40">
          {users.map((user) => {
            const assignment = roleAssignments.get(user.id);
            const userIsAdmin = isAdmin(user);
            const currentRole = assignment?.currentRole || (userIsAdmin ? 'admin' : (user.role || 'user'));
            const newRole = assignment?.newRole;
            const hasChange = newRole && newRole !== currentRole;
            const initials = user.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??';

            return (
              <div key={user.id} className="px-5 py-4 flex flex-wrap items-center gap-4 hover:bg-[#1e293b]/20 transition-colors">
                {/* Avatar + Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-admin-accent to-admin-accent-hover flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-texto-100 truncate">{user.name}</p>
                    <p className="text-[11px] text-[#64748b] truncate">{user.email}</p>
                  </div>
                </div>

                {/* Current role badge */}
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  currentRole === 'admin'
                    ? 'bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/25'
                    : 'bg-[#94a3b8]/10 text-[#94a3b8] border border-[#94a3b8]/20'
                }`}>
                  {currentRole === 'admin' ? 'Admin' : 'Usuario'}
                </span>

                {/* Role selector */}
                <Select
                  value={newRole || currentRole}
                  onValueChange={(value) => handleRoleChange(user.id, value as 'admin' | 'user')}
                >
                  <SelectTrigger className="w-[140px] bg-[#1e293b]/60 border-[#1e293b] text-[#94a3b8] rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f172a] border-[#1e293b] text-texto-100">
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>

                {/* Change status */}
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  hasChange
                    ? 'bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]/25'
                    : 'bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/20'
                }`}>
                  {hasChange ? '● Cambio pendiente' : '✓ Sin cambios'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

