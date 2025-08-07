const express = require('express');
const router = express.Router();
const { getAllConversations, sendMessage,markAsRead } = require('../controllers/messageController');

router.get('/', getAllConversations);
router.post('/', sendMessage);
router.post('/mark-read', markAsRead);

module.exports = router;
