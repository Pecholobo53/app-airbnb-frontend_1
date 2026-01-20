// components/auth/SocialAuthButtons.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { isAdmin } from '@/lib/utils/admin';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthService } from '@/lib/auth/auth-service';
import { toast } from 'sonner';

export default function SocialAuthButtons() {
  const router = useRouter();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoadingGoogle(true);
      try {
        console.log('✅ [GOOGLE LOGIN] Token recibido de Google');
        
        // Obtener datos del usuario desde Google
        console.log('📡 [GOOGLE LOGIN] Obteniendo información del usuario desde Google...');
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        
        if (!userInfoResponse.ok) {
          const errorText = await userInfoResponse.text();
          console.error('❌ [GOOGLE LOGIN] Error obteniendo datos de Google:', userInfoResponse.status, errorText);
          throw new Error(`Error al obtener datos de Google: ${userInfoResponse.status}`);
        }
        
        const googleUser = await userInfoResponse.json();
        console.log('✅ [GOOGLE LOGIN] Datos de Google obtenidos:', { email: googleUser.email, name: googleUser.name });
        
        // Enviar datos al backend
        console.log('📡 [GOOGLE LOGIN] Enviando datos al backend...');
        const response = await AuthService.loginWithGoogle({
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture,
          providerId: googleUser.sub,
        });

        console.log('📥 [GOOGLE LOGIN] Respuesta del backend:', response);

        if (response.success && response.data) {
          // Manejar diferentes estructuras de respuesta del backend
          const userData = response.data.user || response.data;
          const token = response.data.token || response.data.accessToken;
          const expiresAt = response.data.expiresAt 
            ? new Date(response.data.expiresAt) 
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días por defecto
          
          const session = {
            ...response.data,
            token: token,
            expiresAt: expiresAt,
            user: {
              ...userData,
              createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
              updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
            },
          };
          
          // Guardar sesión en sessionStorage
          sessionStorage.setItem('airbnb_session', JSON.stringify(session));
          
          // Recargar la página para que el AuthContext detecte la nueva sesión
          // O redirigir directamente y el contexto se actualizará automáticamente
          toast.success(`¡Bienvenido, ${session.user.name}!`);
          
          // Pequeño delay para asegurar que la sesión se guarde
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Redirigir según rol - el AuthContext detectará la sesión al cargar
          const userIsAdmin = isAdmin(session.user);
          window.location.href = userIsAdmin ? '/admin' : '/dashboard';
        } else {
          console.error('❌ [GOOGLE LOGIN] Error en respuesta del backend:', response.error);
          toast.error(response.error?.message || 'Error al iniciar sesión con Google');
        }
      } catch (error) {
        console.error('❌ [GOOGLE LOGIN] Error completo:', error);
        
        // Mensajes de error más específicos
        if (error instanceof Error) {
          if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
            toast.error('No se pudo conectar al backend. Verifica que el servidor esté corriendo en http://localhost:3000');
          } else if (error.message.includes('obtener datos de Google')) {
            toast.error('Error al obtener información de Google. Intenta nuevamente.');
          } else {
            toast.error(`Error: ${error.message}`);
          }
        } else {
          toast.error('Error de conexión. Intenta nuevamente.');
        }
      } finally {
        setIsLoadingGoogle(false);
      }
    },
    onError: (error) => {
      console.error('❌ [GOOGLE LOGIN] Error en autenticación de Google:', error);
      setIsLoadingGoogle(false);
      toast.error('Error al autenticar con Google. Verifica que tu email esté en la lista de usuarios de prueba.');
    },
  });


  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 font-medium"
        onClick={() => handleGoogleLogin()}
        disabled={isLoadingGoogle}
      >
        {isLoadingGoogle ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Continuar con Google
      </Button>
    </div>
  );
}
