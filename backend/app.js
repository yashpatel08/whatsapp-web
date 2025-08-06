const express = require('express');
const cors = require('cors');
const webhookRoutes = require('./routes/webhookRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use('/api/webhook', webhookRoutes);
app.use('/api/messages', messageRoutes);
app.get('/', (req, res) => {
    res.send('API is working');
});
module.exports = app;
