import React, { useState } from 'react';
import { Search, MoreVertical, Phone, Video, Smile, Paperclip, Mic, Send } from 'lucide-react';

function SendBox({ user, myWaId }) {
    const [text, setText] = useState('');

    const handleSend = async () => {
        if (!text.trim()) return;
        if (!user.number) return;

        if (!/^[0-9]+$/.test(user.number)) return;

        const messages = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from_wa_id: myWaId,
                to_wa_id: user.number,
                name: user.name,
                number: user.number,
                message: text,
                timestamp: Date.now().toString(),
                status: 'sent'
            }),
        });
        const mess = await messages.json();
        console.log("messages", mess);
        setText('');
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
                        placeholder="Type a message"
                        className="w-full px-4 py-2 bg-[#2a3942] rounded-lg text-[15px] text-[#e9edef] placeholder-[#8696a0] focus:outline-none border border-transparent focus:border-[#00a884]"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>
                {text.trim() ? (
                    <button
                        onClick={handleSend}
                        className="w-10 h-10 rounded-full hover:bg-[#374045] flex items-center justify-center"
                    >
                        <Send className="w-5 h-5 text-[#00a884]" />
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
