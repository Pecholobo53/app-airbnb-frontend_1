// lib/auth/mock-auth-service.ts

import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  PasswordRecoveryData,
  ResetPasswordData,
  User,
  AuthSession 
} from '@/types/auth';
import { 
  MOCK_USERS, 
  MOCK_PASSWORDS, 
  MOCK_RECOVERY_TOKENS,
  MOCK_LOGIN_ATTEMPTS,
  MOCK_VERIFICATION_TOKENS,
  findUserByEmail,
  findUserById,
  emailExists,
  addUser,
  updateUser,
} from './mock-users-db';

/**
 * MOCK AUTH SERVICE
 * 
 * Simula un servicio backend de autenticación.
 * En producción, esto haría llamadas HTTP reales a una API.
 */

const simulateNetworkDelay = (): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));

const generateUserId = (): string => 
  `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const generateToken = (): string => 
  `mock-jwt-${Date.now()}-${Math.random().toString(36).substr(2, 20)}`;

const generateVerificationToken = (): string => 
  `token-${Math.random().toString(36).substr(2, 32)}`;

export class MockAuthService {
  
  /**
   * LOGIN - Iniciar sesión con email y contraseña
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse<AuthSession>> {
    await simulateNetworkDelay();
    console.log('🔐 [LOGIN] Intentando login para:', credentials.email);

    const { email, password, rememberMe } = credentials;

    const attempts = MOCK_LOGIN_ATTEMPTS.get(email);
    if (attempts?.lockedUntil && attempts.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((attempts.lockedUntil.getTime() - Date.now()) / 60000);
      console.log('🚫 [LOGIN] Cuenta bloqueada:', email);
      
      return {
        success: false,
        error: {
          code: 'ACCOUNT_LOCKED',
          message: `Cuenta bloqueada temporalmente. Intenta en ${minutesLeft} minutos.`
        }
      };
    }

    const user = findUserByEmail(email);
    if (!user) {
      console.log('❌ [LOGIN] Usuario no encontrado:', email);
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'No existe una cuenta con este email.'
        }
      };
    }

    const storedPassword = MOCK_PASSWORDS[user.email];
    if (storedPassword !== password) {
      const currentAttempts = MOCK_LOGIN_ATTEMPTS.get(email) || { count: 0 };
      currentAttempts.count++;

      if (currentAttempts.count >= 5) {
        currentAttempts.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        MOCK_LOGIN_ATTEMPTS.set(email, currentAttempts);
        
        console.log('🚫 [LOGIN] Cuenta bloqueada por intentos:', email);
        return {
          success: false,
          error: {
            code: 'ACCOUNT_LOCKED',
            message: 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.'
          }
        };
      }

      MOCK_LOGIN_ATTEMPTS.set(email, currentAttempts);
      console.log(`❌ [LOGIN] Contraseña incorrecta (${currentAttempts.count}/5):`, email);

      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: `Contraseña incorrecta. Intento ${currentAttempts.count}/5.`
        }
      };
    }

    if (!user.emailVerified) {
      console.log('⚠️ [LOGIN] Email no verificado:', email);
      return {
        success: false,
        error: {
          code: 'EMAIL_NOT_VERIFIED',
          message: 'Por favor verifica tu email antes de iniciar sesión.'
        }
      };
    }

    MOCK_LOGIN_ATTEMPTS.delete(email);

    const expiresInDays = rememberMe ? 30 : 1;
    const session: AuthSession = {
      user,
      accessToken: generateToken(),
      expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    };

    console.log('✅ [LOGIN] Login exitoso:', user.name);
    console.log('🎟️ Token válido hasta:', session.expiresAt.toLocaleString());

    return {
      success: true,
      data: session
    };
  }

  /**
   * REGISTER - Registrar nuevo usuario
   */
  static async register(data: RegisterData): Promise<AuthResponse<User>> {
    await simulateNetworkDelay();
    console.log('📝 [REGISTER] Intentando registrar:', data.email);

    const { name, email, password } = data;

    if (emailExists(email)) {
      console.log('❌ [REGISTER] Email ya registrado:', email);
      return {
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Ya existe una cuenta con este email. ¿Olvidaste tu contraseña?'
        }
      };
    }

    const newUser: User = {
      id: generateUserId(),
      email: email.toLowerCase(),
      name,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    };

    addUser(newUser);
    MOCK_PASSWORDS[newUser.email] = password;

    const verificationToken = generateVerificationToken();
    MOCK_VERIFICATION_TOKENS.set(verificationToken, newUser.email);

    console.log('✅ [REGISTER] Usuario creado:', newUser.name);
    console.log('📧 Email de verificación enviado (MOCK)');
    console.log('🔗 Link de verificación:', `/verificar-email?token=${verificationToken}`);

    return {
      success: true,
      data: newUser
    };
  }

  /**
   * REQUEST PASSWORD RECOVERY
   */
  static async requestPasswordRecovery(data: PasswordRecoveryData): Promise<AuthResponse<void>> {
    await simulateNetworkDelay();
    console.log('🔑 [RECOVERY] Solicitud de recuperación:', data.email);

    const { email } = data;
    const user = findUserByEmail(email);

    if (user) {
      const token = generateVerificationToken();
      MOCK_RECOVERY_TOKENS.set(token, {
        email: user.email,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
      });

      console.log('📧 Email de recuperación enviado (MOCK)');
      console.log('🔗 Link de recuperación:', `/recuperar-password?token=${token}`);
    }

    return {
      success: true,
      data: undefined
    };
  }

  /**
   * RESET PASSWORD
   */
  static async resetPassword(data: ResetPasswordData): Promise<AuthResponse<void>> {
    await simulateNetworkDelay();
    console.log('🔄 [RESET] Reseteando contraseña con token');

    const { token, password } = data;

    const recovery = MOCK_RECOVERY_TOKENS.get(token);
    if (!recovery) {
      console.log('❌ [RESET] Token inválido');
      return {
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'El link de recuperación es inválido o ha expirado.'
        }
      };
    }

    if (recovery.expiresAt < new Date()) {
      MOCK_RECOVERY_TOKENS.delete(token);
      console.log('❌ [RESET] Token expirado');
      return {
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'El link de recuperación ha expirado. Solicita uno nuevo.'
        }
      };
    }

    MOCK_PASSWORDS[recovery.email] = password;
    MOCK_RECOVERY_TOKENS.delete(token);
    MOCK_LOGIN_ATTEMPTS.delete(recovery.email);

    console.log('✅ [RESET] Contraseña actualizada para:', recovery.email);

    return {
      success: true,
      data: undefined
    };
  }

  /**
   * VERIFY EMAIL
   */
  static async verifyEmail(token: string): Promise<AuthResponse<void>> {
    await simulateNetworkDelay();
    console.log('📧 [VERIFY] Verificando email con token');

    const email = MOCK_VERIFICATION_TOKENS.get(token);
    if (!email) {
      console.log('❌ [VERIFY] Token inválido');
      return {
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'El link de verificación es inválido o ha expirado.'
        }
      };
    }

    const user = findUserByEmail(email);
    if (user) {
      user.emailVerified = true;
      user.updatedAt = new Date();
      MOCK_VERIFICATION_TOKENS.delete(token);
      
      console.log('✅ [VERIFY] Email verificado:', email);
    }

    return {
      success: true,
      data: undefined
    };
  }

  /**
   * LOGIN WITH GOOGLE (MOCK)
   */
  static async loginWithGoogle(): Promise<AuthResponse<AuthSession>> {
    await simulateNetworkDelay();
    console.log('🔵 [GOOGLE] Login con Google (MOCK)');

    const googleUser: User = {
      id: generateUserId(),
      email: `google.${Date.now()}@gmail.com`,
      name: 'Usuario de Google',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: 'google',
      favorites: []
    };

    const existingUser = findUserByEmail(googleUser.email);
    const user = existingUser || googleUser;

    if (!existingUser) {
      addUser(googleUser);
      console.log('✅ [GOOGLE] Nuevo usuario creado:', googleUser.name);
    } else {
      console.log('✅ [GOOGLE] Usuario existente:', existingUser.name);
    }

    const session: AuthSession = {
      user,
      accessToken: generateToken(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    return {
      success: true,
      data: session
    };
  }

  /**
   * LOGIN WITH FACEBOOK (MOCK)
   */
  static async loginWithFacebook(): Promise<AuthResponse<AuthSession>> {
    await simulateNetworkDelay();
    console.log('🔵 [FACEBOOK] Login con Facebook (MOCK)');

    const facebookUser: User = {
      id: generateUserId(),
      email: `facebook.${Date.now()}@fb.com`,
      name: 'Usuario de Facebook',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: 'facebook',
      favorites: []
    };

    const existingUser = findUserByEmail(facebookUser.email);
    const user = existingUser || facebookUser;

    if (!existingUser) {
      addUser(facebookUser);
      console.log('✅ [FACEBOOK] Nuevo usuario creado:', facebookUser.name);
    }

    const session: AuthSession = {
      user,
      accessToken: generateToken(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    return {
      success: true,
      data: session
    };
  }

  /**
   * UPDATE PROFILE
   */
  static async updateProfile(userId: string, data: Partial<User>): Promise<AuthResponse<User>> {
    await simulateNetworkDelay();
    console.log('👤 [UPDATE] Actualizando perfil:', userId);

    const updatedUser = updateUser(userId, data);
    
    if (!updatedUser) {
      console.log('❌ [UPDATE] Usuario no encontrado');
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Usuario no encontrado.'
        }
      };
    }

    console.log('✅ [UPDATE] Perfil actualizado:', updatedUser.name);

    return {
      success: true,
      data: updatedUser
    };
  }

  /**
   * LOGOUT
   */
  static async logout(): Promise<void> {
    await simulateNetworkDelay();
    console.log('👋 [LOGOUT] Sesión cerrada');
  }
}
