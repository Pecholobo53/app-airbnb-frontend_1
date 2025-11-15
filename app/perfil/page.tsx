// app/perfil/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { User } from '@/types/auth';
import AuthGuard from '@/components/auth/AuthGuard';
import Footer from '@/components/Footer';
import UserAvatar from '@/components/auth/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Phone, MapPin, Heart, Shield, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, UpdateProfileFormData } from '@/lib/auth/validators';

function PerfilContent() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true);
    
    try {
      console.log('📝 Datos del formulario:', data);
      console.log('🖼️ Avatar preview:', previewAvatar ? 'Sí' : 'No');
      
      // Preparar datos para actualizar
      const updateData: Partial<User> = {
        name: data.name,
        phone: data.phone || undefined,
      };
      
      // Solo agregar avatar si hay uno nuevo
      if (previewAvatar) {
        updateData.avatar = previewAvatar;
        console.log('✅ Avatar agregado a updateData');
      }
      
      console.log('📤 Enviando datos:', updateData);
      
      const success = await updateUser(updateData);
      
      if (success) {
        console.log('✅ Perfil actualizado exitosamente');
        setPreviewAvatar(null);
        setIsEditing(false);
      } else {
        console.error('❌ Error: updateUser retornó false');
      }
    } catch (error) {
      console.error('❌ Error en onSubmit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setPreviewAvatar(null);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen debe ser menor de 2MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('El archivo debe ser una imagen');
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  const providerLabels = {
    email: 'Email/Contraseña',
    google: 'Google',
    facebook: 'Facebook',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
            <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
          </div>

          <div className="grid gap-6">
            {/* Profile Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar con opción de cambiar foto */}
                    <div className="relative group">
                      <UserAvatar user={user} size="lg" previewSrc={previewAvatar} />
                      {isEditing && (
                        <label 
                          htmlFor="avatar-upload" 
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg 
                            className="w-6 h-6 text-white" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                            />
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                            />
                          </svg>
                        </label>
                      )}
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                        disabled={!isEditing || isLoading}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{user.name}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                      {isEditing && (
                        <p className="text-xs text-gray-500 mt-1">
                          Pasa el cursor sobre la foto para cambiarla
                        </p>
                      )}
                    </div>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      Editar perfil
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {isEditing ? (
                  /* Edit Mode */
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        className={errors.name ? 'border-red-500' : ''}
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="+34 600 000 000"
                        className={errors.phone ? 'border-red-500' : ''}
                        disabled={isLoading}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        className="bg-[#FF385C] hover:bg-[#E31C5F]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          'Guardar cambios'
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* View Mode */
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>

                    {user.phone && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Teléfono</p>
                          <p className="font-medium">{user.phone}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Miembro desde</p>
                        <p className="font-medium">
                          {new Date(user.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Método de acceso</p>
                        <Badge variant="secondary" className="mt-1">
                          {providerLabels[user.provider]}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Estado de verificación</p>
                        <Badge
                          variant={user.emailVerified ? 'default' : 'destructive'}
                          className="mt-1"
                        >
                          {user.emailVerified ? '✓ Verificado' : '✗ No verificado'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
                <CardDescription>Tu actividad en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-[#FF385C] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600">Reservas</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Heart className="w-6 h-6 text-[#FF385C] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{user.favorites.length}</p>
                    <p className="text-sm text-gray-600">Favoritos</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-6 h-6 text-[#FF385C] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600">Destinos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PerfilPage() {
  return (
    <AuthGuard>
      <PerfilContent />
    </AuthGuard>
  );
}


