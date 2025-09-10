// Window.jsx
import React from 'react';
import './desktop.css';

const Window = ({ title, url, onClose }) => {
  return (
    <div className="xp-window">
      <div className="xp-titlebar">
        <span>{title}</span>
        <button onClick={onClose}>X</button>
      </div>
      <div className="xp-content">
        <iframe src={url} title={title} frameBorder="0" />
      </div>
    </div>
  );
};

export default Window;
