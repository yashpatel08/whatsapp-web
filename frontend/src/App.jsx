import { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import UserSelector from './components/UserSelector';
import socket from './socket';

function App() {
  const [conversations, setConversations] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [myInfo, setMyInfo] = useState(null);
  const [newNumber, setNewNumber] = useState('');

  const predefinedUsers = [
    { wa_id: '919876543210', name: 'John Doe' },
    { wa_id: '919876543211', name: 'Jane Smith' },
    { wa_id: '919876543212', name: 'Bob Johnson' },
    { wa_id: '919876543213', name: 'Alice Brown' },
    { wa_id: '919876543214', name: 'Charlie Wilson' }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('whatsapp_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setMyInfo(userData);
        console.log('👤 Loaded saved user:', userData);
      } catch (err) {
        console.error('❌ Error loading saved user:', err);
        localStorage.removeItem('whatsapp_user');
      }
    }
  }, []);

  const fetchMessages = () => {
    if (!myInfo?.wa_id) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/messages?myWaId=${myInfo.wa_id}`)
      .then(res => res.json())
      .then(data => {
        console.log("📥 Fetched conversations for", myInfo.name, ":", data);
        setConversations(data);
      })
      .catch(err => console.error("❌ Initial fetch error:", err));
  };

  useEffect(() => {
    if (myInfo?.wa_id) {
      fetchMessages();
    }
  }, [myInfo?.wa_id]);

  useEffect(() => {
    if (!selectedUser || !myInfo?.wa_id) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/messages/mark-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_wa_id: selectedUser,
        to_wa_id: myInfo.wa_id
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log('✅ Marked messages as read:', res);
      })
      .catch(err => {
        console.error('❌ Error marking messages as read:', err);
      });

  }, [selectedUser, myInfo?.wa_id]);

  useEffect(() => {
    if (!myInfo?.wa_id) return;

    console.log(`⏳ Attempting socket connection for user: ${myInfo.name} (${myInfo.wa_id})`);

    socket.on('connect', () => {
      console.log(`🟢 Socket connected for ${myInfo.name}:`, socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error("🔴 Socket connection error:", err.message);
    });

    socket.on('disconnect', (reason) => {
      console.warn("🟡 Socket disconnected:", reason);
    });

    socket.on('new_message', ({ to_wa_id, message }) => {
      console.log("📥 New message via socket:", message);

      if (to_wa_id === myInfo.wa_id || message.from_wa_id === myInfo.wa_id) {
        console.log(`✅ Message is relevant for ${myInfo.name}, refreshing...`);
        fetchMessages();
      } else {
        console.log(`⏭️ Message not relevant for ${myInfo.name}, ignoring...`);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('new_message');
    };
  }, [myInfo?.wa_id]);

  useEffect(() => {
    if (!myInfo?.wa_id) return;

    const handleStatusUpdate = ({ meta_msg_id, status, to_wa_id, from_wa_id, timestamp }) => {
      console.log(`📶 Status update received by ${myInfo.name}:`, { meta_msg_id, status, to_wa_id, from_wa_id });

      const isRelevant = to_wa_id === myInfo.wa_id || from_wa_id === myInfo.wa_id;

      if (!isRelevant) {
        console.log(`⏭️ Status update not relevant for ${myInfo.name}, ignoring...`);
        return;
      }

      setConversations(prev => {
        const updated = { ...prev };
        let messageFound = false;

        for (const userId in updated) {
          updated[userId] = updated[userId].map(msg => {
            if (msg.meta_msg_id === meta_msg_id) {
              messageFound = true;
              console.log(`✅ ${myInfo.name} updating message ${meta_msg_id} status from '${msg.status}' to '${status}'`);
              return {
                ...msg,
                status,
                ...(timestamp && { timestamp })
              };
            }
            return msg;
          });
        }

        if (!messageFound) {
          console.warn(`⚠️ Message with meta_msg_id ${meta_msg_id} not found in ${myInfo.name}'s local conversations`);
          setTimeout(() => {
            console.log(`🔄 ${myInfo.name} refetching messages due to missing message in local state`);
            fetchMessages();
          }, 1000);
        }

        return updated;
      });
    };

    socket.on('status_updated', handleStatusUpdate);

    return () => {
      socket.off('status_updated', handleStatusUpdate);
    };
  }, [myInfo?.wa_id]);

  const handleUserSelect = (userInfo) => {
    setMyInfo(userInfo);
    localStorage.setItem('whatsapp_user', JSON.stringify(userInfo));
    console.log('👤 User selected:', userInfo);
  };

  const handleLogout = () => {
    setMyInfo(null);
    setConversations({});
    setSelectedUser(null);
    localStorage.removeItem('whatsapp_user');
    console.log('👋 User logged out');
  };

  const handleSelect = (wa_id) => {
    const isValid = /^[0-9]+$/.test(wa_id);
    if (!isValid) {
      alert('❌ Invalid number. Please enter digits only.');
      return;
    }
    setSelectedUser(wa_id);
  };

  if (!myInfo) {
    return <UserSelector onUserSelect={handleUserSelect} predefinedUsers={predefinedUsers} />;
  }

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
        refreshMessages={fetchMessages}
      />
    </div>
  );
}

export default App;