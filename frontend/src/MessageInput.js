import React from 'react';

function MessageInput({ input, setInput, sendMessage }) {
  return (
    <div className="p-4 border-t bg-white flex">
      <input
        className="flex-1 border rounded-lg px-3 py-2 mr-2 focus:outline-none"
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={sendMessage}>Send</button>
    </div>
  );
}

export default MessageInput;
