const express = require('express');
const updataDatabase = require('./db/dataUpdater');
const teamsRoute = require('./routes/teams');
const teamStatsRoute = require('./routes/teamStats');
const playerRoute = require('./routes/players');
const gamesRoute = require('./routes/games');
const playerStatsRoute = require('./routes/playerStats');
const playerShotsRoute = require('./routes/playerShots');
const cors = require('cors');

const app = express();

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
	origin: 'https://wnba-swish.vercel.app',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
}));

app.use('/api', teamsRoute);
app.use('/api', teamStatsRoute);
app.use('/api', playerRoute);
app.use('/api', gamesRoute);
app.use('/api', playerStatsRoute);
app.use('/api', playerShotsRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Call updateDatabase when server starts
  // updataDatabase();
});
