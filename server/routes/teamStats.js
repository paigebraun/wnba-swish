const express = require('express');
const pool = require('../db/db');

const router = express.Router();

// Endpoint to fetch team stats by teamId
router.get('/team-stats/:teamId', async (req, res) => {
    const teamId = req.params.teamId;
    
    try {
        // Your database query logic
        const statsResult = await pool.query('SELECT stat_type, stat_abbr, value FROM team_stats WHERE team_id = $1', [teamId]);
        res.json(statsResult.rows);
    } catch (error) {
        console.error('Error fetching team stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;