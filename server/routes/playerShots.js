const express = require('express');
const pool = require('../db/db');
const router = express.Router();

router.get('/player/:playerId/shots', async (req, res) => {
    const playerId = req.params.playerId;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT shots FROM player_shots WHERE player_id = $1', [playerId]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json(result.rows[0].shots);
    } catch (error) {
        console.error('Error fetching player shots:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;