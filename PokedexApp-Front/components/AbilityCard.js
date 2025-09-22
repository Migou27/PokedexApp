import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AbilityCard({ ability, onPress, style, compact = false }) {
  if (!ability || !ability.name) return null;

  return (
    <TouchableOpacity 
      style={[styles.card, style]} 
      onPress={() => onPress(ability)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.name}>
          {ability.name.charAt(0).toUpperCase() + ability.name.slice(1)}
        </Text>
        {ability.is_hidden && (
          <View style={styles.hiddenBadge}>
            <Ionicons name="eye-off" size={12} color="#666" />
            <Text style={styles.hiddenText}>Hidden</Text>
          </View>
        )}
      </View>
      
      {ability.short_effect && !compact && (
        <Text style={styles.description} numberOfLines={1}>
          {ability.short_effect}
        </Text>
      )}
      
      {ability.generation && !compact && (
        <View style={styles.generation}>
          <Text style={styles.generationText}>
            Génération {ability.generation}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#d5d8dc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  hiddenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  hiddenText: {
    fontSize: 9,
    color: '#666',
    marginLeft: 2,
  },
  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 6,
  },
  generation: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  generationText: {
    fontSize: 9,
    color: '#666',
    fontWeight: '500',
  },
});