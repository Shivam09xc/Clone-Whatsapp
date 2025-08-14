import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://clone-whatsapp-mued.onrender.com';


function MessageSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = await axios.get(`${API_BASE}/search/search?q=${encodeURIComponent(query)}`);
    setResults(res.data);
  };

  return (
    <div className="p-2 border-b bg-white">
      <form className="flex gap-2" onSubmit={handleSearch}>
        <input
          className="flex-1 border rounded px-2 py-1"
          type="text"
          placeholder="Search messages..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded" type="submit">Search</button>
      </form>
      {results.length > 0 && (
        <div className="mt-2 max-h-40 overflow-y-auto">
          {results.map(msg => (
            <div key={msg.meta_msg_id} className="p-2 border-b cursor-pointer hover:bg-gray-100" onClick={() => onSelect && onSelect(msg)}>
              <div className="font-semibold">{msg.name}</div>
              <div className="text-sm text-gray-700">{msg.message}</div>
              <div className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageSearch;
