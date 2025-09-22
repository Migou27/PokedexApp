import AsyncStorageService from './AsyncStorageService.js';

export const ItemsAPI = {
  async getItems() {
    return await AsyncStorageService.getItems();
  },

  async getItemByName(name) {
    return await AsyncStorageService.getItemByName(name);
  },

  async searchItems(query) {
    return await AsyncStorageService.searchItems(query);
  }
};