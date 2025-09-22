import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image as RNImage } from 'react-native';
import paths from '../assets/importImages';

const getTypeIcon = (type) => {
  return paths.typeIcons[type?.toLowerCase()] || null;
};

const getCardColors = (types) => {
  if (!types || types.length === 0) return ['#A8A878', '#C6C6A7'];
  
  const typeColors = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
    grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
    ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', fairy: '#EE99AC'
  };
  
  if (types.length === 1) {
    const color = typeColors[types[0].toLowerCase()] || '#A8A878';
    return [color, color];
  } else {
    const color1 = typeColors[types[0].toLowerCase()] || '#A8A878';
    const color2 = typeColors[types[1].toLowerCase()] || '#C6C6A7';
    return [color1, color2];
  }
};

export default function PokemonCard({ 
  pokemon, 
  onPress, 
  showSprite = true, 
  compact = false,
  showTypes = true 
}) {
  if (!pokemon || !pokemon.name) return null;

  const cardColors = getCardColors(pokemon.types);
  
  return (
    <TouchableOpacity
      onPress={() => onPress?.(pokemon)}
      activeOpacity={0.7}
      style={[styles.card, compact && styles.compactCard]}
    >
      <LinearGradient
        colors={cardColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.info}>
            <Text style={[styles.name, compact && styles.compactName]}>
              {pokemon.name}
            </Text>
            {showTypes && pokemon.types && (
              <View style={styles.typesContainer}>
                {pokemon.types.map((type, index) => (
                  <View key={index} style={{ marginRight: 4 }}>
                    <RNImage
                      source={getTypeIcon(type)}
                      style={[styles.typeIcon, compact && styles.compactTypeIcon]}
                      resizeMode="contain"
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
          {showSprite && pokemon.sprite_front_default && (
            <Image
              source={{ uri: pokemon.sprite_front_default }}
              style={[styles.sprite, compact && styles.compactSprite]}
              resizeMode="contain"
            />
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  compactCard: {
    marginBottom: 8,
  },
  gradient: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  compactName: {
    fontSize: 16,
    marginBottom: 6,
  },
  typesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 75,
    height: 16,
  },
  compactTypeIcon: {
    width: 65,
    height: 14,
  },
  sprite: {
    width: 64, // Augmenté de 56 à 64
    height: 64, // Augmenté de 56 à 64
    marginLeft: 4, // Réduit de 8 à 4 pour compenser
  },
  compactSprite: {
    width: 56, // Augmenté de 48 à 56
    height: 56, // Augmenté de 48 à 56
    marginLeft: 4, // Réduit pour compenser
  },
});