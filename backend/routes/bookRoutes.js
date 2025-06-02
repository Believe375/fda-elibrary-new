const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') cb(null, 'uploads/images');
    else if (file.fieldname === 'file') cb(null, 'uploads/files');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Routes
router.get('/', bookController.getAllBooks);
router.get('/categories', bookController.getCategories);
router.get('/user', verifyToken, bookController.getBooksByUser);
router.post('/', verifyToken, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), bookController.uploadBook);

// Admin-only delete
router.delete('/:id', verifyToken, isAdmin, bookController.deleteBook);

module.exports = router;