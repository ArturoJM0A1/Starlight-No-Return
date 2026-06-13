import React, { useState, useRef, useEffect, useCallback } from 'react';
import { initGame } from './game/engine';
import WelcomeScreen from './components/WelcomeScreen';
import InstructionsScreen from './components/InstructionsScreen';
import GameOverScreen from './components/GameOverScreen';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import PhaseToast from './components/PhaseToast';
import ComboToast from './components/ComboToast';
import TopActions from './components/TopActions';
import TouchControls from './components/TouchControls';

export default function App() {
  const [mode, setMode] = useState('welcome');
  const [gameOverStats, setGameOverStats] = useState({ score: 0, best: 0, distance: 0 });
  const engineRef = useRef(null);
  const shellRef = useRef(null);
  const canvasRef = useRef(null);

  const handleModeChange = useCallback((newMode, data) => {
    setMode(newMode);
    if (newMode === 'gameover' && data) {
      setGameOverStats(data);
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

  const isPlaying = mode === 'playing';

  return (
    <div className="game-shell" ref={shellRef}>
      <GameCanvas ref={canvasRef} />

      {mode === 'welcome' && (
        <WelcomeScreen
          onNext={() => setMode('instructions')}
          engine={engineRef}
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
