const express = require('express');
const updataDatabase = require('./db/dataUpdater');
const teamsRoute = require('./routes/teams');
const cors = require('cors');

const app = express();

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
	origin: 'http://localhost:5173',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
}));

app.use('/api', teamsRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Call updateDatabase when server starts
  //updataDatabase();
});
