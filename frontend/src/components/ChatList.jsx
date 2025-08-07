import { useState } from 'react';
import { Search, MoreVertical } from 'lucide-react';

function ChatList({ conversations, onSelect, selectedUser, onNewNumberChange, newNumber }) {
    const [showUserInfo, setShowUserInfo] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem('whatsapp_user') || '{}');
    const handleEnterKey = (e) => {
        if (e.key === 'Enter' && newNumber.trim()) {
            onSelect(newNumber.trim());
        }
    };

    return (
        <div className="w-[30%] bg-[#111b21] border-r border-[#313d45] flex flex-col">
            <div className="h-[59px] bg-[#202c33] px-4 flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-[#6b7c85] flex items-center justify-center">
                    <span className="text-[#e9edef] text-sm font-medium">ME</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full hover:bg-[#374045] flex items-center justify-center"
                        onClick={() => setShowUserInfo(prev => !prev)}
                    >
                        <MoreVertical className="w-5 h-5 text-[#aebac1]" />
                    </button>
                </div>
            </div>

            {showUserInfo && (
                <div className="px-4 py-2 text-white text-sm bg-[#2a3942] shadow-md border-b border-[#313d45]">
                    <span>
                        Logged in as: <strong>{userInfo.name || 'Unknown'}</strong> ({userInfo.wa_id || 'N/A'})
                    </span>
                    <button
                        onClick={() => {
                            localStorage.removeItem('whatsapp_user');
                            window.location.reload();
                        }}
                        className="ml-3 text-red-400 hover:text-red-300"
                    >
                        Logout
                    </button>
                </div>
            )}

            <div className="p-3 bg-[#111b21]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8696a0]" />
                    <input
                        type="text"
                        placeholder="Enter number to start chat"
                        value={newNumber}
                        onChange={(e) => onNewNumberChange(e.target.value)}
                        onKeyDown={handleEnterKey}
                        className="w-full pl-10 pr-4 py-2 bg-[#202c33] rounded-lg text-sm text-[#e9edef] placeholder-[#8696a0] focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#111b21]">
                {Object.keys(conversations).map(wa_id => {
                    const lastMessage = conversations[wa_id][conversations[wa_id].length - 1];
                    const time = new Date(Number(lastMessage.timestamp)).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    return (
                        <div
                            key={wa_id}
                            className={`px-4 py-3 hover:bg-[#202c33] cursor-pointer border-b border-[#313d45] ${selectedUser === wa_id ? 'bg-[#2a3942]' : ''
                                }`}
                            onClick={() => onSelect(wa_id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#6b7c85] flex items-center justify-center flex-shrink-0">
                                    <span className="text-[#e9edef] text-sm font-medium">
                                        {lastMessage.name?.charAt(0) || '?'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-medium text-[#e9edef] text-[17px] truncate">
                                            {lastMessage.name || 'Unknown'}
                                        </h3>
                                        <span className="text-[12px] text-[#8696a0]">{time}</span>
                                    </div>
                                    <p className="text-[14px] text-[#8696a0] truncate">
                                        {lastMessage.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ChatList;
