import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

function Profile({ user, setUser, onClose }) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    try {
      const res = await axios.post(`${API_BASE}/profile/${user.wa_id}/avatar`, { avatar });
      setUser({ ...user, avatar: res.data.avatar });
      setSuccess('Avatar updated!');
    } catch (err) {
      setError('Failed to update avatar');
    }
    try {
      // Name update (optional, if you want to allow)
      // Add a backend route for name update if needed
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <div className="text-lg font-bold mb-4">Edit Profile</div>
        <div className="flex flex-col items-center mb-4">
          <img src={avatar || 'https://via.placeholder.com/80'} alt="avatar" className="w-20 h-20 rounded-full mb-2" />
          <input className="w-full px-3 py-2 border rounded mb-2" value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="Avatar URL" />
          <input className="w-full px-3 py-2 border rounded mb-2" value={name} onChange={e => setName(e.target.value)} placeholder="Name" disabled />
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-2">{success}</div>}
        <button className="w-full bg-green-500 text-white py-2 rounded" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default Profile;
