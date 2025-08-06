const express = require('express');
const router = express.Router();
const { processWebhookPayload } = require('../controllers/webhookController');

router.post('/', processWebhookPayload);

module.exports = router;