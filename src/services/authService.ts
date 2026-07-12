import { handyBetUsers } from '../mockdata/handyBetMock';

export const authService = {
  async login(username: string, password: string):Promise<any> {
    // Simulamos latencia de red
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = handyBetUsers.find((u) => u.username === username && u.password === password);
        if (user) {
          resolve(user);
        } else {
          reject(new Error('Credenciales incorrectas. (Pista: usa admin/admin)'));
        }
      }, 1000);
    });
  },

  async register(
    username: string, 
    password: string, 
    fullName: string, 
    phoneWhatsapp: string, 
    whatsappHandle?: string
  ): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // En un caso real insertaríamos en auth.users y en profiles
        resolve({ 
          success: true, 
          message: `¡Registro exitoso para ${fullName}! WhatsApp: ${phoneWhatsapp} ${whatsappHandle ? '(' + whatsappHandle + ')' : ''}. Por favor inicia sesión.` 
        });
      }, 1000);
    });
  }
};
