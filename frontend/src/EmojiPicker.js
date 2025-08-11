import React, { useState } from 'react';

const emojis = ['😀','😂','😍','😎','😭','👍','🙏','🎉','🔥','❤️','😜','😇','😡','😱','🥳','🤩','😏','😅','😢','😋','🤔'];

function EmojiPicker({ onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button className="text-xl mr-2" title="Emoji" onClick={() => setOpen(!open)}>
        <span role="img" aria-label="emoji">😊</span>
      </button>
      {open && (
        <div className="absolute bottom-10 left-0 bg-white border rounded shadow-lg p-2 flex flex-wrap gap-2 z-50">
          {emojis.map(e => (
            <button key={e} className="text-2xl hover:bg-gray-100 rounded p-1" onClick={() => { onSelect(e); setOpen(false); }}>{e}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;
