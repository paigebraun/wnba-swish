const pool = require('../db');
const { getAllTeams } = require('../utilities/teamUtils');

// Define options
const getOptions = (gameId) => {
  return {
      method: 'GET',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
          'Host': 'stats.wnba.com',
          'Referer': `https://stats.wnba.com/game/${gameId}/`
      },
  };
};

const recentGameStatsURL = (gameId) => `https://stats.wnba.com/stats/boxscoretraditionalv2?EndPeriod=10&EndRange=24000&GameID=${gameId}&RangeType=0&Season=2024-25&SeasonType=Regular+Season&StartPeriod=1&StartRange=1200`;

// Function to get all games that are 'Final' in my games table
const fetchFinalGames = async () => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT game_id, home_team_id, away_team_id, date
      FROM games
      WHERE status = 'Final'
      ORDER BY date DESC
    `);
    return rows;
  } finally {
    client.release();
  }
};

// Get recent 5 games for each team (some of these will be repeats)
const selectRecent5GamesPerTeam = async (games) => {
  const teams = await getAllTeams();
  const recentGamesByTeam = {};

  teams.forEach(team => {
    const recentGames = games
      .filter(game => game.home_team_id === team.team_id || game.away_team_id === team.team_id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(game => game.game_id);

    console.log(`Team ${team.team_id} (${team.name}): ${recentGames.length} recent games`);
    recentGamesByTeam[team.team_id] = recentGames;
  });

  console.log('Recent games by team:', recentGamesByTeam);

  return recentGamesByTeam;
};

// Get player stats for specific game
const fetchPlayerStatsForGame = async (gameId) => {
  try {
    const options = getOptions(gameId);
    const url = recentGameStatsURL(gameId);

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const playerStats = data.resultSets[0].rowSet;

    return playerStats;
  } catch (error) {
    console.error('Error fetching player stats for game:', error);
    throw new Error('Failed to fetch player stats for game');
  }
};

// Determine which player stats to get. The game could be recent for home team, away team, or both.
const fetchPlayerStatsForGames = async (gameIds, recentGamesByTeam) => {
  const allStats = [];
  const processedGames = new Set(); // Track processed game IDs
  
  console.log('Fetching player stats for games...');
  const client = await pool.connect();

  try {
    for (const gameId of gameIds) {
      if (processedGames.has(gameId)) {
        console.log(`Game ID ${gameId} already processed. Skipping.`);
        continue;
      }

      console.log('Fetching stats for game:', gameId);
      const gameQuery = await client.query(
        'SELECT * FROM games WHERE game_id = $1',
        [gameId]
      );
      const game = gameQuery.rows[0];
      if (!game) {
        console.warn(`Game ID ${gameId} not found. Skipping player stats for this game.`);
        continue;
      }

      const isRecentForHomeTeam = recentGamesByTeam[game.home_team_id]?.includes(gameId);
      const isRecentForAwayTeam = recentGamesByTeam[game.away_team_id]?.includes(gameId);

      if (isRecentForHomeTeam || isRecentForAwayTeam) {
        const gameStats = await fetchPlayerStatsForGame(gameId);

        // Mark game as processed
        processedGames.add(gameId);
        
        // Filter stats for home team
        if (isRecentForHomeTeam) {
          const homeTeamStats = gameStats.filter(stat => stat[1] === game.home_team_id);
          allStats.push(...homeTeamStats);
        }
        
        // Filter stats for away team
        if (isRecentForAwayTeam) {
          const awayTeamStats = gameStats.filter(stat => stat[1] === game.away_team_id);
          allStats.push(...awayTeamStats);
        }
      } else {
        console.warn(`Game ID ${gameId} is not among the recent 5 games for either team. Skipping player stats for this game.`);
      }
    }
    return allStats;
  } catch (error) {
    console.error('Error fetching player stats for games:', error);
    throw new Error('Failed to fetch player stats for games');
  } finally {
    client.release();
  }
};

// Delete old stats
const deleteAllPlayerStats = async () => {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM player_stats');
    console.log('All player stats deleted successfully');
  } catch (error) {
    console.error('Error deleting all player stats:', error);
    throw new Error('Failed to delete all player stats');
  } finally {
    client.release();
  }
};

// Update player_stats table
const upsertPlayerStats = async (stats) => {
  const client = await pool.connect();
  try {
    await Promise.all(stats.map(async (stat) => {
      const teamExists = await client.query('SELECT 1 FROM teams WHERE team_id = $1', [stat[1]]);
      if (teamExists.rowCount === 0) {
        console.warn(`Team ID ${stat[1]} does not exist. Skipping player stats for this team.`);
        return;
      }

      const insertPlayerStatsQuery = `
        INSERT INTO player_stats (
          game_id, team_id, team_abbreviation, team_city, player_id, player_name, nickname, start_position, comment, min, fgm, fga, fg_pct, fg3m, fg3a, fg3_pct, ftm, fta, ft_pct, oreb, dreb, reb, ast, stl, blk, tos, pf, pts, plus_minus
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
        ) ON CONFLICT (game_id, player_id)
        DO UPDATE SET 
          team_id = EXCLUDED.team_id,
          team_abbreviation = EXCLUDED.team_abbreviation,
          team_city = EXCLUDED.team_city,
          player_name = EXCLUDED.player_name,
          nickname = EXCLUDED.nickname,
          start_position = EXCLUDED.start_position,
          comment = EXCLUDED.comment,
          min = EXCLUDED.min,
          fgm = EXCLUDED.fgm,
          fga = EXCLUDED.fga,
          fg_pct = EXCLUDED.fg_pct,
          fg3m = EXCLUDED.fg3m,
          fg3a = EXCLUDED.fg3a,
          fg3_pct = EXCLUDED.fg3_pct,
          ftm = EXCLUDED.ftm,
          fta = EXCLUDED.fta,
          ft_pct = EXCLUDED.ft_pct,
          oreb = EXCLUDED.oreb,
          dreb = EXCLUDED.dreb,
          reb = EXCLUDED.reb,
          ast = EXCLUDED.ast,
          stl = EXCLUDED.stl,
          blk = EXCLUDED.blk,
          tos = EXCLUDED.tos,
          pf = EXCLUDED.pf,
          pts = EXCLUDED.pts,
          plus_minus = EXCLUDED.plus_minus;
      `;
      await client.query(insertPlayerStatsQuery, [
        stat[0], stat[1], stat[2], stat[3], stat[4], stat[5], stat[6], stat[7], stat[8], stat[9],
        stat[10], stat[11], stat[12], stat[13], stat[14], stat[15], stat[16], stat[17], stat[18], stat[19],
        stat[20], stat[21], stat[22], stat[23], stat[24], stat[25], stat[26], stat[27], stat[28]
      ]);
    }));
  } finally {
    client.release();
  }
};

const fetchAllPlayerStats = async () => {
  try {
    // Fetch all final games
    const finalGames = await fetchFinalGames();

    // Select the most recent 5 games per team
    const recentGamesByTeam = await selectRecent5GamesPerTeam(finalGames);

    // Fetch player stats for these selected games
    const recentGameIdsSet = new Set(Object.values(recentGamesByTeam).flat());
    const recentGameIds = Array.from(recentGameIdsSet);
    const allStats = await fetchPlayerStatsForGames(recentGameIds, recentGamesByTeam);

    // Delete existing player stats
    await deleteAllPlayerStats(recentGameIds);

    // Insert/Update player stats in the database
    await upsertPlayerStats(allStats);

    console.log('Player stats updated successfully');
  } catch (error) {
    console.error('Error updating player stats:', error);
  }
};

module.exports = fetchAllPlayerStats;