// process_payloads.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Message = require('./models/Message');

const PAYLOAD_DIR = './payloads';

mongoose.connect('mongodb://localhost:27017/whatsapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("✅ Connected to MongoDB");
        processAllPayloads();
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
    });

async function processAllPayloads() {
    const files = fs.readdirSync(PAYLOAD_DIR).filter(f => f.endsWith('.json'));

    for (const file of files) {
        console.log(`\n📄 Processing: ${file}`);
        const filePath = path.join(PAYLOAD_DIR, file);
        const raw = fs.readFileSync(filePath, 'utf-8');
        let payload;
        try {
            payload = JSON.parse(raw);
        } catch (err) {
            console.error("❌ Invalid JSON:", err.message);
            continue;
        }

        const entry = payload?.metaData?.entry || [];

        for (const e of entry) {
            for (const change of e.changes || []) {
                const value = change.value;

                if (value?.messages) {
                    for (const msg of value.messages) {
                        const messageId = msg?.id;

                        if (!messageId) {
                            console.warn('⚠️ Skipping message with missing ID');
                            continue;
                        }

                        const exists = await Message.findOne({ message_id: messageId });

                        if (!exists) {
                            const newMsg = new Message({
                                message_id: messageId,
                                from: msg.from,
                                to: value.metadata?.display_phone_number || 'unknown',
                                wa_id: value.contacts?.[0]?.wa_id || msg.from,
                                text: msg.text?.body || '',
                                timestamp: msg.timestamp || Date.now().toString(),
                                status: 'sent',
                            });

                            try {
                                await newMsg.save();
                                console.log('💬 Inserted message:', newMsg.message_id);
                            } catch (err) {
                                console.error('❌ Insert error:', err.message);
                            }
                        } else {
                            console.log('⏭️ Skipping duplicate message:', messageId);
                        }
                    }
                }

                if (value?.statuses) {
                    for (const statusObj of value.statuses) {
                        const statusMessageId = statusObj?.id;

                        if (!statusMessageId) {
                            console.warn('⚠️ Skipping status update with missing ID');
                            continue;
                        }

                        const updated = await Message.findOneAndUpdate(
                            { message_id: statusMessageId },
                            { $set: { status: statusObj.status } },
                            { new: true }
                        );

                        if (updated) {
                            console.log(`✅ Updated ${statusMessageId} to '${statusObj.status}'`);
                        } else {
                            console.log(`⚠️ Status update skipped: No message found with id ${statusMessageId}`);
                        }
                    }
                }
            }
        }
    }

    console.log("\n🎉 Finished processing all payloads.");
    mongoose.disconnect();
}
