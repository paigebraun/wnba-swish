const pool = require('../db');

// Utility function to update teamIds in my teams table. This is because we're getting info
// from both WNBA and ESPN and need consistency across the teamIds
const updateTeamIds = async () => {
    try {
      const client = await pool.connect();
  
      const queryText = `
        UPDATE teams AS t
        SET team_id = ts.team_id
        FROM team_stats AS ts
        WHERE t.espn_id = ts.espn_id;
      `;
      await client.query(queryText);
  
      client.release();
  
      console.log('Team IDs updated successfully');
    } catch (error) {
      console.error('Error updating team IDs:', error);
    }
  };
  
  module.exports = { updateTeamIds };