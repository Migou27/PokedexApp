import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TeamCard({ team, onEdit, onDelete, onExport }) {
  const pokemonCount = team.pokemons?.filter(p => p.name).length || 0;
  const pokemons = team.pokemons || [];

  const renderPokemonSlots = () => (
    <View style={styles.pokemonRow}>
      {Array.from({ length: 6 }, (_, index) => renderPokemonSlot(pokemons[index], index))}
    </View>
  );

  const renderPokemonSlot = (pokemon, index) => (
    <View key={index} style={styles.pokemonSlot}>
      {pokemon && pokemon.name ? (
        <View style={styles.pokemonInfo}>
          <Image
            source={{ uri: pokemon.sprite_front_default }}
            style={styles.pokemonSprite}
            resizeMode="contain"
          />
          {pokemon.shiny && (
            <Image
              source={require('../../assets/images/shiny.png')}
              style={styles.shinyIndicator}
              resizeMode="contain"
            />
          )}
        </View>
      ) : (
        <View style={styles.emptySlot}>
          <Ionicons name="add-circle-outline" size={24} color="#ccc" />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.pokemonCount}>{pokemonCount}/6 Pokemons</Text>
      </View>

      <View style={styles.pokemonPreview}>
        {renderPokemonSlots()}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Ionicons name="create-outline" size={20} color="#2563eb" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onExport}>
          <Ionicons name="share-outline" size={20} color="#10b981" />
          <Text style={styles.actionText}>Export</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  pokemonCount: {
    fontSize: 14,
    color: '#666',
  },
  pokemonPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Changé de 'space-between' à 'center'
    alignItems: 'center', // Ajouté pour centrer verticalement
    marginBottom: 12,
  },
  pokemonRow: {
    flexDirection: 'row',
    justifyContent: 'center', // Changé de 'space-between' à 'center'
    alignItems: 'center', // Ajouté pour centrer verticalement
    marginTop: 8,
    paddingHorizontal: 2,
    width: '100%', // Ajouté pour s'assurer que la ligne prend toute la largeur
  },
  pokemonSlot: {
    width: '15%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 2, // Ajouté un petit espacement horizontal entre les slots
  },
  
  pokemonInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  
  pokemonSprite: {
    width: 75, // Augmenté de 48 à 56
    height: 75, // Augmenté de 48 à 56
  },
  
  shinyIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 20,
    height: 20,
  },
  
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8, // Réduit de 12 à 8
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6, // Réduit de 8 à 6
    paddingHorizontal: 10, // Réduit de 12 à 10
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
});