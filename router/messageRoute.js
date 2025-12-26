const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { sendMessage, getMessages,getLatestMessage } = require('../controller/messageController');

// GET messages between current user and a specific user (using query parameter)
router.get('/', protect, getMessages);

// Send a new message
router.post('/send', protect, sendMessage);

router.get('/student/latest-message', protect, getLatestMessage);

// router.get('/conversation/:userId1/:userId2', protect, getConversation);

module.exports = router;