import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image as RNImage } from 'react-native';
import paths from '../assets/importImages';

const getTypeIcon = (type) => {
  return paths.typeIcons[type?.toLowerCase()] || null;
};

const getClassIcon = (moveClass) => {
  return paths.classIcons[moveClass?.toLowerCase()] || null;
};

export default function MoveCard({ move, onPress, style }) {
  if (!move || !move.name) return null;

  return (
    <TouchableOpacity onPress={() => onPress?.(move)} activeOpacity={0.8}>
      <View style={[styles.moveCard, style]}>
        <View style={styles.moveTypeBadge}>
          <RNImage
            source={getTypeIcon(move.type)}
            style={{ width: 75, height: 32 }}
            resizeMode="contain"
          />
        </View>
        <RNImage
          source={getClassIcon(move.damage_class)}
          style={{ width: 35, height: 28 }}
          resizeMode="contain"
        />
        <View style={styles.moveInfo}>
          <Text style={styles.moveName}>{move.name}</Text>
          <View style={styles.moveStatsRow}>
            <Text style={styles.moveStat}>Power: {move.power ?? '-'}</Text>
            <Text style={styles.moveStat}>
              Acc: {move.accuracy != null ? `${move.accuracy}%` : '-'}
            </Text>
            <Text style={styles.moveStat}>PP: {move.pp ?? '-'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  moveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    margin: 'auto',
    width: '92%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderWidth: 0.5,
    borderColor: '#d5d8dc',
  },
  moveTypeBadge: {
    borderRadius: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  moveInfo: {
    flex: 1,
    paddingLeft: 8,
  },
  moveName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  moveStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moveStat: {
    fontSize: 11,
    color: '#555',
    marginRight: 8,
  },
});