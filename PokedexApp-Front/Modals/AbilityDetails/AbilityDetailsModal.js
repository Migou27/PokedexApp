import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import styles from './AbilityDetailsModal.styles';
import { Image as RNImage } from 'react-native';
import { PokemonAPI } from '../../services/PokemonAPI';

const AbilityDetailModal = ({ isVisible, onClose, ability }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPokemonList = async () => {
      if (isVisible && ability?.name) {
        setLoading(true);
        try {
          // Utiliser le service AsyncStorage pour récupérer les Pokémon avec cette aptitude
          const pokemons = await PokemonAPI.getPokemonByAbility(ability.name);
          setPokemonList(pokemons);
          setLoading(false);
        } catch (e) {
          console.error('Erreur lors du chargement des Pokémon:', e);
          setPokemonList([]);
          setLoading(false);
        }
      } else {
        setPokemonList([]);
      }
    };
  
    fetchPokemonList();
  }, [isVisible, ability?.name]);

  if (!ability) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{ability.name}</Text>
          
          <View style={styles.modalDetailRow}>
            <Text style={styles.modalLabel}>Description:</Text>
          </View>
          <View style={styles.modalDetailRow}>
            <Text style={styles.modalValue}>
              {ability.short_effect || 'No description available.'}
            </Text>
          </View>

          {/* Pokémon possédant cette aptitude */}
          <Text style={styles.modalSectionTitle}>Pokemon with this ability :</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#888" style={{ marginVertical: 10 }} />
          ) : (
            <FlatList
              horizontal
              data={pokemonList}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <View style={{ alignItems: 'center', marginRight: 12 }}>
                  <RNImage source={{ uri: item.sprite_front_default }} style={styles.modalImage} />
                  <Text 
                    style={[
                      { fontSize: 12, marginTop: 2 },
                      item.isHiddenAbility && { color: '#FF6B6B', fontWeight: 'bold' }
                    ]}
                  >
                    {item.name}
                    {item.isHiddenAbility && ' (H)'}
                  </Text>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modalImagesContainer}
            />
          )}

          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AbilityDetailModal;