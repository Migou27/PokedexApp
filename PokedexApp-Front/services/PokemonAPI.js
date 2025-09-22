import AsyncStorageService from './AsyncStorageService.js';

export const PokemonAPI = {
  async getPokemons() {
    return await AsyncStorageService.getPokemons();
  },

  async getPokemonByName(name) {
    return await AsyncStorageService.getPokemonByName(name);
  },

  async getPokemonById(id) {
    return await AsyncStorageService.getPokemonById(id);
  },

  async searchPokemons(query) {
    return await AsyncStorageService.searchPokemons(query);
  },

  async getPokemonByType(type) {
    return await AsyncStorageService.getPokemonByType(type);
  },

  async getPokemonForms(baseName) {
    return await AsyncStorageService.getPokemonForms(baseName);
  },

  async getPokemonByAbility(ability) {
    return await AsyncStorageService.getPokemonByAbility(ability);
  },

  async getPokemonByMove(move) {
    return await AsyncStorageService.getPokemonByMove(move);
  },

  async getPokemonStats(pokemonName) {
    return await AsyncStorageService.getPokemonStats(pokemonName);
  },

  async calculateStatsWithNature(baseStats, natureName) {
    return await AsyncStorageService.calculateStatsWithNature(baseStats, natureName);
  }
};