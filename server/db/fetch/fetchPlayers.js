const pool = require('../db');
const { getAllTeams } = require('../utilities/teamUtils');

// Get all players for 2024 WNBA (by team name)
const fetchPlayers = async (espnId, teamName) => {
    const playersURL = `https://data.wnba.com/data/5s/v2015/json/mobile_teams/wnba/2024/teams/${teamName.toLowerCase()}_roster.json`;

    try {
        const response = await fetch(playersURL);
        const data = await response.json();
        const players = data.t.pl;
        const team_id = data.t.tid;

        const client = await pool.connect();
        await Promise.all(players.map(async (player) => {
            const first_name = player.fn;
            const last_name = player.ln;
            const pos = player.pos;
            const number = player.num;
            const exp = player.y;
            const hcc = player.hcc;
            const height = player.ht;
            const weight = player.wt;
            const dob = player.dob;
            const player_id = player.pid;

            const insertPlayerQuery = `
                INSERT INTO players (espn_id, team_id, first_name, last_name, pos, number, exp, hcc, height, weight, dob, player_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                ON CONFLICT (espn_id, first_name, last_name)
                DO UPDATE SET pos = EXCLUDED.pos, team_id = EXCLUDED.team_id, number = EXCLUDED.number, exp = EXCLUDED.exp, hcc = EXCLUDED.hcc, height = EXCLUDED.height, weight = EXCLUDED.weight, dob = EXCLUDED.dob, player_id = EXCLUDED.player_id
            `;
            await client.query(insertPlayerQuery, [espnId, team_id, first_name, last_name, pos, number, exp, hcc, height, weight, dob, player_id]);
        }));
        client.release();

        //console.log(`Players for team ID ${espnId} inserted into players table`);
    } catch (error) {
        console.error(`Error fetching and inserting players for team ID ${espnId}:`, error);
        throw error;
    }
};

// Get all teams and then fetch players by team
const fetchAllPlayers = async () => {
    try {
        const teams = await getAllTeams();
        for (const team of teams) {
            await fetchPlayers(team.id, team.name);
        }
        //console.log('All players fetched successfully');
    } catch (error) {
        console.error('Error fetching players:', error);
    }
};

module.exports = fetchAllPlayers;