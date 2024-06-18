const express = require('express');
const pool = require('../db/db');

const router = express.Router();

// Define the route to get team data
router.get('/:teamId/players', async (req, res) => {
    const teamId = req.params.teamId;
    
    try {
        const result = await pool.query('SELECT first_name, last_name, pos, number, exp, hcc FROM players WHERE team_id = $1', [teamId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;