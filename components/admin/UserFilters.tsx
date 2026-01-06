// components/admin/UserFilters.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface UserFiltersProps {
  roleFilter: string;
  verificationFilter: string;
  onRoleFilterChange: (value: string) => void;
  onVerificationFilterChange: (value: string) => void;
}

export function UserFilters({
  roleFilter,
  verificationFilter,
  onRoleFilterChange,
  onVerificationFilterChange,
}: UserFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="role-filter">Rol</Label>
            <Select value={roleFilter} onValueChange={onRoleFilterChange}>
              <SelectTrigger id="role-filter">
                <SelectValue placeholder="Todos los roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="user">Usuarios regulares</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="verification-filter">Verificación</Label>
            <Select value={verificationFilter} onValueChange={onVerificationFilterChange}>
              <SelectTrigger id="verification-filter">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="verified">Verificados</SelectItem>
                <SelectItem value="unverified">No verificados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}














