const express = require('express');
const app = express();
const gameRoutes = require('./routes/gameApi.js');
const generalRoutes = require('./routes/general.js');
const PORT = process.env.PORT || 3002;

// app.use(bodyParser.json());
// Allow CORS and methods
app.use((req, res, next) => {
  res.setHeader('Access-Controll-Allow-Origin', '*');
  res.setHeader('Access-Controll-Allow-Methods', 'GET, POST');
  next();
});
app.use('/api/games', gameRoutes);
app.use(generalRoutes);

app.listen(PORT, () =>
  console.log(`Rock, paper, scissor API game is running on ${PORT}. `)
);
