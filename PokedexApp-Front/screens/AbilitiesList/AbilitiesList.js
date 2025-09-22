import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, StyleSheet, Image, Modal } from 'react-native';
import { AbilitiesAPI } from '../../services/AbilitiesAPI';
import styles from '../MovesList/MovesList.styles';
import AbilityDetailModal from '../../Modals/AbilityDetails/AbilityDetailsModal';
import PokemonCard from '../../components/PokemonCard';
import MoveCard from '../../components/MoveCard';
import AbilityCard from '../../components/AbilityCard';
import PokemonSelector from '../../screens/TeamsList/PokemonSelector';
import CreateTeamModal from '../../Modals/CreateTeamModal';

export default function AbilitiesList() {
  const [abilities, setAbilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [showPokemonSelector, setShowPokemonSelector] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [createTeamModalVisible, setCreateTeamModalVisible] = useState(false);

  const filteredAbilities = React.useMemo(() => {
    let result = abilities;
    if (search.trim() !== '') {
      result = result.filter(ability =>
        ability && ability.name && ability.name.toLowerCase().startsWith(search.trim().toLowerCase())
      );
    }
    return result;
  }, [abilities, search]);

  // Correction : ajoute page et PAGE_SIZE dans les dépendances pour recalculer à chaque changement
  const paginatedAbilities = React.useMemo(() => {
    return filteredAbilities.slice(0, page * PAGE_SIZE);
  }, [filteredAbilities, page, PAGE_SIZE]);

  useEffect(() => {
    const fetchAbilities = async () => {
      try {
        const abilitiesData = await AbilitiesAPI.getAllAbilities();
        setAbilities(abilitiesData);
        setLoading(false);
      } catch (error) {
        console.error('AsyncStorage Error:', error);
        setError('Failed to load abilities data');
        setLoading(false);
      }
    };

    fetchAbilities();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    setPage(1); // Reset pagination on search change
  };

  const handleLoadMore = () => {
    const currentTotal = page * PAGE_SIZE;
    if (currentTotal < filteredAbilities.length && !loadingMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setPage((prev) => prev + 1);
        setLoadingMore(false);
      }, 500);
    }
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 200);
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size="small" color="#888" />
      </View>
    );
  };

  const handleAbilityPress = (ability) => {
    setSelectedAbility(ability);
    setModalVisible(true);
  };

  const handlePokemonSelect = (pokemon) => {
    setSelectedPokemon(pokemon);
    setShowPokemonSelector(false);
  };

  const handleCreateTeam = () => {
    setCreateTeamModalVisible(true);
  };

  const renderAbility = ({ item }) => (
    <AbilityCard
      ability={item}
      onPress={handleAbilityPress}
    />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search abilities..."
        value={search}
        onChangeText={handleSearch}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      <FlatList
        ref={flatListRef}
        data={paginatedAbilities}
        renderItem={renderAbility}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.abilitiesList}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopButton}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <Text style={styles.scrollTopButtonText}>Scroll to Top</Text>
        </TouchableOpacity>
      )}

      <AbilityDetailModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        ability={selectedAbility}
      />

      <Modal
        visible={showPokemonSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <PokemonSelector
          onSelect={handlePokemonSelect}
          onCancel={() => setShowPokemonSelector(false)}
        />
      </Modal>

      <CreateTeamModal
        isVisible={createTeamModalVisible}
        onClose={() => setCreateTeamModalVisible(false)}
        onSelectPokemon={handlePokemonSelect}
      />
    </View>
  );
}