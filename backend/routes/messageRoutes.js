const express = require('express');
const router = express.Router();
const { getAllConversations, sendMessage } = require('../controllers/messageController');

router.get('/', getAllConversations);
router.post('/', sendMessage);

module.exports = router;
