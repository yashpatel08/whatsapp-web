import React, { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

function App() {
  const [conversations, setConversations] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [myInfo, setMyInfo] = useState({
    wa_id: '919876543210',
    name: 'Me',
  });

  const [newNumber, setNewNumber] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/messages?myWaId=${myInfo.wa_id}`)
      .then(res => res.json())
      .then(data => setConversations(data));
  }, []);

  // ✅ Validate number before allowing new chat
  const handleSelect = (wa_id) => {
    const isValid = /^[0-9]+$/.test(wa_id); // ✅ Allow only digits
    if (!isValid) {
      alert('Please enter a valid number');
      return;
    }
    setSelectedUser(wa_id);
  };

  return (
    <div className="flex h-screen bg-[#202c33] font-sans">
      <ChatList
        conversations={conversations}
        onSelect={handleSelect}
        selectedUser={selectedUser}
        newNumber={newNumber}
        onNewNumberChange={setNewNumber}
      />
      <ChatWindow
        userId={selectedUser}
        messages={conversations[selectedUser] || []}
        myWaId={myInfo.wa_id}
      />
    </div>
  );
}

export default App;
