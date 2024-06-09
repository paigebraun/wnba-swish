const pool = require('../db');
const { getAllTeams } = require('../utilities/teamUtils');

// Get all games for the 2024 WNBA Regular season (by team)
const fetchGames = async (teamId, teamName) => {
    const gamesURL = `https://data.wnba.com/data/5s/v2015/json/mobile_teams/wnba/2024/teams/${teamName.toLowerCase()}_schedule.json`;

    try {
        const response = await fetch(gamesURL);
        const data = await response.json();
        const games = data.gscd.g;

        const client = await pool.connect();
        await Promise.all(games.map(async (game) => {
            const game_id = game.gid;
            const date = game.gdte;
            const home_team_id = game.h.tid;
            const home_team_name = game.h.tn;
            const home_team_city = game.h.tc;
            const home_team_abbr = game.h.ta;
            const away_team_id = game.v.tid;
            const away_team_name = game.v.tn;
            const away_team_city = game.v.tc;
            const away_team_abbr = game.v.ta;
            const status = game.stt;
            const home_score = game.h.s;
            const away_score = game.v.s;
            const arena = game.an;
            const arena_city = game.ac;
            const arena_state = game.as;

            const insertGameQuery = `
                INSERT INTO games (game_id, date, home_team_id, home_team_name, home_team_city, home_team_abbr, away_team_id, away_team_name, away_team_city, away_team_abbr, status, home_score, away_score, arena, arena_city, arena_state)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                ON CONFLICT (game_id)
                DO UPDATE SET 
                    date = EXCLUDED.date,
                    home_team_id = EXCLUDED.home_team_id,
                    home_team_name = EXCLUDED.home_team_name,
                    home_team_city = EXCLUDED.home_team_city,
                    home_team_abbr = EXCLUDED.home_team_abbr,
                    away_team_id = EXCLUDED.away_team_id,
                    away_team_name = EXCLUDED.away_team_name,
                    away_team_city = EXCLUDED.away_team_city,
                    away_team_abbr = EXCLUDED.away_team_abbr,
                    status = EXCLUDED.status,
                    home_score = EXCLUDED.home_score,
                    away_score = EXCLUDED.away_score,
                    arena = EXCLUDED.arena,
                    arena_city = EXCLUDED.arena_city,
                    arena_state = EXCLUDED.arena_state;
            `;
            await client.query(insertGameQuery, [game_id, date, home_team_id, home_team_name, home_team_city, home_team_abbr, away_team_id, away_team_name, away_team_city, away_team_abbr, status, home_score, away_score, arena, arena_city, arena_state]);
        }));
        client.release();

        console.log(`Games for team ID ${teamId} inserted into games table`);
    } catch (error) {
        console.error(`Error fetching and inserting games for team ID ${teamId}:`, error);
        throw error;
    }
};

// Get all teams and then fetch games for each team
const fetchAllGames = async () => {
    try {
        const teams = await getAllTeams();
        for (const team of teams) {
            await fetchGames(team.id, team.name);
        }
        console.log('All games fetched successfully');
    } catch (error) {
        console.error('Error fetching games:', error);
    }
};

module.exports = fetchAllGames;