import React from 'react';

export default function TouchControls({ engine }) {
  return (
    <div id="touchControls" className="touch-controls" aria-hidden="false">
      <button
        id="dashTouch"
        className="touch-button"
        onPointerDown={(e) => {
          e.preventDefault();
          if (engine.current) engine.current.triggerDash();
        }}
      >
        Deslizar
      </button>
      <button
        id="pulseTouch"
        className="touch-button pulse"
        onPointerDown={(e) => {
          e.preventDefault();
          if (engine.current) engine.current.triggerPulse();
        }}
      >
        Pulso
      </button>
    </div>
  );
}
