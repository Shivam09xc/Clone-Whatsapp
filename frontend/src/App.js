import GroupChat from './GroupChat';
import MessageSearch from './MessageSearch';
import Profile from './Profile';
import UserList from './UserList';
import EmojiPicker from './EmojiPicker';
import FileUpload from '        </div>
        </div>
      )}
    </div>
  );leUpload';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Auth from './Auth';
import LoadingScreen from './components/LoadingScreen';
import './index.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const socket = io(API_BASE);

function App() {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    if (!user) return;
    axios.get(`${API_BASE}/chats`).then(res => setChats(res.data));
    socket.on('newMessage', msg => {
      if (selectedChat && msg.wa_id === selectedChat._id) {
        setMessages(prev => [...prev, msg]);
      }
      axios.get(`${API_BASE}/chats`).then(res => setChats(res.data));
    });
    socket.on('statusUpdate', msg => {
      if (selectedChat && msg.wa_id === selectedChat._id) {
        setMessages(prev => prev.map(m => m.meta_msg_id === msg.meta_msg_id ? msg : m));
      }
      axios.get(`${API_BASE}/chats`).then(res => setChats(res.data));
    });
    return () => {
      socket.off('newMessage');
      socket.off('statusUpdate');
    };
  }, [selectedChat, user]);

  useEffect(() => {
    if (selectedChat) {
      axios.get(`${API_BASE}/chat/${selectedChat._id}`).then(res => setMessages(res.data));
    }
  }, [selectedChat]);

  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    socket.on('typing', ({ wa_id }) => {
      setTypingUsers(prev => [...new Set([...prev, wa_id])]);
    });
    socket.on('stopTyping', ({ wa_id }) => {
      setTypingUsers(prev => prev.filter(id => id !== wa_id));
    });
    return () => {
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!selectedChat) return;
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { wa_id: selectedChat._id });
    }
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stopTyping', { wa_id: selectedChat._id });
    }, 1000);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat) return;
    await axios.post(`${API_BASE}/send`, {
      wa_id: selectedChat._id,
      name: user.name,
      message: input
    });
    setInput('');
    setIsTyping(false);
    socket.emit('stopTyping', { wa_id: selectedChat._id });
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoading(false);
  };

  return (
    <div className="h-screen">
      {!user ? (
        <Auth setUser={setUser} setIsLoading={setIsLoading} />
      ) : isLoading ? (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      ) : (
        <div className="flex h-full bg-[#ece5dd]" style={{fontFamily:'Segoe UI,Roboto,Arial,sans-serif'}}>
          {/* Left panel: WhatsApp-style chat list */}
          <div className="w-1/3 min-w-[340px] max-w-[400px] bg-[#f0f2f5] border-r flex flex-col h-full shadow-lg">
  <div className="flex items-center gap-3 px-5 py-4 bg-[#ededed] border-b">
          <button className="mr-2" onClick={() => setShowProfile(true)} title="Edit Profile">
            {user.avatar ? <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border" /> : <span className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">👤</span>}
          </button>
          <span className="font-semibold text-gray-800">{user.name}</span>
          <button className="ml-auto bg-red-500 text-white px-3 py-1 rounded" onClick={handleLogout}>Logout</button>
        </div>
        {showProfile && <Profile user={user} setUser={setUser} onClose={() => setShowProfile(false)} />}
  <div className="px-5 py-2 bg-[#f6f6f6] border-b">
          <MessageSearch onSelect={msg => setSelectedChat({ _id: msg.wa_id, name: msg.name })} />
        </div>
  <div className="flex-1 overflow-y-auto pb-2">
          <UserList user={user} setSelectedChat={setSelectedChat} />
          <div className="font-semibold px-5 py-2 bg-[#f6f6f6] border-b">Chats</div>
          {chats.map(chat => (
            <div key={chat._id} className={`flex items-center gap-3 px-5 py-3 cursor-pointer border-b hover:bg-[#e9edef] ${selectedChat && selectedChat._id === chat._id ? 'bg-[#d1f7c4]' : ''}`} onClick={() => setSelectedChat(chat)}>
              {chat.avatar ? <img src={chat.avatar} alt="avatar" className="w-8 h-8 rounded-full" /> : <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">👤</span>}
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{chat.name}</div>
                <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(chat.lastTimestamp).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
            </div>
          ))}
          <GroupChat user={user} />
        </div>
      </div>
      {/* Right panel: WhatsApp-style chat window */}
  <div className="flex-1 flex flex-col bg-[#ece5dd] h-full min-w-0">
  <div className="flex items-center gap-3 px-6 py-4 bg-[#075e54] text-white border-b shadow sticky top-0 z-10">
          {selectedChat && selectedChat.avatar ? <img src={selectedChat.avatar} alt="avatar" className="w-8 h-8 rounded-full" /> : <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">👤</span>}
          <div className="flex-1">
            <div className="font-semibold">{selectedChat ? selectedChat.name : 'Select a chat'}</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-3 flex flex-col-reverse" style={{scrollBehavior:'smooth'}}>
          {messages.slice().reverse().map(msg => (
            <div key={msg.meta_msg_id} className={`flex ${msg.name === user.name ? 'justify-end' : 'justify-start'} transition-all duration-200`}>
              <div className={`group relative rounded-2xl px-4 pt-2 pb-4 max-w-[70%] shadow ${msg.name === user.name ? 'bg-[#dcf8c6] border border-[#b2e59f]' : 'bg-white border border-gray-300'} animate-fade-in`} style={{animation:'fadeIn 0.3s'}}>
                {/* Show image preview if message contains [File: ...] and is image */}
                {msg.message.includes('[File:') && msg.message.match(/\.(jpg|jpeg|png|gif)$/i) && (
                  <img src={msg.message.split('[File: ')[1].split(']')[0]} alt="file" className="w-32 h-32 object-cover rounded mb-2" />
                )}
                <div className={`whitespace-pre-line break-words text-base leading-relaxed ${msg.name === user.name ? 'text-gray-900' : 'text-gray-800'}`}>
                  {msg.message.replace(/\[File: .+\]/, '')}
                </div>
                <div className={`flex items-center ${msg.name === user.name ? 'justify-end' : 'justify-start'} mt-0.5 min-h-[14px]`}>
                  <div className="text-[10px] text-gray-500 flex items-center">
                    <span className="opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], { 
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                    {msg.name === user.name && (
                      <span className="ml-1 relative -top-px">
                        {msg.status === 'sent' && <span>✓</span>}
                        {msg.status === 'delivered' && <span>✓✓</span>}
                        {msg.status === 'read' && <span className="text-blue-500">✓✓</span>}
                      </span>
                    )}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedChat && (
          <>
            {typingUsers.includes(selectedChat._id) && (
              <div className="px-6 py-1 text-sm text-gray-500">Typing...</div>
            )}
            <div className="px-8 py-5 border-t bg-[#f7f7f7] flex items-center gap-3">
              <FileUpload onFile={file => {
    setFilePreview({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type
    });
  }} />
              <EmojiPicker onSelect={emoji => setInput(input + emoji)} />
              <input
                className="flex-1 border rounded-full px-5 py-3 focus:outline-none bg-white text-base"
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message..."
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <button className="bg-[#25d366] text-white px-6 py-3 rounded-full font-bold text-lg shadow" onClick={sendMessage}>Send</button>
            </div>
            {filePreview && (
  <div className="px-8 pb-2 flex items-center gap-2">
    {filePreview.type.startsWith('image') ? (
      <img src={filePreview.url} alt="preview" className="w-20 h-20 object-cover rounded-lg border" />
    ) : (
      <span className="text-gray-700">{filePreview.name}</span>
    )}
    <button className="text-red-500" onClick={() => setFilePreview(null)}>Remove</button>
  </div>
)}
          </>
        )}
      </div>
      )}
    </div>
  );
}

export default App;
