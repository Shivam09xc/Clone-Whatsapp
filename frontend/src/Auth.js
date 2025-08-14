import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://clone-whatsapp-mued.onrender.com';


function Auth({ setUser, setIsLoading }) {
  const [isLogin, setIsLogin] = useState(true);
  const [wa_id, setWaId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE}/auth/login`, { wa_id, password });
        setIsLoading(true);
        setTimeout(() => {
          setUser(res.data.user);
        }, 2000);
      } else {
        const res = await axios.post(`${API_BASE}/auth/signup`, { wa_id, name, password, avatar });
        setIsLoading(true);
        setTimeout(() => {
          setUser(res.data.user);
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-md w-80" onSubmit={handleSubmit}>
        <div className="text-lg font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</div>
        <input className="w-full mb-2 px-3 py-2 border rounded" placeholder="WhatsApp ID" value={wa_id} onChange={e => setWaId(e.target.value)} required />
        {!isLogin && <input className="w-full mb-2 px-3 py-2 border rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />}
        <input className="w-full mb-2 px-3 py-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {!isLogin && <input className="w-full mb-2 px-3 py-2 border rounded" placeholder="Avatar URL (optional)" value={avatar} onChange={e => setAvatar(e.target.value)} />}
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button 
          className={`w-full bg-green-500 text-white py-2 rounded flex items-center justify-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`} 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : null}
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <div className="mt-2 text-sm text-center">
          {isLogin ? 'No account?' : 'Already have an account?'}{' '}
          <span className="text-blue-500 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign Up' : 'Login'}</span>
        </div>
      </form>
    </div>
  );
}

export default Auth;
