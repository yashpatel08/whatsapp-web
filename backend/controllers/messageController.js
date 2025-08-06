const Message = require('../models/Message');

exports.getAllConversations = async (req, res) => {
  try {
    const myWaId = req.query.myWaId; // e.g. '919876543210'
    const messages = await Message.find();
    const grouped = {};

    messages.forEach(msg => {
      const chatPartner =
        msg.from_wa_id === myWaId ? msg.to_wa_id : msg.from_wa_id;

      if (!grouped[chatPartner]) grouped[chatPartner] = [];
      grouped[chatPartner].push(msg);
    });

    res.json(grouped);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Could not fetch messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { from_wa_id, to_wa_id, name, number, message } = req.body;

    const newMsg = await Message.create({
      from_wa_id,
      to_wa_id,
      name,
      number,
      message,
      timestamp: Date.now().toString(),
      status: 'sent',
      meta_msg_id: `demo-${Date.now()}`
    });

    res.status(201).json(newMsg);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Message not sent' });
  }
};
