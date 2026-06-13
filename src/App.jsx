import React, { useState, useRef, useEffect, useCallback } from 'react';
import { initGame } from './game/engine';
import { saveBestScore } from './firebase';
import WelcomeScreen from './components/WelcomeScreen';
import InstructionsScreen from './components/InstructionsScreen';
import GameOverScreen from './components/GameOverScreen';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import PhaseToast from './components/PhaseToast';
import ComboToast from './components/ComboToast';
import TopActions from './components/TopActions';
import TouchControls from './components/TouchControls';
import UserBadge from './components/UserBadge';

export default function App() {
  const [mode, setMode] = useState('welcome');
  const [gameOverStats, setGameOverStats] = useState({ score: 0, best: 0, distance: 0 });
  const [user, setUser] = useState(null);
  const engineRef = useRef(null);
  const shellRef = useRef(null);
  const canvasRef = useRef(null);
  const userRef = useRef(null);

  const handleModeChange = useCallback((newMode, data) => {
    setMode(newMode);
    if (newMode === 'gameover' && data) {
      setGameOverStats(data);
      const u = userRef.current;
      if (u && data.score > (u.bestScore || 0)) {
        saveBestScore(u.uid, data.score);
        setUser((prev) => prev ? { ...prev, bestScore: data.score } : prev);
      }
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = initGame(canvasRef.current, {
      shellRef,
      onModeChange: handleModeChange,
    });
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [handleModeChange]);

  function handleAuth(u) {
    userRef.current = u;
    setUser(u);
  }

  const isPlaying = mode === 'playing';

  return (
    <div className="game-shell" ref={shellRef}>
      <GameCanvas ref={canvasRef} />

      {mode === 'welcome' && (
        <WelcomeScreen
          onNext={() => setMode('instructions')}
          engine={engineRef}
          onAuth={handleAuth}
        />
      )}
      {mode === 'instructions' && (
        <InstructionsScreen
          onBack={() => setMode('welcome')}
          engine={engineRef}
        />
      )}
      {mode === 'gameover' && (
        <GameOverScreen
          stats={gameOverStats}
          engine={engineRef}
          onHome={() => setMode('instructions')}
        />
      )}

      {isPlaying && (
        <>
          <UserBadge user={user} />
          <HUD />
          <PhaseToast />
          <ComboToast />
          <TopActions engine={engineRef} />
          <TouchControls engine={engineRef} />
        </>
      )}
    </div>
  );
}
