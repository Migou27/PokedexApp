import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Share,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import TeamsService from '../../services/TeamsService';
import CreateTeamModal from '../../Modals/CreateTeamModal';
import TeamCard from './TeamCard';

export default function TeamsList() {
  const [teams, setTeams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    const userTeams = await TeamsService.getTeams();
    setTeams(userTeams);
  };

  const handleCreateTeam = async (teamData) => {
    const newTeam = {
      ...teamData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const success = await TeamsService.saveTeam(newTeam);
    if (success) {
      setShowCreateModal(false);
      loadTeams();
      Alert.alert('Success', 'Team created successfully!');
    } else {
      Alert.alert('Error', 'Unable to create team');
    }
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowCreateModal(true);
  };

  const handleUpdateTeam = async (teamData) => {
    const success = await TeamsService.updateTeam(editingTeam.id, teamData);
    if (success) {
      setShowCreateModal(false);
      setEditingTeam(null);
      loadTeams();
      Alert.alert('Success', 'Team updated successfully!');
    } else {
      Alert.alert('Error', 'Unable to update team');
    }
  };

  const handleDeleteTeam = (teamId) => {
    Alert.alert(
      'Confirm deletion',
      'Are you sure you want to delete this team?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await TeamsService.deleteTeam(teamId);
            if (success) {
              loadTeams();
              Alert.alert('Success', 'Team deleted');
            }
          },
        },
      ]
    );
  };

  const handleExportTeam = async (team) => {
    const showdownExport = TeamsService.generateShowdownExport(team);
    try {
      await Share.share({
        message: showdownExport,
        title: `Team ${team.name}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderTeam = ({ item }) => (
    <TeamCard
      team={item}
      onEdit={() => handleEditTeam(item)}
      onDelete={() => handleDeleteTeam(item.id)}
      onExport={() => handleExportTeam(item)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Teams</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>New Team</Text>
        </TouchableOpacity>
      </View>

      {teams.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No teams created</Text>
          <Text style={styles.emptyStateSubtext}>
            Create your first Pokemon team!
          </Text>
        </View>
      ) : (
        <FlatList
          data={teams}
          renderItem={renderTeam}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.teamsList}
        />
      )}

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <CreateTeamModal
          team={editingTeam}
          onSave={editingTeam ? handleUpdateTeam : handleCreateTeam}
          onCancel={() => {
            setShowCreateModal(false);
            setEditingTeam(null);
          }}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  teamsList: {
    padding: 16,
  },
});