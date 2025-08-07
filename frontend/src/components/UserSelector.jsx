import { useState } from 'react';
import { User, Phone } from 'lucide-react';

function UserSelector({ onUserSelect, predefinedUsers }) {
    const [customWaId, setCustomWaId] = useState('');
    const [customName, setCustomName] = useState('');

    const handlePredefinedUserSelect = (user) => {
        onUserSelect(user);
    };

    const handleCustomUserSelect = () => {
        if (!customWaId.trim() || !customName.trim()) {
            alert('Please enter both WhatsApp ID and name');
            return;
        }

        if (!/^[0-9]+$/.test(customWaId)) {
            alert('WhatsApp ID should contain only numbers');
            return;
        }

        onUserSelect({
            wa_id: customWaId.trim(),
            name: customName.trim()
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#202c33]">
            <div className="bg-[#2a3942] rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="bg-[#00a884] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Choose Your Identity</h1>
                    <p className="text-[#8696a0]">Select or create a user to start chatting</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-[#e9edef] font-medium mb-3">Quick Select:</h3>
                    <div className="space-y-2">
                        {predefinedUsers.map((user) => (
                            <button
                                key={user.wa_id}
                                onClick={() => handlePredefinedUserSelect(user)}
                                className="w-full p-3 bg-[#374045] hover:bg-[#3f4950] rounded-lg text-left transition-colors group"
                            >
                                <div className="flex items-center">
                                    <div className="bg-[#00a884] w-10 h-10 rounded-full flex items-center justify-center mr-3 group-hover:bg-[#00c95a]">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-[#e9edef] font-medium">{user.name}</div>
                                        <div className="text-[#8696a0] text-sm">+{user.wa_id}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border-t border-[#374045] pt-6">
                    <h3 className="text-[#e9edef] font-medium mb-3">Create Custom User:</h3>
                    <div className="space-y-3">
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8696a0]" />
                            <input
                                type="text"
                                placeholder="WhatsApp ID (e.g., 919876543210)"
                                className="w-full pl-10 pr-4 py-3 bg-[#374045] rounded-lg text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:ring-2 focus:ring-[#00a884]"
                                value={customWaId}
                                onChange={(e) => setCustomWaId(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8696a0]" />
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full pl-10 pr-4 py-3 bg-[#374045] rounded-lg text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:ring-2 focus:ring-[#00a884]"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCustomUserSelect()}
                            />
                        </div>
                        <button
                            onClick={handleCustomUserSelect}
                            className="w-full py-3 bg-[#00a884] hover:bg-[#00c95a] rounded-lg text-white font-medium transition-colors"
                        >
                            Start Chatting
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-[#8696a0] text-sm">
                        💡 <strong>Tip:</strong> Open multiple browser windows with different users to test conversations and see real-time status updates!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default UserSelector;