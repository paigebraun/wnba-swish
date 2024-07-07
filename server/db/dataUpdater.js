const fetchTeams = require('./fetch/fetchTeams');
const fetchAllTeamStats = require('./fetch/fetchTeamStats');
const fetchAllPlayers = require('./fetch/fetchPlayers');
const fetchAllGames = require('./fetch/fetchGames');
const fetchAllPlayerStats = require('./fetch/fetchPlayerStats');
const fetchAllShots = require('./fetch/fetchShots');

// Update SQL tables
const updateDatabase = async () => {
    try {
        await fetchTeams().catch(error => console.error('Error fetching and saving teams:', error));
        await fetchAllTeamStats().catch(error => console.error('Error fetching and saving team stats:', error));
        await fetchAllPlayers().catch(error => console.error('Error fetching and saving players:', error));
        await fetchAllGames().catch(error => console.error('Error fetching and saving games:', error));
        await fetchAllPlayerStats().catch(error => console.error('Error fetching and saving player game stats:', error));
        await fetchAllShots().catch(error => console.error('Error fetching and saving player shots', error));

        console.log('Database updated successfully');
    } catch (error) {
        console.error('Error updating database:', error);
        throw error;
    }
};

module.exports = updateDatabase;