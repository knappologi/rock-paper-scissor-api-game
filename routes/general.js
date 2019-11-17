const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello, world! GET /api/games/help for more info :)' });
});

// if nothing is found
router.use((req, res) => {
  res.status(404).json({ error: '404. Nothing here!' });
});

module.exports = router;
