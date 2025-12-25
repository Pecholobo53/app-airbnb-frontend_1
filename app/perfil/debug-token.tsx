// Componente de debug para verificar token (solo desarrollo)
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DebugToken() {
  const checkToken = () => {
    const session = localStorage.getItem('airbnb_session');
    if (!session) {
      console.log('❌ [DEBUG] No hay sesión en localStorage');
      alert('No hay sesión guardada');
      return;
    }

    try {
      const parsed = JSON.parse(session);
      const token = parsed.token || parsed.accessToken;
      
      console.log('🔑 [DEBUG] Información de sesión:');
      console.log('  - Tiene token:', !!token);
      console.log('  - Token (primeros 50 chars):', token ? token.substring(0, 50) + '...' : 'NO HAY TOKEN');
      console.log('  - Usuario:', parsed.user?.name);
      console.log('  - Email:', parsed.user?.email);
      console.log('  - Estructura completa:', parsed);
      
      alert(`Token: ${token ? 'Presente' : 'NO HAY TOKEN'}\nUsuario: ${parsed.user?.name || 'N/A'}\nRevisa la consola para más detalles.`);
    } catch (e) {
      console.error('❌ [DEBUG] Error:', e);
      alert('Error al leer la sesión');
    }
  };

  const testConnection = async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const session = localStorage.getItem('airbnb_session');
    
    if (!session) {
      alert('No hay sesión. Debes iniciar sesión primero.');
      return;
    }

    try {
      const parsed = JSON.parse(session);
      const token = parsed.token || parsed.accessToken;
      
      if (!token) {
        alert('No hay token en la sesión');
        return;
      }

      console.log('🧪 [DEBUG] Probando conexión con backend...');
      console.log('  - URL:', `${API_BASE_URL}/api/auth/me`);
      console.log('  - Token:', token.substring(0, 30) + '...');

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 [DEBUG] Response status:', response.status);
      console.log('📥 [DEBUG] Response ok:', response.ok);

      const data = await response.json();
      console.log('📥 [DEBUG] Response data completa:', JSON.stringify(data, null, 2));
      console.log('📥 [DEBUG] Estructura de data:', {
        hasData: !!data.data,
        hasUser: !!data.user,
        dataKeys: Object.keys(data),
        dataDataKeys: data.data ? Object.keys(data.data) : [],
        userName: data.data?.name || data.user?.name || data.name || 'N/A',
        userEmail: data.data?.email || data.user?.email || data.email || 'N/A'
      });

      if (response.ok) {
        // Intentar obtener el nombre del usuario de diferentes formatos posibles
        const userName = data.data?.name || data.user?.name || data.name || 'N/A';
        const userEmail = data.data?.email || data.user?.email || data.email || 'N/A';
        alert(`✅ Conexión exitosa!\nStatus: ${response.status}\nUsuario: ${userName}\nEmail: ${userEmail}\nRevisa la consola para más detalles.`);
      } else {
        alert(`❌ Error en conexión\nStatus: ${response.status}\nError: ${data.error?.message || data.message || 'Error desconocido'}\nRevisa la consola para más detalles.`);
      }
    } catch (e) {
      console.error('❌ [DEBUG] Error en test:', e);
      alert('Error al probar conexión. Revisa la consola.');
    }
  };

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="mt-4 border-yellow-500">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-600">🔧 Debug (Solo Desarrollo)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={checkToken} variant="outline" size="sm" className="w-full">
          Verificar Token
        </Button>
        <Button onClick={testConnection} variant="outline" size="sm" className="w-full">
          Probar Conexión Backend
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Estos botones solo aparecen en desarrollo. Revisa la consola (F12) para ver los detalles.
        </p>
      </CardContent>
    </Card>
  );
}

