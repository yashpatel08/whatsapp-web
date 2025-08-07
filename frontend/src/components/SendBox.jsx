import { useState } from 'react';
import { Smile, Paperclip, Mic, Send } from 'lucide-react';

function SendBox({ user, myWaId, refreshMessages }) {
    const [text, setText] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!text.trim()) return;
        if (!user.number) return;
        if (isSending) return; // Prevent double sends

        if (!/^[0-9]+$/.test(user.number)) {
            console.error('❌ Invalid number format:', user.number);
            return;
        }

        setIsSending(true);

        try {
            console.log('📤 Sending message:', {
                from_wa_id: myWaId,
                to_wa_id: user.number,
                message: text.trim()
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from_wa_id: myWaId,
                    to_wa_id: user.number,
                    name: user.name || 'Unknown',
                    number: user.number,
                    message: text.trim(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP ${response.status}: ${errorData.error || 'Unknown error'}`);
            }

            const data = await response.json();
            console.log("✅ Message sent successfully:", {
                meta_msg_id: data.meta_msg_id,
                status: data.status,
                message: data.message.substring(0, 50) + '...'
            });

            setText('');

            // Manual refresh for serverless deployments where sockets might not be persistent
            refreshMessages();

        } catch (error) {
            console.error('❌ Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="px-4 py-3 bg-[#202c33]">
            <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full hover:bg-[#374045] flex items-center justify-center">
                    <Smile className="w-6 h-6 text-[#aebac1]" />
                </button>
                <button className="w-10 h-10 rounded-full hover:bg-[#374045] flex items-center justify-center">
                    <Paperclip className="w-6 h-6 text-[#aebac1]" />
                </button>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder={isSending ? "Sending..." : "Type a message"}
                        className="w-full px-4 py-2 bg-[#2a3942] rounded-lg text-[15px] text-[#e9edef] placeholder-[#8696a0] focus:outline-none border border-transparent focus:border-[#00a884] disabled:opacity-50"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isSending}
                    />
                </div>
                {text.trim() ? (
                    <button
                        onClick={handleSend}
                        disabled={isSending}
                        className="w-10 h-10 rounded-full hover:bg-[#374045] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className={`w-5 h-5 ${isSending ? 'text-[#8696a0]' : 'text-[#00a884]'}`} />
                    </button>
                ) : (
                    <button className="w-10 h-10 rounded-full hover:bg-[#374045] flex items-center justify-center">
                        <Mic className="w-6 h-6 text-[#aebac1]" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default SendBox;