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

    const io = req.app.get('io');
    io.emit('new_message', {
      to_wa_id,
      message: newMsg
    });
    console.log("📤 Emitted new_message socket event:", newMsg);
    res.status(201).json(newMsg);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Message not sent' });
  }
};

exports.markAsRead = async (req, res) => {
  const { from_wa_id, to_wa_id } = req.body;

  try {
    console.log("📨 Marking messages as read for:", { from_wa_id, to_wa_id });

    if (!from_wa_id || !to_wa_id) {
      return res.status(400).json({ error: 'Missing from_wa_id or to_wa_id' });
    }

    const toUpdate = await Message.find({
      from_wa_id,      // sender (the other user)
      to_wa_id,        // receiver (me)
      status: { $in: ['sent', 'delivered', 'received'] },
    });

    console.log("📝 Found messages to mark as read:", toUpdate.length);

    if (toUpdate.length === 0) {
      return res.json({ success: true, updated: 0, message: 'No messages to mark as read' });
    }

    const updated = await Message.updateMany(
      {
        from_wa_id,
        to_wa_id,
        status: { $in: ['sent', 'delivered', 'received'] },
      },
      { $set: { status: 'read' } }
    );

    const io = req.app.get('io');
    if (io && updated.modifiedCount > 0) {
      toUpdate.forEach(msg => {
        io.emit('status_updated', {
          meta_msg_id: msg.meta_msg_id,
          status: 'read',
          to_wa_id,
          from_wa_id
        });
        console.log(`📡 Emitted read status for message: ${msg.meta_msg_id}`);
      });
    }

    res.json({
      success: true,
      updated: updated.modifiedCount,
      message: `Marked ${updated.modifiedCount} messages as read`
    });
  } catch (err) {
    console.error("❌ Mark read error:", err);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};

