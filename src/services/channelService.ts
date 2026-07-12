import { handyBetChannels, handyBetGroups } from '../mockdata/handyBetMock';
import { supabase } from '../lib/supabaseClient';

export const channelService = {
  async getChannels(): Promise<any[]> {
    // En lugar de usar supabase directamente, abstraemos la conexión.
    // Actualmente usaremos la mock data de handyBetChannels para probar la UI
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(handyBetChannels);
      }, 500);
    });
  },
  
  async getGroups(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(handyBetGroups);
      }, 500);
    });
  }
};
