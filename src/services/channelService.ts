import { localDB } from '../lib/localDB';

export const channelService = {
  async getChannels(): Promise<any[]> {
    return localDB.channels.getAll();
  },
  
  async getGroups(): Promise<any[]> {
    return localDB.groups.getAll();
  }
};
