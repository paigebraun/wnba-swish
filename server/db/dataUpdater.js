const fetchTeams = require('./fetch/fetchTeams');
const fetchAllTeamStats = require('./fetch/fetchTeamStats');
const fetchAllPlayers = require('./fetch/fetchPlayers');
const fetchAllGames = require('./fetch/fetchGames');
const fetchAllPlayerStats = require('./fetch/fetchPlayerStats');
const fetchAllShots = require('./fetch/fetchShots');

// Update SQL tables
const updateDatabase = async () => {
    try {
        fetchTeams().catch(error => console.error('Error fetching and saving teams:', error));
        fetchAllTeamStats().catch(error => console.error('Error fetching and saving team stats:', error));
        fetchAllPlayers().catch(error => console.error('Error fetching and saving players:', error));
        fetchAllGames().catch(error => console.error('Error fetching and saving games:', error));
        fetchAllPlayerStats().catch(error => console.error('Error fetching and saving player game stats:', error));
        fetchAllShots().catch(error => console.error('Error fetching and saving player shots', error));
    } catch (error) {
        console.error('Error updating database:', error);
    }
};

module.exports = updateDatabase;