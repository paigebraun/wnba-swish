const express = require('express');
const pool = require('../db/db');

const router = express.Router();

router.get('/stats/:playerId', async (req, res) => {
    const playerId = req.params.playerId;
    
    try {
        const query = `
            SELECT 
                ps.game_id, 
                ps.team_id,
                ps.min, 
                ps.fgm, 
                ps.fga, 
                ps.fg_pct, 
                ps.fg3m, 
                ps.fg3a, 
                ps.fg3_pct, 
                ps.ftm, 
                ps.fta, 
                ps.ft_pct, 
                ps.oreb, 
                ps.dreb, 
                ps.reb, 
                ps.ast, 
                ps.stl, 
                ps.blk, 
                ps.tos, 
                ps.pf, 
                ps.pts, 
                ps.plus_minus,
                g.date, 
                g.home_team_abbr, 
                g.away_team_abbr, 
                g.home_team_id,
                g.home_score, 
                g.away_score
            FROM 
                player_stats ps
            JOIN 
                games g 
            ON 
                ps.game_id = g.game_id
            WHERE 
                ps.player_id = $1
        `;

        const statsResult = await pool.query(query, [playerId]);
        res.json(statsResult.rows);
    } catch (error) {
        console.error('Error fetching player stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;