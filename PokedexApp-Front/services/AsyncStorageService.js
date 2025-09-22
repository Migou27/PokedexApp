import AsyncStorage from '@react-native-async-storage/async-storage';
import pokemonData from '../data/PokemonDB.Pokemons.json';
import movesData from '../data/PokemonDB.Moves.json';
import itemsData from '../data/PokemonDB.Items.json';
import naturesData from '../data/PokemonDB.Natures.json';
import movesByPokemonData from '../data/PokemonDB.MovesByPoke.json';
import abilitiesData from '../data/PokemonDB.Abilities.json';

class AsyncStorageService {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    try {
      const isInitialized = await AsyncStorage.getItem('pokedex_initialized');
      if (!isInitialized) {
        await this.initializeData();
        await AsyncStorage.setItem('pokedex_initialized', 'true');
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      throw error;
    }
  }

  async initializeData() {
    console.log('Initialisation des données...');
    
    try {
      await AsyncStorage.setItem('pokemons', JSON.stringify(pokemonData));
      await AsyncStorage.setItem('moves', JSON.stringify(movesData));
      await AsyncStorage.setItem('items', JSON.stringify(itemsData));
      await AsyncStorage.setItem('natures', JSON.stringify(naturesData));
      await AsyncStorage.setItem('movesbypoke', JSON.stringify(movesByPokemonData));
      await AsyncStorage.setItem('abilities', JSON.stringify(abilitiesData));
      
      console.log('Données initialisées avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des données:', error);
      throw error;
    }
  }

  // === POKÉMON ===
  async getPokemons() {
    await this.init();
    const data = await AsyncStorage.getItem('pokemons');
    const pokemons = JSON.parse(data || '[]');
    return pokemons.sort((a, b) => a._id - b._id);
  }

  async getPokemonByName(name) {
    const pokemons = await this.getPokemons();
    return pokemons.find(p => p.name === name) || null;
  }

  async getPokemonById(id) {
    const pokemons = await this.getPokemons();
    return pokemons.find(p => p._id === id) || null;
  }

  async searchPokemons(query) {
    const pokemons = await this.getPokemons();
    return pokemons.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getPokemonByType(type) {
    const pokemons = await this.getPokemons();
    return pokemons.filter(p => 
      p.types && p.types.includes(type)
    );
  }

  async getPokemonForms(baseName) {
    const pokemons = await this.getPokemons();
    return pokemons.filter(p => 
      p.name.toLowerCase().startsWith(baseName.toLowerCase())
    );
  }

  async getPokemonByAbility(abilityName) {
    const pokemons = await this.getPokemons();
    const pokemonsWithAbility = [];
    
    pokemons.forEach(pokemon => {
      if (pokemon.abilities) {
        const ability = pokemon.abilities.find(ability => ability.name === abilityName);
        if (ability) {
          pokemonsWithAbility.push({
            ...pokemon,
            isHiddenAbility: ability.is_hidden || false
          });
        }
      }
    });
    
    return pokemonsWithAbility;
  }

  async getPokemonByMove(move) {
    const movesByPoke = await this.getMovesByPokemon();
    const pokemonWithMove = movesByPoke.filter(m => 
      m.moves && m.moves.includes(move)
    );
    
    if (pokemonWithMove.length === 0) return [];
    
    const pokemons = [];
    for (const pokemonData of pokemonWithMove) {
      const pokemon = await this.getPokemonByName(pokemonData.name);
      if (pokemon) pokemons.push(pokemon);
    }
    
    return pokemons;
  }

  // === MOVES ===
  async getMoves() {
    await this.init();
    const data = await AsyncStorage.getItem('moves');
    const moves = JSON.parse(data || '[]');
    return moves.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getMoveByName(name) {
    const moves = await this.getMoves();
    return moves.find(m => m.name === name) || null;
  }

  async searchMoves(query) {
    const moves = await this.getMoves();
    return moves.filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getMovesByType(type) {
    const moves = await this.getMoves();
    return moves.filter(m => m.type === type);
  }

  async getMovesByClass(damageClass) {
    const moves = await this.getMoves();
    return moves.filter(m => m.damage_class === damageClass);
  }

  async getMovesByPokemon(pokemonName) {
    const movesByPoke = await this.getMovesByPokemon();
    const pokemonMoves = movesByPoke.find(m => m.name === pokemonName);
    
    if (!pokemonMoves || !pokemonMoves.moves) return [];
    
    const allMoves = await this.getMoves();
    return allMoves.filter(move => 
      pokemonMoves.moves.includes(move.name)
    );
  }

  // === ITEMS ===
  async getItems() {
    await this.init();
    const data = await AsyncStorage.getItem('items');
    const items = JSON.parse(data || '[]');
    return items
      .filter(item => item.sprite_default)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getItemByName(name) {
    const items = await this.getItems();
    return items.find(item => item.name === name) || null;
  }

  async searchItems(query) {
    const items = await this.getItems();
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // === NATURES ===
  async getNatures() {
    await this.init();
    const data = await AsyncStorage.getItem('natures');
    const natures = JSON.parse(data || '[]');
    return natures.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getNatureByName(name) {
    const natures = await this.getNatures();
    return natures.find(n => n.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async getNatureModifier(natureName, stat) {
    const nature = await this.getNatureByName(natureName);
    return nature ? nature.modifiers[stat] || 1.0 : 1.0;
  }

  // === ABILITIES ===
  async getAllAbilities() {
    await this.init();
    const data = await AsyncStorage.getItem('abilities');
    const abilities = JSON.parse(data || '[]');
    return abilities.sort((a, b) => {
      if (!a.name || !b.name) return 0;
      return a.name.localeCompare(b.name);
    });
  }

  async getAbilityByName(name) {
    const abilities = await this.getAllAbilities();
    return abilities.find(ability => ability.name === name) || null;
  }

  async searchAbilities(query) {
    const abilities = await this.getAllAbilities();
    return abilities.filter(ability => 
      ability.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // === UTILS ===
  async getPokemonStats(pokemonName) {
    const pokemon = await this.getPokemonByName(pokemonName);
    return pokemon ? pokemon.stats : [];
  }

  async calculateStatsWithNature(baseStats, natureName) {
    const nature = await this.getNatureByName(natureName);
    if (!nature) return baseStats;
    return baseStats.map(stat => ({
      ...stat,
      base_stat: Math.floor(stat.base_stat * (nature.modifiers[stat.name] || 1.0))
    }));
  }

  // === HELPERS ===
  async getMovesByPokemon() {
    await this.init();
    const data = await AsyncStorage.getItem('movesbypoke');
    return JSON.parse(data || '[]');
  }
}

export default new AsyncStorageService();