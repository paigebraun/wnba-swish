const pool = require('../db');
const { getAllTeams } = require('../utilities/teamUtils');
const { updateTeamIds } = require('../utilities/updateTeamIds');

// Get team stats (by team name)
const fetchTeamStats = async (espnId, teamName) => {
    const teamStatsURL = `https://data.wnba.com/data/5s/v2015/json/mobile_teams/wnba/2024/teams/statistics/${teamName.toLowerCase()}/teamstats_02.json`;

    try {
        const response = await fetch(teamStatsURL);
        const teamStats = await response.json();

        const statsArray = [
            { stat_type: 'Games Played', stat_abbr: 'GP', value: teamStats.sta.gp },
            { stat_type: 'Points per Game', stat_abbr: 'PPG', value: teamStats.sta.pts.val },
            { stat_type: 'Rebounds per Game', stat_abbr: 'RPG', value: teamStats.sta.reb.val },
            { stat_type: 'Assist per Game', stat_abbr: 'APG', value: teamStats.sta.ast.val },
            { stat_type: 'Steals per Game', stat_abbr: 'SPG', value: teamStats.sta.stl.val },
            { stat_type: 'Blocks per Game', stat_abbr: 'BPG', value: teamStats.sta.blk.val },
            { stat_type: 'Field Goal Percentage', stat_abbr: 'FG%', value: teamStats.sta.fgp.val * 100 },
            { stat_type: '3-Point Field Goal Percentage', stat_abbr: '3P%', value: teamStats.sta.tpp.val * 100 },
            { stat_type: 'Free Throw Percentage', stat_abbr: 'FT%', value: teamStats.sta.ftp.val * 100 },
            { stat_type: 'Turnovers', stat_abbr: 'TO', value: teamStats.sta.tov.val },
            { stat_type: 'Personal Fouls', stat_abbr: 'PF', value: teamStats.sta.pf.val }
        ];

        const team_id = teamStats.sta.tid;
        console.log('team_id', team_id);

        const client = await pool.connect();

        await Promise.all(statsArray.map(async (stat) => {
            await client.query(
                `INSERT INTO team_stats (espn_id, team_id, stat_type, stat_abbr, value)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (espn_id, stat_type) 
                 DO UPDATE SET value = EXCLUDED.value`,
                [espnId, team_id, stat.stat_type, stat.stat_abbr, stat.value]
            );
        }));

        client.release();
   
        console.log(`Team statistics for team ID ${team_id} inserted into team_stats table`);

        await updateTeamIds();

    } catch (error) {
        console.error(`Error fetching and inserting team statistics.`, error);
        throw error;
    }
};

// Get teams and then fetch their current overall stats
const fetchAllTeamStats = async () => {
    try {
        const teams = await getAllTeams();
        for (const team of teams) {
            await fetchTeamStats(team.id, team.name);
        }
        console.log('All team statistics fetched successfully');
    } catch (error) {
        console.error('Error fetching team statistics:', error);
    }
};

module.exports = fetchAllTeamStats;