import React from 'react';

function ChatList({ chats, selectedChat, setSelectedChat }) {
  return (
    <div className="w-1/3 bg-white border-r overflow-y-auto">
      <div className="p-4 font-bold text-lg border-b">Chats</div>
      {chats.map(chat => (
        <div key={chat._id} className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${selectedChat && selectedChat._id === chat._id ? 'bg-gray-200' : ''}`} onClick={() => setSelectedChat(chat)}>
          <div className="font-semibold">{chat.name}</div>
          <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
          <div className="text-xs text-gray-400">{new Date(chat.lastTimestamp).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
