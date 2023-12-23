import React from 'react';
import './Canvas.css';
import P5Sketch from './sketch/P5Sketch';

function Canvas() {
  return (
    <div className="Canvas">
      <div className="sketch">
        <P5Sketch />
      </div>
    </div>
  )
}

export default Canvas;