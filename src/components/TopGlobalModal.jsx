import React, { useEffect, useState } from 'react';
import { getTopPlayers } from '../firebase';

const overlay = {
  position: 'absolute', inset: 0, zIndex: 20,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
};

const card = {
  background: 'linear-gradient(135deg, #0f0c29, #1a1145, #0d2137)',
  border: '1px solid rgba(253, 160, 133, 0.25)',
  borderRadius: 16, padding: '28px 24px', width: 420,
  maxWidth: 'calc(100% - 32px)', maxHeight: '70vh',
  boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(253, 160, 133, 0.15)',
  display: 'flex', flexDirection: 'column',
};

const title = {
  fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', color: '#f6d365',
  marginBottom: 20,
};

const list = {
  listStyle: 'none', padding: 0, margin: 0, overflowY: 'auto', flex: 1,
};

const row = (i) => ({
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '10px 12px',
  background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
  borderRadius: 6, marginBottom: 2,
});

const rank = {
  width: 28, fontSize: '0.8rem', fontWeight: 700, color: '#b8c4d9', textAlign: 'center',
};

const nameCell = {
  flex: 1, fontSize: '0.85rem', color: '#f8fbff', marginLeft: 8,
};

const scoreCell = {
  fontSize: '0.8rem', color: '#f6d365', fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
};

const empty = {
  textAlign: 'center', color: '#b8c4d9', fontSize: '0.85rem', padding: 20,
};

const closeBtn = {
  position: 'absolute', top: 12, right: 16,
  background: 'none', border: 0, color: '#ff6b6b',
  fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1,
};

export default function TopGlobalModal({ onClose }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopPlayers()
      .then(setPlayers)
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={overlay}>
      <div style={card}>
        <button style={closeBtn} onClick={onClose} aria-label="Cerrar">&times;</button>
        <div style={title}>Top Global</div>

        {loading ? (
          <div style={empty}>Cargando...</div>
        ) : players.length === 0 ? (
          <div style={empty}>Aún no hay puntuaciones</div>
        ) : (
          <ul style={list}>
            {players.map((p, i) => (
              <li key={p.uid} style={row(i)}>
                <span style={rank}>#{i + 1}</span>
                <span style={nameCell}>{p.username}</span>
                <span style={scoreCell}>{p.bestScore.toLocaleString('es-MX')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
