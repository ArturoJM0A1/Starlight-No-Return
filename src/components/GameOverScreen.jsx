import React from 'react';

export default function GameOverScreen({ stats, engine, onHome }) {
  return (
    <section id="gameOverScreen" className="screen">
      <div className="brand-row">
        <div className="mini-rocket" aria-hidden="true"></div>
        <span>Fin del viaje</span>
      </div>
      <h2>El cohete perdió estabilidad</h2>
      <p id="finalStats" className="lead">
        Puntuacion: {Math.round(stats.score)} · Mejor marca: {Math.round(stats.best)} · Distancia: {Math.round(stats.distance)} m
      </p>
      <div className="welcome-actions">
        <button
          id="restartButton"
          className="primary-button"
          onClick={() => { if (engine.current) engine.current.startGame(); }}
        >
          Reintentar
        </button>
        <button
          id="homeButton"
          className="ghost-button"
          onClick={() => {
            if (engine.current) engine.current.returnHome();
            if (onHome) onHome();
          }}
        >
          Instrucciones
        </button>
      </div>
      <footer className="contact-footer">
        <a href="https://github.com/ArturoJM0A1" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://arturojuarezmonroy.vercel.app/" target="_blank" rel="noopener noreferrer">Web</a>
        <a href="https://x.com/juarez_mon84035" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://api.whatsapp.com/send/?phone=5217736802105&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </footer>
    </section>
  );
}
