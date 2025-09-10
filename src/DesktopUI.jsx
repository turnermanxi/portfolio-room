// DesktopUI.jsx
import React, { useState } from 'react';
import Window from './Window';
import './desktop.css';

const apps = [
  { title: 'Monarca', icon: '🦋', url: 'https://monarcaoutdoors.netlify.app' },
  { title: 'SScreen', icon: '🛍️', url: 'https://smokescreensmells.netlify.app' },
  { title: 'DJBebote', icon: '🎛️ ', url: 'https://djbebote.com/' },
  { title: 'Zetto', icon: '🎮', url: 'https://zetto.plus' },
  { title: 'Github', icon: '🐱', url: 'https://github.com/turnermanxi'}
];

const DesktopUI = () => {
  const [openWindows, setOpenWindows] = useState([]);

  const openApp = (app) => {
    if (!openWindows.find(w => w.title === app.title)) {
      setOpenWindows([...openWindows, app]);
    }
  };

  const closeApp = (title) => {
    setOpenWindows(openWindows.filter(app => app.title !== title));
  };

  return (
  <div className="xp-desktop">
    {apps.map(app => (
      app.title === 'Github' ? (
        <a
          key={app.title}
          className="xp-icon"
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="icon-img">{app.icon}</div>
          <div className="icon-label">{app.title}</div>
        </a>
      ) : (
        <div key={app.title} className="xp-icon" onClick={() => openApp(app)}>
          <div className="icon-img">{app.icon}</div>
          <div className="icon-label">{app.title}</div>
        </div>
      )
    ))}

    {openWindows.map(app => (
      <Window key={app.title} {...app} onClose={() => closeApp(app.title)} />
    ))}
    </div>
  );
};

export default DesktopUI;
