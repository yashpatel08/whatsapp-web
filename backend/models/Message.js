const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from_wa_id: String,
    to_wa_id: String,
    name: String,
    number: String,
    message: String,
    timestamp: String,
    status: String,
    meta_msg_id: { type: String, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('processed_messages', messageSchema);
