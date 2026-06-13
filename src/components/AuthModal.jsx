import React, { useState } from 'react';
import { registerUser, loginUser } from '../firebase';

const VALID_USERNAME = /^@[a-zA-Z0-9]+$/;

function validateUsername(val) {
  if (!val.startsWith('@')) return 'Debe comenzar con @';
  if (val.length > 15) return 'Máximo 15 caracteres';
  if (!VALID_USERNAME.test(val)) return 'Solo letras y números después del @';
  return '';
}

const overlay = {
  position: 'absolute', inset: 0, zIndex: 20,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
};

const card = {
  background: 'linear-gradient(135deg, #0f0c29, #1a1145, #0d2137)',
  border: '1px solid rgba(253, 160, 133, 0.25)',
  borderRadius: 16, padding: '32px 28px', width: 320,
  maxWidth: 'calc(100% - 32px)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(253, 160, 133, 0.15)',
};

const title = {
  fontSize: '1.2rem', fontWeight: 700, textAlign: 'center',
  marginBottom: 24, color: '#f8fbff',
};

const label = {
  display: 'block', fontSize: '0.8rem', color: '#b8c4d9',
  marginBottom: 6, marginTop: 14,
};

const input = {
  width: '100%', padding: '10px 12px', fontSize: '0.9rem',
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8, color: '#f8fbff', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
};

const inputError = { ...input, borderColor: '#ff4b6e' };

const errorMsg = { fontSize: '0.75rem', color: '#ff4b6e', marginTop: 4 };

const btnPrimary = {
  width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 700,
  background: 'linear-gradient(135deg, #f6d365, #fda085)',
  backgroundSize: '200% auto',
  border: 0, borderRadius: 8, color: '#1a1025', cursor: 'pointer',
  marginTop: 20, letterSpacing: '0.5px',
  boxShadow: '0 0 15px rgba(253, 160, 133, 0.3)',
};

const toggleText = {
  textAlign: 'center', fontSize: '0.8rem', color: '#b8c4d9', marginTop: 16,
};

const toggleLink = {
  color: '#f6d365', cursor: 'pointer', textDecoration: 'underline',
  fontWeight: 600,
};

const closeBtn = {
  position: 'absolute', top: 12, right: 16,
  background: 'none', border: 0, color: '#b8c4d9',
  fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1,
};

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    const uErr = validateUsername(username);
    if (uErr) errs.username = uErr;
    if (!password) errs.password = 'Campo obligatorio';
    if (mode === 'register' && !email) errs.email = 'Campo obligatorio';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      if (mode === 'register') {
        await registerUser(username, email, password);
      } else {
        await loginUser(username, password);
      }
      onClose();
    } catch (err) {
      const map = {
        'auth/email-already-in-use': 'El correo ya está registrado',
        'auth/invalid-email': 'Correo inválido',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/invalid-credential': 'Credenciales inválidas',
      };
      setErrors({ firebase: map[err.code] || err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={overlay}>
      <div style={card}>
        <button style={closeBtn} onClick={onClose} aria-label="Cerrar">&times;</button>
        <div style={title}>
          {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </div>

        <form onSubmit={handleSubmit}>
          <label style={label}>Nombre de usuario</label>
          <input
            style={errors.username ? inputError : input}
            type="text"
            placeholder="@usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={15}
            autoComplete="username"
          />
          {errors.username && <div style={errorMsg}>{errors.username}</div>}

          {mode === 'register' && (
            <>
              <label style={label}>Correo electrónico</label>
              <input
                style={errors.email ? inputError : input}
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {errors.email && <div style={errorMsg}>{errors.email}</div>}
            </>
          )}

          <label style={label}>Contraseña</label>
          <input
            style={errors.password ? inputError : input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {errors.password && <div style={errorMsg}>{errors.password}</div>}

          {errors.firebase && <div style={{ ...errorMsg, marginTop: 12, textAlign: 'center' }}>{errors.firebase}</div>}

          <button type="submit" style={{ ...btnPrimary, opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? '...' : (mode === 'login' ? 'Entrar' : 'Registrarse')}
          </button>
        </form>

        <div style={toggleText}>
          {mode === 'login' ? (
            <>
              ¿No tienes cuenta?{' '}
              <span style={toggleLink} onClick={() => { setMode('register'); setErrors({}); }}>
                Regístrate
              </span>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <span style={toggleLink} onClick={() => { setMode('login'); setErrors({}); }}>
                Inicia sesión
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
