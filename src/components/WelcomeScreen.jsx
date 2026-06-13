import React, { useState } from 'react';
import AuthModal from './AuthModal';
import TopGlobalModal from './TopGlobalModal';

const goldBtn = {
  marginTop: 20, padding: '12px 28px', fontSize: '0.95rem', fontWeight: 700,
  background: 'linear-gradient(135deg, #f6d365, #fda085, #f6d365)',
  backgroundSize: '200% auto',
  border: 0, borderRadius: 8, color: '#1a1025', cursor: 'pointer',
  boxShadow: '0 0 20px rgba(253, 160, 133, 0.4), 0 4px 15px rgba(0,0,0,0.3)',
  letterSpacing: '0.5px',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const ghostBtn = {
  marginLeft: 8, padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600,
  background: 'rgba(78, 231, 213, 0.15)', border: '1px solid rgba(78, 231, 213, 0.4)',
  borderRadius: 8, color: '#4ee7d5', cursor: 'pointer',
  transition: 'transform 0.2s, background 0.2s',
};

export default function WelcomeScreen({ onNext, engine, onAuth }) {
  const [showAuth, setShowAuth] = useState(false);
  const [showTop, setShowTop] = useState(false);

  return (
    <section id="welcomeScreen" className="screen screen-welcome">
      <div className="brand-row">
        <div className="mini-rocket" aria-hidden="true"></div>
        <span>Bienvenido, piloto</span>
      </div>
      <h1>Starlight: No Return</h1>
      <h3>By: Arturo Juárez Monroy</h3>
      <div className="welcome-actions">
        <button id="nextButton" className="primary-button" onClick={onNext}>
          Siguiente
        </button>
        <button
          id="muteButtonIntro"
          className="ghost-button"
          aria-pressed="false"
          onClick={() => { if (engine.current) engine.current.toggleMute(); }}
        >
          Sonido
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <button
          style={goldBtn}
          onClick={() => setShowAuth(true)}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(253, 160, 133, 0.6), 0 6px 20px rgba(0,0,0,0.4)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(253, 160, 133, 0.4), 0 4px 15px rgba(0,0,0,0.3)'; }}
        >
          ✦ Iniciar sesión / Registrarse ✦
        </button>
        <button
          style={ghostBtn}
          onClick={() => setShowTop(true)}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(78, 231, 213, 0.3)'; e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(78, 231, 213, 0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Top Global
        </button>
      </div>
      <footer className="contact-footer">
        <a href="https://github.com/ArturoJM0A1" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://arturojuarezmonroy.vercel.app/" target="_blank" rel="noopener noreferrer">Web</a>
        <a href="https://x.com/juarez_mon84035" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://api.whatsapp.com/send/?phone=5217736802105&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </footer>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={onAuth} />}
      {showTop && <TopGlobalModal onClose={() => setShowTop(false)} />}
    </section>
  );
}
