import AsyncStorageService from './AsyncStorageService.js';

export const AbilitiesAPI = {
  async getAllAbilities() {
    return await AsyncStorageService.getAllAbilities();
  }
};