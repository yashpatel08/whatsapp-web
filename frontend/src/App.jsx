import React, { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import socket from './socket';

function App() {
  const [conversations, setConversations] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [myInfo] = useState({
    wa_id: '919876543210',
    name: 'Me',
  });
  const [newNumber, setNewNumber] = useState('');

  // Initial fetch
  const fetchMessages = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/messages?myWaId=${myInfo.wa_id}`)
      .then(res => res.json())
      .then(data => {
        setConversations(data);
      })
      .catch(err => console.error("❌ Initial fetch error:", err));
  };

  useEffect(() => {
    fetchMessages();
  }, [myInfo.wa_id]);

  useEffect(() => {
    console.log("⏳ Attempting socket connection...");

    socket.on('connect', () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error("🔴 Socket connection error:", err.message);
    });

    socket.on('new_message', ({ to_wa_id, message }) => {
      console.log("📥 New message via socket:", message);

      if (to_wa_id === myInfo.wa_id || message.from_wa_id === myInfo.wa_id) {
        fetchMessages();
      }
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('new_message');
    };
  }, [myInfo.wa_id]);


  const handleSelect = (wa_id) => {
    const isValid = /^[0-9]+$/.test(wa_id);
    if (!isValid) {
      alert('❌ Invalid number. Please enter digits only.');
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
