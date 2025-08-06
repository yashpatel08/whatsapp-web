import React from 'react';

function MessageBubble({ msg, myWaId }) {
    const time = new Date(Number(msg.timestamp)).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const isSentByMe = msg.from_wa_id === myWaId;

    return (
        <div className={`flex pt-[10px] ml-[2px] ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-4 py-2 shadow text-sm ${isSentByMe
                ? 'bg-[#005c4b] text-white rounded-2xl rounded-br-none'
                : 'bg-[#202c33] text-white rounded-2xl rounded-bl-none'
                }`}>
                <p className='mt-[2px] ml-[2px]'>{msg.message}</p>
                <div className="flex justify-end gap-0 mt-1 text-xs text-[#8696a0]">
                    <span>{time}</span>
                    {isSentByMe}
                </div>
            </div>
        </div>
    );
}

export default MessageBubble;
