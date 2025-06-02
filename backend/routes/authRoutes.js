const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', verifyToken, authController.getProfile);

// Admin-only routes
router.get('/all-users', verifyToken, isAdmin, authController.getAllUsers);

module.exports = router;