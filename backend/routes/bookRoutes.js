const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  uploadBook,
  deleteBook,
} = require('../controllers/bookController');
const { requireAuth } = require('../middleware/authMiddleware');

// Public route: get all books
router.get('/', getAllBooks);

// Admin-only routes
router.post('/upload', requireAuth, uploadBook);
router.delete('/:id', requireAuth, deleteBook);

module.exports = router;