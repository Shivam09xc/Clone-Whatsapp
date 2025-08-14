import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://clone-whatsapp-mued.onrender.com';


function UserList({ user, setSelectedChat }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/users`).then(res => setUsers(res.data));
  }, []);

  return (
    <div className="border-b font-semibold px-4 py-2 bg-gray-50">All Users
      <div className="max-h-40 overflow-y-auto">
        {users.filter(u => u.wa_id !== user.wa_id).map(u => (
          <div key={u.wa_id} className="p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100" onClick={() => setSelectedChat({ _id: u.wa_id, name: u.name })}>
            {u.avatar ? <img src={u.avatar} alt="avatar" className="w-6 h-6 rounded-full" /> : <span className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">👤</span>}
            <span>{u.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
