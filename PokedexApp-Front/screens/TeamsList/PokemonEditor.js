import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  Share, // Importation de l'API de partage
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MovesAPI } from '../../services/MovesAPI';
import { ItemsAPI } from '../../services/ItemsAPI';
import { AbilitiesAPI } from '../../services/AbilitiesAPI';
import { PokemonAPI } from '../../services/PokemonAPI';
import StatCalculator from '../../components/StatCalculator';
import MoveCard from '../../components/MoveCard';
import PokemonCard from '../../components/PokemonCard';
import paths from '../../assets/importImages';

function MovesSelector({ moves, onSelect, onCancel }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMoves, setFilteredMoves] = useState(moves);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredMoves(moves);
    } else {
      const filtered = moves.filter(move =>
        move.name.toLowerCase().includes(query.toLowerCase()) ||
        move.type.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMoves(filtered);
    }
  };

  const getTypeIcon = (type) => {
    return paths.typeIcons[type?.toLowerCase()] || null;
  };

  const getClassIcon = (moveClass) => {
    return paths.classIcons[moveClass?.toLowerCase()] || null;
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Select Move</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search moves..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredMoves}
        keyExtractor={(item) => item._id?.$oid || item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.moveItem}
            onPress={() => onSelect(item)}
          >
            <View style={styles.moveHeader}>
              <View style={styles.moveTypeContainer}>
                {getTypeIcon(item.type) && (
                  <Image source={getTypeIcon(item.type)} style={styles.typeIcon} />
                )}
              </View>
              <View style={styles.moveInfo}>
                <Text style={styles.moveName}>{item.name}</Text>
                <View style={styles.moveDetails}>
                  <Text style={styles.movePower}>{item.power || '???'}</Text>
                  {getClassIcon(item.class) && (
                    <Image source={getClassIcon(item.class)} style={styles.classIcon} />
                  )}
                </View>
              </View>
            </View>
            <Text style={styles.moveDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function ItemsSelector({ items, onSelect, onCancel }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Select Item</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item._id?.$oid || item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function AbilitiesSelector({ abilities, onSelect, onCancel }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAbilities, setFilteredAbilities] = useState(abilities);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredAbilities(abilities);
    } else {
      const filtered = abilities.filter(ability =>
        ability.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAbilities(filtered);
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Select Ability</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search abilities..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredAbilities}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.abilityRow}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.abilityName}>{item.name}</Text>
            <Text style={styles.abilityDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default function PokemonEditor({ pokemon, onSave, onCancel, onDelete }) {
  const [editedPokemon, setEditedPokemon] = useState({ ...pokemon });
  const [showMovesSelector, setShowMovesSelector] = useState(false);
  const [showItemsSelector, setShowItemsSelector] = useState(false);
  const [showAbilitiesSelector, setShowAbilitiesSelector] = useState(false);
  const [showPokemonSelector, setShowPokemonSelector] = useState(false);
  const [editingMoveIndex, setEditingMoveIndex] = useState(null);
  const [moves, setMoves] = useState([]);
  const [pokemonMoves, setPokemonMoves] = useState([]);
  const [items, setItems] = useState([]);
  const [abilitiesDetails, setAbilitiesDetails] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [allPokemons, setAllPokemons] = useState([]);
  const [selectedNature, setSelectedNature] = useState(null);
  const [selectedIVs, setSelectedIVs] = useState({
    Hp: 31, Atk: 31, Def: 31, Spa: 31, SpDef: 31, Spd: 31
  });
  const [statCalculatorLevel, setStatCalculatorLevel] = useState(100);
  const [showTeraSelector, setShowTeraSelector] = useState(false);
  const [teraSearchQuery, setTeraSearchQuery] = useState('');
  // Ajout des états pour l'export Showdown
  const [showdownExport, setShowdownExport] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [movesData, itemsData, abilitiesData, pokemonMovesData, pokemonData, allPokemonsData] = await Promise.all([
          MovesAPI.getMoves(),
          ItemsAPI.getItems(),
          AbilitiesAPI.getAllAbilities(),
          MovesAPI.getMovesByPokemon(pokemon.name),
          PokemonAPI.getPokemonByName(pokemon.name),
          PokemonAPI.getPokemons()
        ]);
        
        setMoves(movesData);
        setItems(itemsData);
        setAbilitiesDetails(abilitiesData);
        setPokemonMoves(pokemonMovesData);
        setPokemonDetails(pokemonData);
        setAllPokemons(allPokemonsData);
        setStatCalculatorLevel(pokemon.level || 100);
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert('Error', 'Failed to load data');
      }
    };

    loadData();
  }, [pokemon.name]);

  const updatePokemon = (field, value) => {
    // Capter le niveau à 100 maximum
    if (field === 'level') {
      value = Math.min(100, Math.max(1, parseInt(value) || 1));
      setStatCalculatorLevel(value);
    }
    
    setEditedPokemon(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = () => {
    // Afficher une confirmation avant de supprimer
    Alert.alert(
      'Delete Pokemon',
      `Are you sure you want to delete ${pokemon.name} from the team?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete && onDelete(pokemon);
          },
        },
      ]
    );
  };

  const selectMove = (move, index) => {
    const updatedMoves = [...editedPokemon.moves];
    updatedMoves[index] = move; // Stocker l'objet move complet au lieu de juste le nom
    updatePokemon('moves', updatedMoves);
    setShowMovesSelector(false);
  };

  const selectItem = (item) => {
    updatePokemon('item', item);
    setShowItemsSelector(false);
  };

  const selectAbility = (ability) => {
    updatePokemon('ability', ability.name);
    setShowAbilitiesSelector(false);
  };

  const selectPokemon = (newPokemon) => {
    // Reset toutes les données du Pokémon
    const resetPokemon = {
      name: newPokemon.name,
      nickname: '',
      level: 100,
      shiny: false,
      gender: null, // Pas de genre par défaut
      item: null,
      ability: null,
      moves: ['', '', '', ''],
      teraType: 'Normal'
    };
    setEditedPokemon(resetPokemon);
    setStatCalculatorLevel(100); // Synchroniser le niveau du StatCalculator
    setShowPokemonSelector(false);
    
    // Recharger les données pour le nouveau Pokémon
    const loadNewPokemonData = async () => {
      try {
        const [newPokemonMoves, newPokemonDetails] = await Promise.all([
          MovesAPI.getMovesByPokemon(newPokemon.name),
          PokemonAPI.getPokemonByName(newPokemon.name)
        ]);
        setPokemonMoves(newPokemonMoves);
        setPokemonDetails(newPokemonDetails);
      } catch (error) {
        console.error('Error loading new pokemon data:', error);
      }
    };
    loadNewPokemonData();
  };

  const getAvailableMoves = () => {
    if (!pokemonMoves || pokemonMoves.length === 0) return [];
    
    const pokemonData = pokemonMoves.find(p => p.name === pokemon.name);
    
    if (!pokemonData || !pokemonData.moves) return [];
    
    const availableMoves = pokemonData.moves
      .map(moveName => moves.find(m => m.name === moveName))
      .filter(move => move)
      .filter(move => !editedPokemon.moves.some(m => 
        typeof m === 'object' ? m.name === move.name : m === move.name
      ))
      .sort((a, b) => (b.power || 0) - (a.power || 0));
    
    return availableMoves;
  };

  const getAvailableAbilities = () => {
    if (!pokemon.abilities || !abilitiesDetails.length) return [];
    
    return pokemon.abilities.map(pokemonAbility => {
      const abilityDetail = abilitiesDetails.find(ab => ab.name === pokemonAbility.name);
      return {
        ...pokemonAbility,
        description: abilityDetail?.description || 'No description available'
      };
    });
  };

  const handleSave = () => {
    const pokemonToSave = {
      ...editedPokemon,
      nature: selectedNature,
      ivs: selectedIVs
    };
    onSave(pokemonToSave);
  };

  const handleStatCalculatorLevelChange = (newLevel) => {
    setStatCalculatorLevel(newLevel);
    setEditedPokemon(prev => ({ ...prev, level: newLevel }));
  };

  const teraTypes = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy', 'Stellar'];
  
  const filteredTeraTypes = teraTypes.filter(type =>
    type.toLowerCase().includes(teraSearchQuery.toLowerCase())
  );
  
  // Fonction pour générer le format Showdown
  const generateShowdownExport = async () => {
    let showdownString = '';
    
    const nameLine = editedPokemon.nickname 
      ? `${editedPokemon.nickname} (${editedPokemon.name})`
      : editedPokemon.name;
    
    const genderLine = editedPokemon.gender === 'Male' ? ' (M)' : editedPokemon.gender === 'Female' ? ' (F)' : '';
    const itemLine = editedPokemon.item?.name ? ` @ ${editedPokemon.item.name}` : '';
    
    showdownString += `${nameLine}${genderLine}${itemLine}\n`;
    
    if (editedPokemon.ability) {
        showdownString += `Ability: ${editedPokemon.ability}\n`;
    }
    
    if (editedPokemon.level && editedPokemon.level !== 100) {
      showdownString += `Level: ${editedPokemon.level}\n`;
    }
    
    if (editedPokemon.shiny) {
      showdownString += `Shiny: Yes\n`;
    }
    
    if (editedPokemon.teraType) {
        showdownString += `Tera Type: ${editedPokemon.teraType}\n`;
    }
    
    const ivsString = Object.keys(selectedIVs).map(stat => `${selectedIVs[stat]} ${stat}`).join(' / ');
    showdownString += `IVs: ${ivsString}\n`;

    // Gestion des EVs
    // À implémenter si la fonctionnalité est ajoutée
    
    // Gestion de la nature
    // À implémenter si la fonctionnalité est ajoutée

    editedPokemon.moves.forEach(move => {
        const moveName = move.name || move;
        if (moveName) {
            showdownString += `- ${moveName}\n`;
        }
    });
    
    // Ajout d'une ligne vide à la fin
    showdownString += `\n`;
    
    setShowdownExport(showdownString);
    setShowExportModal(true);
  };
  
  const shareShowdownExport = async () => {
    try {
      await Share.share({
        message: showdownExport,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Pokemon</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={generateShowdownExport} style={styles.exportButton}>
            <Ionicons name="share-outline" size={20} color="#3b82f6" />
          </TouchableOpacity>
          {onDelete && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pokemon and Nickname on the same row */}
        <View style={styles.rowSection}>
          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>Pokemon</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowPokemonSelector(true)}
            >
              <Text style={styles.selectorButtonText}>
                {editedPokemon.name}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>Nickname</Text>
            <TextInput
              style={styles.textInput}
              value={editedPokemon.nickname || ''}
              onChangeText={(text) => updatePokemon('nickname', text)}
              placeholder="Enter nickname"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Level, Shiny, and Gender on the same row */}
        <View style={styles.rowSection}>
          <View style={styles.thirdSection}>
            <Text style={styles.sectionTitle}>Level</Text>
            <TextInput
              style={styles.textInput}
              value={editedPokemon.level?.toString() || ''}
              onChangeText={(text) => updatePokemon('level', parseInt(text) || 1)}
              placeholder="Enter level"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.thirdSection}>
            <Text style={styles.sectionTitle}>Shiny</Text>
            <TouchableOpacity
              style={[styles.toggleButton, editedPokemon.shiny && styles.toggleButtonActive]}
              onPress={() => updatePokemon('shiny', !editedPokemon.shiny)}
            >
              <Text style={[styles.toggleButtonText, editedPokemon.shiny && styles.toggleButtonTextActive]}>
                {editedPokemon.shiny ? 'Yes' : 'No'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Gender toggle avec style standard mais avec icônes */}
          <View style={styles.thirdSection}>
            <Text style={styles.sectionTitle}>Gender</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => {
                const genders = [null, 'Male', 'Female']; // Cycle M, F, null
                const currentIndex = genders.indexOf(editedPokemon.gender);
                const nextIndex = (currentIndex + 1) % genders.length;
                updatePokemon('gender', genders[nextIndex]);
              }}
            >
              <View style={styles.genderDisplay}>
                <View style={styles.genderIndicator}>
                  {editedPokemon.gender === 'Male' && (
                    <Text style={styles.genderSymbol}>♂</Text>
                  )}
                  {editedPokemon.gender === 'Female' && (
                    <Text style={styles.genderSymbol}>♀</Text>
                  )}
                  {!editedPokemon.gender && (
                    <Text style={styles.genderSymbol}>-</Text>
                  )}
                </View>
                <Text style={styles.selectorButtonText}>
                  {editedPokemon.gender || 'No gender'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Item and Ability on the same row */}
        <View style={styles.rowSection}>
          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>Item</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowItemsSelector(true)}
            >
              <Text style={styles.selectorButtonText}>
                {editedPokemon.item?.name || 'No item'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>Ability</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowAbilitiesSelector(true)}
            >
              <Text style={styles.selectorButtonText}>
                {editedPokemon.ability || 'No ability'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tera Crystal Type avec style standard et largeur réduite */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tera Crystal Type</Text>
          <TouchableOpacity
            style={[styles.selectorButton, styles.teraTypeSelector]}
            onPress={() => setShowTeraSelector(true)}
          >
            <View style={styles.teraTypeDisplay}>
              {editedPokemon.teraType && (
                <Image 
                  source={paths.typeIcons[editedPokemon.teraType.toLowerCase()]} 
                  style={styles.teraTypeIconSmall} 
                />
              )}
              <Text style={styles.selectorButtonText}>
                {editedPokemon.teraType || 'Select Type'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Moves */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moves</Text>
          {editedPokemon.moves?.map((move, index) => {
            let moveDetails = null;
            if (typeof move === 'object' && move.name) {
              moveDetails = move;
            } else if (typeof move === 'string') {
              moveDetails = moves.find(m => m.name === move);
            }
            
            const moveName = moveDetails?.name || move || `Move ${index + 1}`;
            
            return (
              <TouchableOpacity
                key={index}
                style={styles.moveCard}
                onPress={() => {
                  setEditingMoveIndex(index);
                  setShowMovesSelector(true);
                }}
              >
                <View style={styles.moveCardContent}>
                  <View style={styles.moveTypeBadge}>
                    {moveDetails?.type && (
                      <Image 
                        source={paths.typeIcons[moveDetails.type.toLowerCase()]} 
                        style={styles.moveTypeIcon} 
                      />
                    )}
                  </View>
                  
                  <View style={styles.moveInfo}>
                    <Text style={styles.moveName}>{moveName}</Text>
                  </View>
                  
                  <View style={styles.moveRightSection}>
                    {moveDetails?.damage_class && (
                      <Image 
                        source={paths.classIcons[moveDetails.damage_class.toLowerCase()]} 
                        style={styles.moveClassIcon} 
                      />
                    )}
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Stat Calculator */}
        {pokemonDetails && (
          <StatCalculator 
            baseStats={pokemonDetails.stats?.reduce((acc, stat) => {
              acc[stat.name] = stat.base_stat;
              return acc;
            }, {}) || {}} 
            pokemonName={pokemon.name}
            level={statCalculatorLevel}
            onLevelChange={handleStatCalculatorLevelChange}
            selectedIVs={selectedIVs} // Passer les IVs au StatCalculator
            onIVsChange={setSelectedIVs} // Permettre la modification des IVs
          />
        )}
        
        {/* Padding pour permettre le scroll */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Modals */}
      <Modal
        visible={showMovesSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMovesSelector(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Move</Text>
            <View style={{ width: 24 }} />
          </View>

          <FlatList
            data={getAvailableMoves()}
            keyExtractor={(item) => item._id?.$oid || item.name}
            renderItem={({ item }) => (
              <MoveCard
                move={item}
                onPress={(move) => {
                  selectMove(move, editingMoveIndex);
                  setShowMovesSelector(false);
                }}
                style={styles.moveCardInSelector}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.movesList}
          />
        </View>
      </Modal>

      <Modal
        visible={showItemsSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ItemsSelector
          items={items}
          onSelect={selectItem}
          onCancel={() => setShowItemsSelector(false)}
        />
      </Modal>

      <Modal
        visible={showAbilitiesSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AbilitiesSelector
          abilities={getAvailableAbilities()}
          onSelect={selectAbility}
          onCancel={() => setShowAbilitiesSelector(false)}
        />
      </Modal>

      {/* New Pokemon Selector Modal with PokemonCard */}
      <Modal
        visible={showPokemonSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPokemonSelector(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Pokemon</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search pokemon..."
              placeholderTextColor="#999"
            />
          </View>

          <FlatList
            data={allPokemons}
            keyExtractor={(item) => item._id?.$oid || item.name}
            renderItem={({ item }) => (
              <PokemonCard
                pokemon={item}
                onPress={selectPokemon}
                compact={true}
                style={styles.pokemonCardInSelector}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.pokemonList}
          />
        </View>
      </Modal>

      {/* Modal Tera Type Selector */}
      <Modal
        visible={showTeraSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTeraSelector(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Tera Type</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search types..."
              placeholderTextColor="#999"
              value={teraSearchQuery}
              onChangeText={setTeraSearchQuery}
            />
          </View>

          <FlatList
            data={filteredTeraTypes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.teraTypeItem}
                onPress={() => {
                  updatePokemon('teraType', item);
                  setShowTeraSelector(false);
                }}
              >
                <View style={styles.teraTypeHeader}>
                  <View style={styles.teraTypeContainer}>
                    <Image 
                      source={paths.typeIcons[item.toLowerCase()]} 
                      style={styles.teraTypeIcon} 
                    />
                  </View>
                  <View style={styles.teraTypeInfo}>
                    <Text style={styles.teraTypeName}>{item}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
      
      {/* Modal d'export Showdown */}
      <Modal
        visible={showExportModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowExportModal(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Showdown Export</Text>
            <TouchableOpacity onPress={shareShowdownExport} style={{ width: 24 }}>
              <Ionicons name="share-outline" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.showdownContent}>
            <Text style={styles.showdownText}>{showdownExport}</Text>
          </ScrollView>
        </View>
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
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  selectorButtonText: {
    fontSize: 16,
    color: '#1f2937',
  },
  moveSelectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  moveSelectorButtonText: {
    fontSize: 16,
    color: '#1f2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  moveItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  moveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moveTypeContainer: {
    marginRight: 12,
  },
  moveType: {
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  moveName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  movePower: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  moveDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  itemRow: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  abilityRow: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  abilityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  abilityDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  typeIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  classIcon: {
    width: 16,
    height: 16,
    marginLeft: 8,
  },
  moveInfo: {
    flex: 1,
  },
  moveDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  movePower: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  rowSection: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  halfSection: {
    flex: 1,
  },
  toggleButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: 'white',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
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
  moveCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moveTypeBadge: {
    borderRadius: 8,
    paddingVertical: 2,
    marginRight: 8,
    minWidth: 80,
  },
  moveInfo: {
    flex: 1,
    paddingLeft: 8,
  },
  moveName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
  },
  moveRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moveTypeIcon: {
    width: 75,
    maxHeight: 15,
  },
  moveClassIcon: {
    width: 35,
    height: 15,
  },
  moveCardEffect: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 16,
  },
  
  // Styles pour le sélecteur de moves
  movesList: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  moveCardInSelector: {
    marginBottom: 8,
  },
  thirdSection: {
    flex: 1,
  },
  
  pokemonItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  
  pokemonName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  
  pokemonList: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  
  pokemonCardInSelector: {
    marginBottom: 8,
  },
  teraTypeSelector: {
    maxWidth: '80%',
    marginHorizontal: 'auto'
  },
  
  teraTypeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  teraTypeIconSmall: {
    width: 75,
    height: 15,
  },
  
  teraTypeText: {
    fontSize: 16,
    color: '#1f2937',
  },
  teraTypeList: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  teraTypeItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  teraTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teraTypeContainer: {
    marginRight: 12,
  },
  teraTypeIcon: {
    width: 75,
    height: 15,
  },
  teraTypeInfo: {
    flex: 1,
  },
  teraTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  genderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 12,
  },
  
  genderIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  genderSymbol: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  genderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  genderDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomPadding: {
    height: 100,
  },
  showdownContent: {
    flex: 1,
    padding: 16,
  },
  showdownText: {
    fontSize: 14,
    fontFamily: 'monospace',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    lineHeight: 20,
  },
  exportButton: {
    padding: 8,
  }
});