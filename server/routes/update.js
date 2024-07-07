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
        await updateDatabase();
        res.status(200).send('Database updated successfully');
    } catch (error) {
        console.error('Error updating database:', error);
        res.status(500).send('Failed to update database');
    }
});

module.exports = router;