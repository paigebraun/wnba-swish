const axios = require('axios');
const pool = require('../db');
require('dotenv');

const options = {
  method: 'GET',
  url: 'https://wnba-api.p.rapidapi.com/wnbastandings',
  params: {year: '2024'},
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'wnba-api.p.rapidapi.com'
  }
};

// Define a function to fetch and save team data
async function fetchTeams() {
  try {
    const response = await axios.request(options);

    const entries = response.data.standings.entries;

    // Connect to the database
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Iterate through teams and insert relevant data into the teams table
      for (const entry of entries) {
        const team = entry.team;
        const stats = entry.stats;

        const name = team.name;
        const id = team.id;
        const wins = stats.find(stat => stat.name === 'wins')?.value || 0;
        const losses = stats.find(stat => stat.name === 'losses')?.value || 0;
        const abbreviation = team.abbreviation;
        const logo = team.logos[0].href;

        const insertTeamQuery = `
          INSERT INTO teams (id, name, abbreviation, wins, losses, logo)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id)
          DO UPDATE SET name = EXCLUDED.name, abbreviation = EXCLUDED.abbreviation, logo = EXCLUDED.logo, wins = EXCLUDED.wins, losses = EXCLUDED.losses`
        ;
        await client.query(insertTeamQuery, [id, name, abbreviation, wins, losses, logo]);
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
      // Release the database connection
      client.release();
    }
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
}

module.exports = fetchTeams;