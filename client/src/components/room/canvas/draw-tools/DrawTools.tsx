import React from 'react';
import {socket} from "../../../../socket/socket";

export type DrawMode = 'draw' | 'erase' | 'picker' | 'fill' | null;

export type DrawOptions = {
  color: string;
  size: number;
  mode: DrawMode;
};

type DrawToolsProps = {
  drawOptions: DrawOptions;
  setDrawOptions: (options: DrawOptions) => void;
};

function DrawTools({ drawOptions, setDrawOptions }: DrawToolsProps) {
  const colors = ['black', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'brown', 'pink', 'white'];
  return (
    <div>
      {/*<div id="draw-cursor" style={{ backgroundColor: drawOptions.color }}></div>*/}
      <button id="erase-button" onClick={() => setDrawOptions({ ...drawOptions, mode: 'erase' })}>Erase</button>
      <button id="clear-button" onClick={() => socket.emit('clearCanvas')}>Clear</button>
      <button id="undo-button" onClick={() => socket.emit('undo')}>Undo</button>
      <button id="color-picker-button" onClick={() => setDrawOptions({ ...drawOptions, mode: 'picker' })}>Color Picker</button>
      <button id="fill-button" onClick={() => setDrawOptions({ ...drawOptions, mode: 'fill' })}>Fill</button>
      <button id="save-button" onClick={saveDraw}>Save</button>
      <input
        id="brush-size"
        type="range"
        min="1"
        max="100"
        value={drawOptions.size}
        onChange={(e) => setDrawOptions({ ...drawOptions, size: Number(e.target.value) })}
      />
      <div className="ColorPallete">
        {colors.map(color => (
          <div
            key={color}
            className="color-option"
            style={{ backgroundColor: color }}
            onClick={() => {
              setDrawOptions({ ...drawOptions, mode: 'draw', color });
            }}
          ></div>
        ))}
      </div>
      <button id="hint-button" onClick={() => socket.emit('hint')}>Hint</button>
      <button id="skip-button" onClick={() => socket.emit('skipTurn')}>Skip Turn</button>
    </div>
  );
}

export default DrawTools;
