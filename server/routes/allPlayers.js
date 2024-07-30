const express = require('express');
const pool = require('../db/db');

const router = express.Router();

// Get all players for search results
router.get('/allplayers', async (req, res) => {
  try {
    const query = `
      SELECT p.player_id, p.first_name, p.last_name, p.dob, p.height, p.weight, p.pos, p.hcc, p.exp, p.number, p.team_id, t.logo AS team_logo
      FROM players p
      JOIN teams t ON p.team_id = t.team_id
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;