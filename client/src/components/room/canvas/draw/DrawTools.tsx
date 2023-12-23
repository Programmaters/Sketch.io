import React from 'react';
import {socket} from "../../../../socket/socket";

const colors = [
  'white', 'darkgrey', 'red', 'orange', 'yellow', 'lime', 'cyan', 'blueviolet', 'deeppink', 'saddlebrown',
  'lightgrey', 'black', 'darkred', 'darkorange', 'gold', 'green', 'blue', 'purple', 'pink', 'brown'
]

export type DrawMode = 'draw' | 'erase' | 'picker' | 'fill' | null;

export type DrawOptions = {
  color: string;
  size: number;
  mode: DrawMode;
};

type DrawToolsProps = {
  drawOptions: DrawOptions;
  setDrawOptions: (options: DrawOptions) => void;
  saveDraw: () => void;
};

function DrawTools({ drawOptions, setDrawOptions, saveDraw }: DrawToolsProps) {
  return (
    <div className="DrawTools">
      <div id="color-palette">
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
      <button className="fa fa-eraser" onClick={() => setDrawOptions({ ...drawOptions, mode: 'erase' })}></button>
      <button className="fa fa-trash" onClick={() => socket.emit('clearCanvas')}></button>
      <button className="fa fa-undo" onClick={() => socket.emit('undo')}></button>
      <button className="fa fa-eye-dropper" onClick={() => setDrawOptions({ ...drawOptions, mode: 'picker' })}></button>
      <button className="fa fa-fill" onClick={() => setDrawOptions({ ...drawOptions, mode: 'fill' })}></button>
      <input
        id="brush-size"
        type="range"
        min="1"
        max="100"
        value={drawOptions.size}
        onChange={(e) => setDrawOptions({ ...drawOptions, size: Number(e.target.value) })}
      />
      {/*<button id="save-button" onClick={saveDraw}>Save</button>*/}
      {/*<button id="hint-button" onClick={() => socket.emit('hint')}>Hint</button>*/}
      {/*<button id="skip-button" onClick={() => socket.emit('skipTurn')}>Skip Turn</button>*/}
    </div>
  );
}

export default DrawTools;
