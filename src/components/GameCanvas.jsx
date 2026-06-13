import React from 'react';

const GameCanvas = React.forwardRef(function GameCanvas(props, ref) {
  return <canvas ref={ref} id="gameCanvas" />;
});

export default GameCanvas;
