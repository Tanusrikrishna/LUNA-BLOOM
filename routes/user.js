// backend/routes/user.js

const express = require('express');
const router = express.Router();
const { userSignUp, userLogin, getUser, editUser } = require('../controllers/user.js');
const { protect } = require('../middleware/auth.js'); // Import the middleware

// Public routes
router.post('/signUp', userSignUp);
router.post('/login', userLogin);

// ✨ FIX: These routes are now protected. Only logged-in users can access them.
router.get('/user/:id', protect, getUser);
router.put('/user/:id', protect, editUser);

module.exports = router;