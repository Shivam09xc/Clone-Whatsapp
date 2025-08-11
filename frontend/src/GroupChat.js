import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

function GroupChat({ user }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [input, setInput] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupAvatar, setNewGroupAvatar] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/groups`).then(res => setGroups(res.data));
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      axios.get(`${API_BASE}/chat/${selectedGroup._id}`).then(res => setGroupMessages(res.data));
    }
  }, [selectedGroup]);

  const sendGroupMessage = async () => {
    if (!input.trim() || !selectedGroup) return;
    await axios.post(`${API_BASE}/send`, {
      wa_id: selectedGroup._id,
      name: user.name,
      message: input
    });
    setInput('');
    axios.get(`${API_BASE}/chat/${selectedGroup._id}`).then(res => setGroupMessages(res.data));
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) return;
    const res = await axios.post(`${API_BASE}/groups`, {
      name: newGroupName,
      members: [user.wa_id],
      avatar: newGroupAvatar
    });
    setGroups(prev => [...prev, res.data]);
    setShowCreate(false);
    setNewGroupName('');
    setNewGroupAvatar('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b bg-white">
        <span className="font-bold">Groups</span>
        <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Cancel' : 'Create Group'}
        </button>
      </div>
      {showCreate && (
        <div className="p-2 border-b bg-gray-50 flex gap-2">
          <input className="border rounded px-2 py-1" placeholder="Group Name" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
          <input className="border rounded px-2 py-1" placeholder="Avatar URL" value={newGroupAvatar} onChange={e => setNewGroupAvatar(e.target.value)} />
          <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={createGroup}>Create</button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {groups.map(group => (
          <div key={group._id} className={`p-3 border-b cursor-pointer flex items-center gap-2 ${selectedGroup && selectedGroup._id === group._id ? 'bg-gray-200' : ''}`} onClick={() => setSelectedGroup(group)}>
            {group.avatar && <img src={group.avatar} alt="avatar" className="w-8 h-8 rounded-full" />}
            <span className="font-semibold">{group.name}</span>
          </div>
        ))}
      </div>
      {selectedGroup && (
        <div className="flex-1 flex flex-col">
          <div className="p-2 border-b bg-white font-bold">{selectedGroup.name}</div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {groupMessages.map(msg => (
              <div key={msg.meta_msg_id} className={`flex ${msg.status === 'sent' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.status === 'sent' ? 'bg-green-100' : 'bg-gray-200'}`}>
                  <div>{msg.message}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    {new Date(msg.timestamp).toLocaleTimeString()} {msg.status === 'sent' && <span>✓</span>} {msg.status === 'delivered' && <span>✓✓</span>} {msg.status === 'read' && <span className="text-blue-500">✓✓</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t bg-white flex">
            <input
              className="flex-1 border rounded-lg px-3 py-2 mr-2 focus:outline-none"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={e => e.key === 'Enter' && sendGroupMessage()}
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={sendGroupMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupChat;
