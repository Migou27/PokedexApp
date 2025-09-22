import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PokemonSelector from '../screens/TeamsList/PokemonSelector';
import PokemonEditor from '../screens/TeamsList/PokemonEditor';

export default function CreateTeamModal({ team, onSave, onCancel }) {
  const [teamName, setTeamName] = useState(team?.name || '');
  const [pokemons, setPokemons] = useState(team?.pokemons || Array(6).fill({}));
  const [showPokemonSelector, setShowPokemonSelector] = useState(false);
  const [editingPokemonIndex, setEditingPokemonIndex] = useState(null);
  const [showPokemonEditor, setShowPokemonEditor] = useState(false);

  const pokemonCount = pokemons.filter(pokemon => pokemon && pokemon.name).length;

  const handleSave = () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Please give a name to your team');
      return;
    }

    const validPokemons = pokemons.filter(p => p.name);
    if (validPokemons.length === 0) {
      Alert.alert('Error', 'Please add at least one Pokémon');
      return;
    }

    onSave({
      name: teamName.trim(),
      pokemons: pokemons,
    });
  };

  const handlePokemonSelect = (pokemon, index) => {
    // Créer un nouveau Pokémon avec des valeurs par défaut
    const newPokemon = {
      ...pokemon,
      level: 100,
      moves: ['', '', '', ''],
      ability: pokemon.abilities?.[0]?.name || '',
      nature: 'Hardy',
      gender: 'M',
      shiny: false,
      teraType: 'Normal',
      evs: { hp: 0, attack: 0, defense: 0, sp_attack: 0, sp_defense: 0, speed: 0 },
      ivs: { hp: 31, attack: 31, defense: 31, sp_attack: 31, sp_defense: 31, speed: 31 },
      item: null
    };

    // Mettre à jour la liste des Pokémon
    const newPokemons = [...pokemons];
    newPokemons[index] = newPokemon;
    setPokemons(newPokemons);

    // Fermer le sélecteur de Pokémon
    setShowPokemonSelector(false);
    
    // Ouvrir directement l'éditeur de Pokémon pour le nouveau Pokémon
    setEditingPokemonIndex(index);
    setShowPokemonEditor(true);
  };

  const handlePokemonEdit = (index) => {
    // Si le slot est vide, ouvrir le sélecteur de Pokémon
    if (!pokemons[index] || !pokemons[index].name) {
      setEditingPokemonIndex(index);
      setShowPokemonSelector(true);
    } else {
      // Si le slot contient déjà un Pokémon, ouvrir l'éditeur
      setEditingPokemonIndex(index);
      setShowPokemonEditor(true);
    }
  };

  const handlePokemonUpdate = (updatedPokemon) => {
    const newPokemons = [...pokemons];
    newPokemons[editingPokemonIndex] = updatedPokemon;
    setPokemons(newPokemons);
    setShowPokemonEditor(false);
    setEditingPokemonIndex(null);
  };

  const removePokemon = (index) => {
    const newPokemons = [...pokemons];
    newPokemons[index] = {};
    setPokemons(newPokemons);
  };

  const handlePokemonDelete = (pokemonToDelete) => {
    // Trouver l'index du Pokémon à supprimer
    const index = pokemons.findIndex(p => p.name === pokemonToDelete.name);
    if (index !== -1) {
      removePokemon(index);
      setShowPokemonEditor(false);
      setEditingPokemonIndex(null);
    }
  };

  // Vérifier si le Pokémon à l'index donné existe et a un nom
  const getPokemonForEditing = (index) => {
    const pokemon = pokemons[index];
    if (pokemon && pokemon.name) {
      return pokemon;
    }
    // Si pas de Pokémon ou pas de nom, retourner un Pokémon par défaut
    return {
      name: 'New Pokémon',
      level: 100,
      gender: 'M',
      shiny: false,
      teraType: 'Normal',
      ability: '',
      moves: ['', '', '', ''],
      item: '',
      nature: 'Hardy',
      evs: { Hp: 0, Atk: 0, Def: 0, Spa: 0, SpDef: 0, Spd: 0 },
      ivs: { Hp: 31, Atk: 31, Def: 31, Spa: 31, SpDef: 31, Spd: 31 },
      base_stats: {},
      types: ['Normal'],
      abilities: []
    };
  };

  const renderPokemonSlot = (pokemon, index) => (
    <TouchableOpacity
      key={index}
      style={styles.pokemonSlot}
      onPress={() => handlePokemonEdit(index)}
    >
      {pokemon && pokemon.name ? (
        <View style={styles.pokemonInfo}>
          <View style={styles.spriteContainer}>
            <Image
              source={{ uri: pokemon.sprite_front_default }}
              style={styles.pokemonSprite}
              resizeMode="contain"
            />
            {pokemon.shiny && (
              <Image
                source={require('../assets/images/shiny.png')}
                style={styles.shinyIndicator}
                resizeMode="contain"
              />
            )}
          </View>
          
          <View style={styles.pokemonDetails}>
            <Text style={styles.pokemonName}>{pokemon.name}</Text>
            <Text style={styles.pokemonLevel}>Lv. {pokemon.level}</Text>
          </View>
          
          {pokemon.item && pokemon.item.name && (
            <View style={styles.itemSlot}>
              <Image
                source={{ uri: pokemon.item.sprite_default }}
                style={styles.itemSprite}
                resizeMode="contain"
                onError={() => console.log('Failed to load item sprite:', pokemon.item.name)}
              />
            </View>
          )}
          
          {/* Bouton de suppression seulement */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                'Delete Pokemon',
                `Are you sure you want to remove ${pokemon.name} from the team?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => removePokemon(index)
                  }
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptySlot}>
          <Ionicons name="add-circle-outline" size={32} color="#ccc" />
          <Text style={styles.emptySlotText}>Add</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {team ? 'Edit Team' : 'New Team'}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.teamNameSection}>
          <Text style={styles.sectionTitle}>Team Name</Text>
          <TextInput
            style={styles.teamNameInput}
            value={teamName}
            onChangeText={setTeamName}
            placeholder="Your team name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.pokemonSection}>
          <Text style={styles.sectionTitle}>Pokemon ({pokemonCount}/6)</Text>
          <Text style={styles.sectionSubtitle}>
            Add up to 6 Pokemon to your team
          </Text>

          <View style={styles.pokemonGrid}>
            {pokemons.map((pokemon, index) => renderPokemonSlot(pokemon, index))}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showPokemonSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <PokemonSelector
          onSelect={(pokemon) => handlePokemonSelect(pokemon, editingPokemonIndex)}
          onCancel={() => setShowPokemonSelector(false)}
        />
      </Modal>

      <Modal
        visible={showPokemonEditor}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <PokemonEditor
          pokemon={getPokemonForEditing(editingPokemonIndex)}
          onSave={handlePokemonUpdate}
          onCancel={() => {
            setShowPokemonEditor(false);
            setEditingPokemonIndex(null);
          }}
          onDelete={handlePokemonDelete}
        />
      </Modal>
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
  saveButton: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  teamNameSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  teamNameInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pokemonSection: {
    marginBottom: 24,
  },
  pokemonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  pokemonSlot: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  pokemonInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  spriteContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pokemonSprite: {
    width: 100,
    height: 100,
    marginBottom: -10,
  },
  pokemonDetails: {
    alignItems: 'center',
  },
  pokemonName: {
    fontSize: 13, // Augmenté de 11 à 13
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  pokemonLevel: {
    fontSize: 11, // Augmenté de 9 à 11
    color: '#666',
    marginTop: 2, // Augmenté de 1 à 2
  },
  shinyIndicator: {
    position: 'absolute',
    top: 10, // Positionné en haut à droite du sprite
    right: 10,
    width: 22,
    height: 22,
  },
  itemSlot: {
    position: 'absolute',
    bottom: -5,
    left: -5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemSprite: {
    width: 40, // Doublé de 20 à 40
    height: 40, // Doublé de 20 à 40
  },
  editButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 3,
  },
  emptySlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderRadius: 6,
  },
  emptySlotText: {
    fontSize: 11, // Augmenté de 9 à 11
    color: '#6c757d',
    marginTop: 3,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
});