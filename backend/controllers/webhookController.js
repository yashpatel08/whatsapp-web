const Message = require('../models/Message');

exports.processWebhookPayload = async (req, res) => {
    try {
        const payload = req.body;
        const entry = payload?.metaData?.entry || [];

        for (const record of entry) {
            for (const change of record.changes) {
                const value = change.value;

                if (value.messages) {
                    for (const msg of value.messages) {
                        const messageData = {
                            from_wa_id: msg.from, // Sender
                            to_wa_id: value.metadata.display_phone_number, // Receiver (your business number)
                            name: value.contacts?.[0]?.profile?.name || 'Unknown',
                            number: msg.from,
                            message: msg.text?.body || '',
                            timestamp: (Number(msg.timestamp) * 1000).toString(), // Convert seconds to ms
                            status: 'received',
                            meta_msg_id: msg.id,
                        };
                        await Message.create(messageData);
                    }
                } else if (value.statuses) {
                    for (const status of value.statuses) {
                        await Message.updateOne(
                            { meta_msg_id: status.id },
                            {
                                $set: {
                                    status: status.status,
                                    timestamp: status.timestamp,
                                }
                            }
                        );
                    }
                }
            }
        }

        res.status(200).json({ message: 'Webhook processed' });
    } catch (err) {
        console.error('Webhook error:', err);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};

