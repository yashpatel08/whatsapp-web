const Message = require('../models/Message');

exports.processWebhookPayload = async (req, res) => {
    try {
        const payload = req.body;
        const entry = payload?.metaData?.entry || [];

        for (const record of entry) {
            for (const change of record.changes) {
                const value = change.value;
                const display_phone_number = value?.metadata?.display_phone_number;

                if (value.messages) {
                    for (const msg of value.messages) {
                        const messageData = {
                            from_wa_id: msg.from,
                            to_wa_id: display_phone_number,
                            name: value.contacts?.[0]?.profile?.name || 'Unknown',
                            number: msg.from,
                            message: msg.text?.body || '',
                            timestamp: (Number(msg.timestamp) * 1000).toString(),
                            status: 'received',
                            meta_msg_id: msg.id,
                        };

                        const exists = await Message.findOne({ meta_msg_id: msg.id });
                        if (exists) {
                            console.log('⏭️ Duplicate incoming message:', msg.id);
                            continue;
                        }

                        console.log("📥 Saving incoming message:", messageData);
                        await Message.create(messageData);
                    }
                }

                if (value.statuses) {
                    for (const status of value.statuses) {
                        console.log("🔄 Status update received:", status);

                        const updated = await Message.findOneAndUpdate(
                            {
                                meta_msg_id: status.id,
                                from_wa_id: display_phone_number
                            },
                            {
                                $set: {
                                    status: status.status,
                                    timestamp: (Number(status.timestamp) * 1000).toString(),
                                },
                            },
                            { new: true }
                        );

                        if (updated) {
                            console.log(`✅ Updated ${status.id} to '${status.status}'`);
                            const io = req.app.get('io');
                            if (io) {
                                io.emit('status_updated', {
                                    meta_msg_id: status.id,
                                    status: status.status,
                                    to_wa_id: updated.to_wa_id
                                });
                            }
                        } else {
                            console.warn(`⚠️ Status not applied: no message with ID ${status.id} and from_wa_id ${display_phone_number}`);
                        }
                    }
                }
            }
        }

        res.status(200).json({ message: 'Webhook processed' });
    } catch (err) {
        console.error('❌ Webhook error:', err);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};
