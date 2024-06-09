const pool = require('../db');

// Utility function to get all teams from my teams table
const getAllTeams = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT espn_id, name, team_id FROM teams');
        client.release();
        return result.rows.map(row => ({ id: row.espn_id, name: row.name, team_id: row.team_id }));
    } catch (error) {
        console.error('Error fetching teams from database:', error);
        throw error;
    }
};

module.exports = {
    getAllTeams
};