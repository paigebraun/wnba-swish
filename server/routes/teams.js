const express = require('express');
const pool = require('../db/db');

const router = express.Router();

// Define the route to get team data
router.get('/teams', async (req, res) => {
    try {
        const result = await pool.query('SELECT name, wins, losses, logo FROM teams');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
