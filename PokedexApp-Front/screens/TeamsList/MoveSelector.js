import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MovesSelector({ moves, onSelect, onCancel }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMoves, setFilteredMoves] = useState(moves);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredMoves(moves);
    } else {
      const filtered = moves.filter(move =>
        move.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMoves(filtered);
    }
  };

  const renderMove = ({ item }) => (
    <TouchableOpacity
      style={styles.moveItem}
      onPress={() => onSelect(item)}
    >
      <View style={styles.moveInfo}>
        <Text style={styles.moveName}>{item.name}</Text>
        <View style={styles.moveDetails}>
          <Text style={styles.moveType}>{item.type}</Text>
          <Text style={styles.movePower}>
            {item.power ? `Puissance: ${item.power}` : 'Statut'}
          </Text>
          <Text style={styles.moveAccuracy}>
            Accuracy: {item.accuracy || 'N/A'}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select a move</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Rechercher une attaque..."
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredMoves}
        renderItem={renderMove}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.movesList}
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
  movesList: {
    padding: 16,
  },
  moveItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moveInfo: {
    flex: 1,
  },
  moveName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  moveDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moveType: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
    fontSize: 12,
    color: '#666',
  },
  movePower: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  moveAccuracy: {
    fontSize: 12,
    color: '#666',
  },
});