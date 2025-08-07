import React, { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import SendBox from './SendBox';
import { Search, MoreVertical, Phone, Video } from 'lucide-react';

function ChatWindow({ userId, messages, myWaId }) {
    const isNewChat = messages.length === 0;
    const [customName, setCustomName] = useState('');
    const [editingName, setEditingName] = useState(isNewChat);

    useEffect(() => {
        if (messages.length > 0) {
            const existingName = messages[0]?.name;
            if (existingName && existingName !== 'Unknown') {
                setCustomName(existingName);
                setEditingName(false);
            } else {
                setCustomName('');
                setEditingName(true); // if no name, prompt edit
            }
        } else {
            setCustomName('');
            setEditingName(true); // new chat
        }
    }, [userId]);

    if (!userId) {
        return (
            <div className="w-[70%] flex flex-col items-center justify-center bg-[#0b141a] text-[#8696a0]">
                <div className="text-center">
                    <h1 className="text-[32px] font-light text-[#e9edef] mb-4">WhatsApp Web</h1>
                    <p className="text-[14px] text-[#8696a0] max-w-md">
                        Send and receive messages without keeping your phone online.
                        Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
                    </p>
                </div>
            </div>
        );
    }

    const userName =
        editingName || !messages[0]?.name || messages[0]?.name === 'Unknown'
            ? customName
            : messages[0]?.name;

    const handleNameSave = () => {
        if (customName.trim()) {
            setEditingName(false);
        }
    };

    const user = {
        number: userId,
        wa_id: userId,
        name: userName || 'Unknown',
    };

    return (
        <div className="w-[70%] flex flex-col bg-[#0b141a]">
            {/* Header */}
            <div className="h-[59px] bg-[#202c33] px-4 flex items-center justify-between border-b border-[#313d45]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6b7c85] flex items-center justify-center">
                        <span className="text-[#e9edef] text-sm font-medium">
                            {(userName || 'U')[0]}
                        </span>
                    </div>
                    <div>
                        {editingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={customName}
                                    onChange={e => setCustomName(e.target.value)}
                                    placeholder="Enter name"
                                    className="bg-[#2a3942] text-white px-2 py-1 rounded text-sm"
                                />
                                <button
                                    onClick={handleNameSave}
                                    className="text-[#00a884] text-sm font-medium"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3
                                    onClick={() => {
                                        setEditingName(true);
                                    }}
                                    className="font-medium text-[#e9edef] text-[16px] cursor-pointer"
                                >
                                    {userName || 'Unknown'}
                                </h3>
                                <p className="text-[13px] text-[#8696a0]">
                                    last seen today at{' '}
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full hover:bg-[#374045] flex items-center justify-center">
                        <Video className="w-5 h-5 text-[#aebac1]" />
                    </button>
                    <button className="w-10 h-10 rounded-full hover:bg-[#374045] flex items-center justify-center">
                        <Phone className="w-5 h-5 text-[#aebac1]" />
                    </button>
                    <button className="w-10 h-10 rounded-full hover:bg-[#374045] flex items-center justify-center">
                        <Search className="w-5 h-5 text-[#aebac1]" />
                    </button>
                    <button className="w-10 h-10 rounded-full hover:bg-[#374045] flex items-center justify-center">
                        <MoreVertical className="w-5 h-5 text-[#aebac1]" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 px-4 py-4 overflow-y-auto bg-[#0b141a]">
                <div className="space-y-2">
                    {messages.map(msg => (
                        <MessageBubble key={msg._id} msg={msg} myWaId={myWaId} />
                    ))}
                </div>
            </div>

            {/* Send Box */}
            <SendBox user={user} myWaId={myWaId} />
        </div>
    );
}

export default ChatWindow;
