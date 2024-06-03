const fetchTeams = require('./fetch/fetchTeams');

const updataDatabase = async () => {
    try {
        fetchTeams().catch(error => console.error('Error fetching and saving teams:', error));
    } catch (error) {
        console.error('Error updating databse:', error);
    }
};

module.exports = updataDatabase;