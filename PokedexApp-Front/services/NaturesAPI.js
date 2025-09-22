import AsyncStorageService from './AsyncStorageService.js';

export const NaturesAPI = {
  async getNatures() {
    return await AsyncStorageService.getNatures();
  },

  async getNatureByName(name) {
    return await AsyncStorageService.getNatureByName(name);
  },

  async getNatureModifier(natureName, stat) {
    return await AsyncStorageService.getNatureModifier(natureName, stat);
  }
};