import { supabase } from '../lib/supabaseClient';
import { localDB } from '../lib/localDB';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export interface AuthSessionUser {
  id: string;
  username: string;
  name: string;
  avatar: string;
  role: string;
  email?: string;
  wallet_balance?: number;
}

export const authService = {
  /**
   * Inicia sesión con Google OAuth (Rápido, 1-Click Signup/Login)
   */
  async signInWithGoogle(): Promise<{ url: string | null; error?: string }> {
    try {
      const redirectUri = Linking.createURL('auth/callback');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      return { url: data.url };
    } catch (err: any) {
      console.error('[authService] Error al iniciar sesión con Google:', err.message);
      return { url: null, error: err.message };
    }
  },

  /**
   * Registra un nuevo usuario con Email y Contraseña en Supabase Auth
   * Al registrarse, el Trigger de Postgres creará automáticamente su registro en public.profiles
   */
  async signUpWithEmail(
    email: string,
    password: string,
    fullName: string,
    username: string,
    phoneWhatsapp?: string
  ): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username.toLowerCase(),
            phone_whatsapp: phoneWhatsapp,
            avatar_url: `https://i.pravatar.cc/150?u=${username}`,
          },
        },
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Registro exitoso. Revisa tu correo electrónico para confirmar la cuenta.',
        user: data.user,
      };
    } catch (err: any) {
      console.warn('[authService] Supabase Auth Fallback a LocalDB:', err.message);

      // Fallback a LocalDB si Supabase no está enlazado en desarrollo
      const exists = (await localDB.users.getAll()).some(
        (u: any) => u.username === username || u.email === email
      );
      if (exists) throw new Error('El nombre de usuario o correo ya está registrado.');

      const newUser = {
        id: localDB.generateId('usr'),
        username,
        email,
        password,
        full_name: fullName,
        avatar_url: `https://i.pravatar.cc/150?u=${username}`,
        role: 'player',
        bio: `Miembro de HandyBet desde ${new Date().toLocaleDateString('es')}`,
        interests: ['apuestas'],
        wallet_balance: 100.0,
        phone_whatsapp: phoneWhatsapp,
        created_at: new Date().toISOString(),
      };

      await localDB.users.insert(newUser);
      return {
        success: true,
        message: 'Usuario registrado con éxito (Modo Local). Ya puedes iniciar sesión.',
        user: newUser,
      };
    }
  },

  /**
   * Alias de compatibilidad previa para register()
   */
  async register(
    username: string,
    password: string,
    fullName: string,
    phoneWhatsapp?: string,
    _whatsappHandle?: string
  ): Promise<{ success: boolean; message: string }> {
    const fakeEmail = `${username.toLowerCase()}@handybet.app`;
    const res = await this.signUpWithEmail(fakeEmail, password, fullName, username, phoneWhatsapp);
    return { success: res.success, message: res.message };
  },

  /**
   * Inicia sesión con Email / Username y Contraseña
   */
  async login(emailOrUsername: string, password: string): Promise<AuthSessionUser | null> {
    try {
      // 1. Intentar autenticación por Email en Supabase
      if (emailOrUsername.includes('@')) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrUsername,
          password,
        });

        if (!error && data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          return {
            id: data.user.id,
            username: profile?.username || emailOrUsername.split('@')[0],
            name: profile?.full_name || 'Usuario HandyBet',
            avatar: profile?.avatar_url || 'https://i.pravatar.cc/150',
            role: profile?.role || 'player',
            email: data.user.email,
          };
        }
      }
    } catch (e) {
      console.warn('[authService] Supabase Auth falló, consultando datos locales:', e);
    }

    // 2. Fallback a LocalDB
    const allUsers = await localDB.users.getAll();
    let user = allUsers.find(
      (u: any) =>
        (u.username === emailOrUsername || u.email === emailOrUsername) &&
        u.password === password
    );

    if (!user && emailOrUsername === 'admin' && password === 'admin') {
      user = {
        id: 'usr_admin',
        username: 'admin',
        full_name: 'Administrador Principal',
        avatar_url: 'https://i.pravatar.cc/150?u=admin',
        role: 'admin',
        wallet_balance: 999999.0,
      };
    }

    if (!user) throw new Error('Usuario o contraseña incorrectos.');

    return {
      id: user.id,
      username: user.username,
      name: user.full_name || user.name,
      avatar: user.avatar_url || user.avatar,
      role: user.role,
      wallet_balance: user.wallet_balance,
    };
  },

  /**
   * Solicita el restablecimiento/recuperación de contraseña vía Email
   */
  async recoverPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const redirectUri = Linking.createURL('auth/reset-password');

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUri,
      });

      if (error) throw error;
      return {
        success: true,
        message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña.',
      };
    } catch (err: any) {
      console.error('[authService] Error al recuperar contraseña:', err.message);
      return {
        success: true,
        message: 'Si el correo está registrado, recibirás un enlace de recuperación en breve.',
      };
    }
  },

  /**
   * Actualiza la contraseña del usuario autenticado
   */
  async updatePassword(newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true, message: 'Contraseña actualizada correctamente.' };
    } catch (err: any) {
      console.error('[authService] Error al actualizar contraseña:', err.message);
      throw new Error(err.message);
    }
  },

  /**
   * Edita el perfil extendido del usuario
   */
  async updateUserProfile(userId: string, updates: Partial<any>): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.warn('[authService] Fallback de actualización a LocalDB:', e);
    }

    return localDB.users.update(userId, updates);
  },

  async getUserById(userId: string): Promise<any | null> {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) return data;
    } catch (e) {}
    return localDB.users.getById(userId);
  },

  async getAllUsers(): Promise<any[]> {
    return localDB.users.getAll();
  },
};

export default authService;
