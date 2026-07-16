import { localDB } from '../lib/localDB';

export const authService = {
  async login(username: string, password: string): Promise<any | null> {
    const allUsers = await localDB.users.getAll();
    let user = allUsers.find(
      (u: any) => u.username === username && u.password === password
    );

    // Fallback garantizado para mantener el acceso de admin
    if (!user && username === 'admin' && password === 'admin') {
      user = {
        id: 'usr_admin',
        username: 'admin',
        full_name: 'Administrador Principal',
        avatar_url: 'https://i.pravatar.cc/150?u=admin',
        role: 'admin',
        wallet_balance: 999999.00
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

  async register(
    username: string,
    password: string,
    fullName: string,
    phoneWhatsapp: string,
    whatsappHandle: string
  ): Promise<{ success: boolean; message: string }> {
    const allUsers = await localDB.users.getAll();
    const exists = allUsers.some((u: any) => u.username === username);
    if (exists) {
      throw new Error('El nombre de usuario ya está registrado.');
    }

    const newUser = {
      id: localDB.generateId('usr'),
      username,
      password,
      full_name: fullName,
      avatar_url: `https://i.pravatar.cc/150?u=${username}`,
      role: 'player',
      bio: `Miembro de HandyBet desde ${new Date().toLocaleDateString('es')}`,
      interests: ['apuestas'],
      wallet_balance: 100.00, // Bono de bienvenida simulado
      followers_count: 0,
      following_count: 0,
      phone_whatsapp: phoneWhatsapp,
      whatsapp_handle: whatsappHandle,
      created_at: new Date().toISOString()
    };

    await localDB.users.insert(newUser);
    return { success: true, message: 'Usuario registrado con éxito. Ya puedes iniciar sesión.' };
  },

  async getUserById(userId: string): Promise<any | null> {
    return localDB.users.getById(userId);
  },

  async getAllUsers(): Promise<any[]> {
    return localDB.users.getAll();
  },

  async updateProfile(userId: string, updates: Partial<any>): Promise<any | null> {
    return localDB.users.update(userId, updates);
  }
};
