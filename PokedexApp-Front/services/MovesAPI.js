import AsyncStorageService from './AsyncStorageService.js';

export const MovesAPI = {
  async getMoves() {
    return await AsyncStorageService.getMoves();
  },

  async getMoveByName(name) {
    return await AsyncStorageService.getMoveByName(name);
  },

  async searchMoves(query) {
    return await AsyncStorageService.searchMoves(query);
  },

  async getMovesByType(type) {
    return await AsyncStorageService.getMovesByType(type);
  },

  async getMovesByClass(damageClass) {
    return await AsyncStorageService.getMovesByClass(damageClass);
  },

  async getMovesByPokemon(pokemonName) {
    return await AsyncStorageService.getMovesByPokemon(pokemonName);
  }
};