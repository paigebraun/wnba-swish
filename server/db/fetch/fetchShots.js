const pool = require('../db');

// Define options and set up proxy IP
const getOptions = (playerId) => {
  return {
      method: 'GET',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
          'Host': 'stats.wnba.com',
          'Referer': `https://stats.wnba.com/events/?flag=3&CFID=&CFPARAMS=&PlayerID=${playerId}&TeamID=0&GameID=&ContextMeasure=FGA&Season=2024&SeasonType=Regular%20Season&LeagueID=10&PerMode=PerGame&Split=general&PlusMinus=N&PaceAdjust=N&Rank=N&Outcome=&Location=&Month=0&SeasonSegment=&OpponentTeamID=0&VsConference=&VsDivision=&GameSegment=&Period=0&LastNGames=5&DateFrom=&DateTo=&PORound=0&ShotClockRange=&MeasureType=Base&section=player&sct=plot`
      },
  };
};

// Get recent shots taken by each player during most recent 5 games
const fetchShots = async (playerId) => {
    const shotsURL = `https://stats.wnba.com/stats/shotchartdetail?AheadBehind=&CFID=&CFPARAMS=&ClutchTime=&Conference=&ContextFilter=&ContextMeasure=FGA&DateFrom=&DateTo=&Division=&EndPeriod=10&EndRange=24000&GROUP_ID=&GameEventID=&GameID=&GameSegment=&GroupID=&GroupMode=&GroupQuantity=5&LastNGames=5&LeagueID=10&Location=&Month=0&OnOff=&OpponentTeamID=0&Outcome=&PORound=0&Period=0&PlayerID=${playerId}&PlayerID1=&PlayerID2=&PlayerID3=&PlayerID4=&PlayerID5=&PlayerPosition=&PointDiff=&Position=&RangeType=0&RookieYear=&Season=2024&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StartPeriod=1&StartRange=0&StarterBench=&TeamID=0&VsConference=&VsDivision=&VsPlayerID1=&VsPlayerID2=&VsPlayerID3=&VsPlayerID4=&VsPlayerID5=&VsTeamID=`;
    const options = getOptions(playerId);

    const client = await pool.connect();

    try {
        const response = await fetch(shotsURL, options);
        const data = await response.json();

        const shotChartDetails = data.resultSets[0];
        
        const headers = shotChartDetails.headers;
        
        const playerShots = shotChartDetails.rowSet.map(shot => {
            const gameId = shot[headers.indexOf("GAME_ID")];
            const locX = shot[headers.indexOf("LOC_X")];
            const locY = shot[headers.indexOf("LOC_Y")];
            const shotMade = shot[headers.indexOf("SHOT_MADE_FLAG")];
            return { game_id: gameId, loc_x: locX, loc_y: locY, shot_made: shotMade };
        });

        const deleteQuery = 'DELETE FROM player_shots WHERE player_id = $1';
        await client.query(deleteQuery, [playerId]);

        const insertQuery = `
            INSERT INTO player_shots (player_id, player_name, shots)
            VALUES ($1, $2, $3)
        `;

        const playerName = shotChartDetails.rowSet[0][headers.indexOf("PLAYER_NAME")];
        await client.query(insertQuery, [playerId, playerName, JSON.stringify(playerShots)]);

        console.log('Data inserted/updated successfully');
    } catch (error) {
        console.error('Error inserting/updating data:', error);
    } finally {
        client.release();
    }
};

// Get all players and fetch shot chart details
const fetchAllShots = async () => {
    try {
        const client = await pool.connect();
        const query = 'SELECT player_id FROM players';
        const result = await client.query(query);

        // Extract player IDs from the query result
        const playerIds = result.rows.map(row => row.player_id);

        // Iterate through each player ID and call fetchShots function with a 10-second delay
        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];
            console.log('Fetching shots for:', playerId);
            await fetchShots(playerId);
            
            // Add a 2-second delay before the next iteration
            if (i < playerIds.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds
            }
        }

        console.log('All shots fetched successfully');
    } catch (error) {
        console.error('Error fetching shots:', error);
    }
};

module.exports = fetchAllShots;