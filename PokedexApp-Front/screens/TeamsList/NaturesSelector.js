import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NaturesSelector({ natures, onSelect, onCancel }) {
  const renderNature = ({ item }) => (
    <TouchableOpacity
      style={styles.natureItem}
      onPress={() => onSelect(item)}
    >
      <View style={styles.natureInfo}>
        <Text style={styles.natureName}>{item.name}</Text>
        <View style={styles.natureModifiers}>
          {item.plus ? (
            <Text style={styles.modifierPlus}>+{item.plus}</Text>
          ) : null}
          {item.minus ? (
            <Text style={styles.modifierMinus}>-{item.minus}</Text>
          ) : null}
          {!item.plus && !item.minus && (
            <Text style={styles.modifierNeutral}>Neutre</Text>
          )}
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
        <Text style={styles.headerTitle}>Sélectionner une nature</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={natures}
        renderItem={renderNature}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.naturesList}
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
  naturesList: {
    padding: 16,
  },
  natureItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  natureInfo: {
    flex: 1,
  },
  natureName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  natureModifiers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modifierPlus: {
    backgroundColor: '#10b981',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  modifierMinus: {
    backgroundColor: '#ef4444',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  modifierNeutral: {
    backgroundColor: '#6b7280',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
});
