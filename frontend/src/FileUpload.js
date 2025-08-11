import React, { useRef } from 'react';

function FileUpload({ onFile }) {
  const inputRef = useRef();
  return (
    <>
      <button className="text-gray-500 hover:text-green-600 text-xl mr-2" title="Attach file" onClick={() => inputRef.current.click()}>
        <span role="img" aria-label="attach">📎</span>
      </button>
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        accept="image/*,application/pdf"
        onChange={e => {
          if (e.target.files[0]) onFile(e.target.files[0]);
        }}
      />
    </>
  );
}

export default FileUpload;
