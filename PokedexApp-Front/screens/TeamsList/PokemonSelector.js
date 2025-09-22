import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PokemonAPI } from '../../services/PokemonAPI';
import PokemonCard from '../../components/PokemonCard';

export default function PokemonSelector({ onSelect, onCancel }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPokemons();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPokemons(pokemons.slice(0, 50)); // Limiter à 50 pour les performances
    } else {
      const filtered = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      setFilteredPokemons(filtered.slice(0, 100));
    }
  }, [searchQuery, pokemons]);

  const loadPokemons = async () => {
    try {
      const allPokemons = await PokemonAPI.getPokemons();
      setPokemons(allPokemons);
      setFilteredPokemons(allPokemons.slice(0, 50));
    } catch (error) {
      console.error('Error loading Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPokemon = ({ item }) => (
    <PokemonCard
      pokemon={item}
      onPress={onSelect}
      compact={true}
    />
  );

  const getTypeColor = (type) => {
    const typeColors = {
      Normal: '#A8A878', Fighting: '#C03028', Flying: '#A890F0',
      Poison: '#A040A0', Ground: '#E0C068', Rock: '#B8A038',
      Bug: '#A8B820', Ghost: '#705898', Steel: '#B8B8D0',
      Fire: '#F08030', Water: '#6890F0', Grass: '#78C850',
      Electric: '#F8D030', Psychic: '#F85888', Ice: '#98D8D8',
      Dragon: '#7038F8', Dark: '#705848', Fairy: '#EE99AC'
    };
    return typeColors[type] || '#A8A878';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading Pokémon...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select a Pokémon</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for a Pokémon..."
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredPokemons}
        renderItem={renderPokemon}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.pokemonList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  pokemonList: {
    padding: 16,
  },
  pokemonItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pokemonInfo: {
    flex: 1,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  typesContainer: {
    flexDirection: 'row',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});