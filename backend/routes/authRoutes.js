const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

//  PUBLIC ROUTES
router.post('/register', authController.register);        // Anyone can register
router.post('/login', authController.login);              // Anyone can login

//  AUTHENTICATED USER ROUTE
router.get('/me', verifyToken, authController.getProfile); // Fetch current user profile

//  ADMIN-ONLY ROUTES
router.get('/all-users', verifyToken, isAdmin, authController.getAllUsers); // View all users (Admin only)

// [Optional] Admin can delete a user (Uncomment when needed)
// router.delete('/delete-user/:id', verifyToken, isAdmin, authController.deleteUser);

module.exports = router;