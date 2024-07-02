const express = require('express');
const pool = require('../db/db');

const router = express.Router();

// Define the route to get team schedule
router.get('/:teamId/schedule', async (req, res) => {
    const teamId = req.params.teamId;
    
    try {
        const query = `
            SELECT 
                date, 
                home_team_name,
                home_team_id,
                home_team_city, 
                away_team_name, 
                away_team_city, 
                status, 
                home_score, 
                away_score, 
                arena, 
                arena_city, 
                arena_state 
            FROM games 
            WHERE home_team_id = $1 OR away_team_id = $1
        `;
        const result = await pool.query(query, [teamId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/schedule', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM games');
        res.json(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
});

module.exports = router;