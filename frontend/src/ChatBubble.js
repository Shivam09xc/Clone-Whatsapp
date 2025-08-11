import React from 'react';

function ChatBubble({ message, timestamp, status }) {
  return (
    <div className={`flex ${status === 'sent' ? 'justify-end' : 'justify-start'}`}>
      <div className={`rounded-lg px-4 py-2 max-w-xs ${status === 'sent' ? 'bg-green-100' : 'bg-gray-200'}`}>
        <div>{message}</div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          {new Date(timestamp).toLocaleTimeString()} {status === 'sent' && <span>✓</span>} {status === 'delivered' && <span>✓✓</span>} {status === 'read' && <span className="text-blue-500">✓✓</span>}
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
