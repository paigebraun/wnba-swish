const express = require('express');
const router = express.Router();
const updateDatabase = require('../db/dataUpdater');

// Secret token for authentication
const SECRET_TOKEN = process.env.SECRET_TOKEN;

router.get('/update', async (req, res) => {
    const token = req.query.token;
    if (token !== SECRET_TOKEN) {
        return res.status(403).send('Forbidden');
    }

    try {
        // Start the update process asynchronously
        updateDatabase();

        res.status(200).send('Database update process started');
    } catch (error) {
        console.error('Error starting database update:', error);
        res.status(500).send('Failed to start database update');
    }
});

module.exports = router;