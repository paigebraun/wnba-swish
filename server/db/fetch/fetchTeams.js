const pool = require('../db');

const teamsURL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams';

// Function to fetch team details
async function fetchTeamDetails(teamId) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams/${teamId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

// Function to fetch and save team data
async function fetchTeams() {
  try {
    const response = await fetch(teamsURL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Iterate through teams and insert relevant data into the teams table
      const sports = data.sports;
      for (const sport of sports) {
        const leagues = sport.leagues;
        for (const league of leagues) {
          const teams = league.teams;
          for (const teamInfo of teams) {
            const team = teamInfo.team;
            const teamId = team.id;

            // Fetch additional team details
            const teamDetails = await fetchTeamDetails(teamId);
            const wins = teamDetails.team.record.items[0].stats.find(stat => stat.name === 'wins').value;
            const losses = teamDetails.team.record.items[0].stats.find(stat => stat.name === 'losses').value;

            const name = team.displayName;
            const abbreviation = team.abbreviation;
            const logo = team.logos[0].href;

            const insertTeamQuery = `
              INSERT INTO teams (espn_id, name, abbreviation, wins, losses, logo)
              VALUES ($1, $2, $3, $4, $5, $6)
              ON CONFLICT (espn_id)
              DO UPDATE SET name = EXCLUDED.name, abbreviation = EXCLUDED.abbreviation, logo = EXCLUDED.logo, wins = EXCLUDED.wins, losses = EXCLUDED.losses
            `;
            await client.query(insertTeamQuery, [teamId, name, abbreviation, wins, losses, logo]);
          }
        }
      }

      // Commit the transaction
      await client.query('COMMIT');
      console.log('Teams saved successfully');
    } catch (error) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK');
      console.error('Error saving teams:', error);
      throw error;
    } finally {

      client.release();
    }
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
}

module.exports = fetchTeams;