// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/auth/validators';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/utils/admin';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const success = await login(data);
      
      if (success) {
        // Esperar a que la sesión se guarde en sessionStorage y el contexto se actualice
        // Verificar que la sesión esté realmente guardada antes de redirigir
        let attempts = 0;
        const maxAttempts = 20; // Aumentado para dar más tiempo
        
        while (attempts < maxAttempts) {
          const session = sessionStorage.getItem('airbnb_session');
          if (session) {
            try {
              const parsed = JSON.parse(session);
              if (parsed.user && parsed.user.id) {
                const userIsAdmin = isAdmin(parsed.user);
                
                // Pequeño delay adicional para asegurar que React haya actualizado el estado
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Redirigir según el rol del usuario
                if (userIsAdmin) {
                  router.push('/admin');
                } else {
                  router.push('/dashboard');
                }
                return;
              }
            } catch (e) {
              console.error('Error parseando sesión');
            }
          }
          // Esperar 100ms antes de intentar de nuevo (aumentado para dar más tiempo)
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        // Si después de todos los intentos no se guardó, intentar leer del sessionStorage una vez más
        // (el estado del contexto debería estar actualizado)
        // Último intento de leer del sessionStorage
        try {
          const finalSession = sessionStorage.getItem('airbnb_session');
          if (finalSession) {
            const parsed = JSON.parse(finalSession);
            if (parsed.user) {
              const userIsAdmin = isAdmin(parsed.user);
              if (userIsAdmin) {
                router.push('/admin');
                return;
              }
            }
          }
        } catch (e) {
          console.error('Error en lectura final');
        }
        
        // Fallback: redirigir a dashboard si no se pudo determinar el rol
        router.push('/dashboard');
      } else {
        // El login falló, el mensaje de error ya se mostró en el toast
      }
    } catch (error) {
      console.error('Error inesperado durante el login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }} 
      className="space-y-4"
    >
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-form-type="other"
          data-lpignore="true"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            data-form-type="other"
            data-lpignore="true"
            {...register('password')}
            className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          checked={rememberMe}
          onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
          disabled={isLoading}
        />
        <label
          htmlFor="rememberMe"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Recordarme
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-acento-200 hover:bg-acento-100 text-white font-semibold h-12"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          'Iniciar sesión'
        )}
      </Button>

      {/* Forgot Password */}
      <div className="text-center">
        <Link
          href="/recuperar-password"
          className="text-sm text-acento-200 hover:text-acento-100 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </form>
  );
}
