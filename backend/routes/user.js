const express = require('express');
const router = express.Router();
const { deleteUser, resetPassword } = require('../controllers/userController');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Delete user account
router.delete('/delete', authMiddleware, deleteUser);

// Reset password
router.post('/reset-password', authMiddleware, resetPassword);

// Get current user info
router.get('/user-info', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Assuming `req.user` is set by your auth middleware
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            username: user.username,
            email: user.email // Assuming you have an email field in your User model
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
