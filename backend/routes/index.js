const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const bookRoutes = require('./bookRoutes');

// Route mounting
router.use('/api/users', userRoutes);
router.use('/api/books', bookRoutes);

module.exports = router;