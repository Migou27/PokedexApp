import AsyncStorage from '@react-native-async-storage/async-storage';

class TeamsService {
  constructor() {
    this.storageKey = 'user_teams';
  }

  // Sauvegarder une équipe
  async saveTeam(team) {
    try {
      const existingTeams = await this.getTeams();
      const updatedTeams = [...existingTeams, team];
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updatedTeams));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'équipe:', error);
      return false;
    }
  }

  // Récupérer toutes les équipes
  async getTeams() {
    try {
      const teams = await AsyncStorage.getItem(this.storageKey);
      return teams ? JSON.parse(teams) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes:', error);
      return [];
    }
  }

  // Supprimer une équipe
  async deleteTeam(teamId) {
    try {
      const existingTeams = await this.getTeams();
      const updatedTeams = existingTeams.filter(team => team.id !== teamId);
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updatedTeams));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'équipe:', error);
      return false;
    }
  }

  // Mettre à jour une équipe
  async updateTeam(teamId, updatedTeam) {
    try {
      const existingTeams = await this.getTeams();
      const updatedTeams = existingTeams.map(team => 
        team.id === teamId ? { ...updatedTeam, id: teamId } : team
      );
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updatedTeams));
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'équipe:', error);
      return false;
    }
  }

  // Générer l'export Showdown
  generateShowdownExport(team) {
    let exportText = '';
    
    team.pokemons.forEach(pokemon => {
      if (pokemon.name) {
        exportText += `${pokemon.name}`;
        if (pokemon.item && pokemon.item.name) exportText += ` @ ${pokemon.item.name}`;
        exportText += '\n';
        
        if (pokemon.ability) exportText += `Ability: ${pokemon.ability}\n`;
        if (pokemon.level) exportText += `Level: ${pokemon.level}\n`;
        if (pokemon.shiny) exportText += `Shiny: Yes\n`;
        if (pokemon.gender) exportText += `Gender: ${pokemon.gender}\n`;
        if (pokemon.teraType) exportText += `Tera Type: ${pokemon.teraType}\n`;
        
        if (pokemon.nature) exportText += `Nature: ${pokemon.nature}\n`;
        
        // EVs
        const evs = Object.entries(pokemon.evs || {})
          .filter(([_, value]) => value > 0)
          .map(([stat, value]) => `${stat} ${value}`)
          .join(' / ');
        if (evs) exportText += `EVs: ${evs}\n`;
        
        // IVs
        const ivs = Object.entries(pokemon.ivs || {})
          .filter(([_, value]) => value < 31)
          .map(([stat, value]) => `${stat} ${value}`)
          .join(' / ');
        if (ivs) exportText += `IVs: ${ivs}\n`;
        
        // Moves
        if (pokemon.moves && pokemon.moves.length > 0) {
          pokemon.moves.forEach(move => {
            if (move) exportText += `- ${move}\n`;
          });
        }
        
        exportText += '\n';
      }
    });
    
    return exportText.trim();
  }
}

export default new TeamsService();
