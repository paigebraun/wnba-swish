const express = require('express');
const updataDatabase = require('./db/dataUpdater');

const app = express();

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Call updateDatabase when server starts
  updataDatabase();
});
