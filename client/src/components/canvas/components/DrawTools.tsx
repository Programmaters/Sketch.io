import React from 'react';
import {socket} from "../../../socket/socket";

const colors = [
  'white', 'darkgrey', 'red', 'orange', 'yellow', 'lime', 'cyan', 'blueviolet', 'deeppink', 'saddlebrown',
  'lightgrey', 'black', 'darkred', 'darkorange', 'gold', 'green', 'blue', 'purple', 'pink', 'brown'
]

export type DrawMode = 'draw' | 'picker' | 'fill';

export type DrawOptions = {
  color: string;
  size: number;
  mode: DrawMode;
};

type DrawToolsProps = {
  drawOptions: DrawOptions;
  setDrawOptions: (options: DrawOptions) => void;
  clearCanvas: () => void;
};

function DrawTools({ drawOptions, setDrawOptions, clearCanvas }: DrawToolsProps) {

  function setDraw() {
    setDrawOptions({ ...drawOptions, mode: 'draw' });
  }

  function setEraser() {
    setDrawOptions({ ...drawOptions, mode: 'draw', color: 'white' });
  }

  function setColor(color: string) {
    setDrawOptions({ ...drawOptions, color });
  }

  function undo() {
    socket.emit('undo');
  }

  function setColorPicker() {
    setDrawOptions({ ...drawOptions, mode: 'picker' });
  }

  function setFill() {
    setDrawOptions({ ...drawOptions, mode: 'fill' });
  }

  function setBrushSize(e: React.ChangeEvent<HTMLInputElement>) {
    setDrawOptions({ ...drawOptions, size: Number(e.target.value) });
  }

  return (
    <div className="DrawTools">
      <div className="ColorPalette">
        {colors.map(color => (
          <div
            key={color}
            className="color-option"
            style={{ backgroundColor: color }}
            onClick={() => setColor(color)}
          ></div>
        ))}
      </div>
      <button className="fa fa-paint-brush" onClick={setDraw}></button>
      <button className="fa fa-eraser" onClick={setEraser}></button>
      <button className="fa fa-trash" onClick={clearCanvas}></button>
      <button className="fa fa-undo" onClick={undo}></button>
      <button className="fa fa-eye-dropper" onClick={setColorPicker}></button>
      <button className="fa fa-fill" onClick={setFill}></button>
      <input id="brush-size" type="range" min="1" max="100" value={drawOptions.size} onChange={setBrushSize}/>
    </div>
  );
}

export default DrawTools;
