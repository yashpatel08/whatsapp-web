function MessageBubble({ msg, myWaId }) {
    const time = new Date(Number(msg.timestamp)).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const isSentByMe = msg.from_wa_id === myWaId;

    const getStatusDisplay = (status) => {
        switch (status) {
            case 'sent':
                return { text: 'Sent', icon: '✓', color: 'text-gray-400' };
            case 'delivered':
                return { text: 'Delivered', icon: '✓✓', color: 'text-gray-300' };
            case 'read':
                return { text: 'Read', icon: '✓✓', color: 'text-blue-400' };
            case 'received':
                return { text: 'Received', icon: '✓', color: 'text-gray-400' };
            default:
                return { text: 'Pending', icon: '○', color: 'text-gray-500' };
        }
    };

    const statusInfo = getStatusDisplay(msg.status);

    return (
        <div className={`flex pt-[10px] ml-[2px] ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-4 py-2 shadow text-sm ${isSentByMe
                ? 'bg-[#005c4b] text-white rounded-2xl rounded-br-none'
                : 'bg-[#202c33] text-white rounded-2xl rounded-bl-none'
                }`}>
                <p className='mt-[2px] ml-[2px]'>{msg.message}</p>
                <div className="flex justify-end items-center gap-2 mt-1 text-xs text-[#8696a0]">
                    <span>{time}</span>
                    {isSentByMe && (
                        <div className={`flex items-center gap-1 ${statusInfo.color}`}>
                            <span className="font-mono text-xs">{statusInfo.icon}</span>
                            <span className="text-[10px]">{statusInfo.text}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessageBubble;