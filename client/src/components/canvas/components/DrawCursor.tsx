import {DrawOptions} from "./DrawTools";

type DrawCursorProps = {
  x: number,
  y: number,
  options: DrawOptions,
  enabled: boolean,
}

function DrawCursor({x, y, options, enabled}: DrawCursorProps) {
  if (!enabled) return null;
  const drawModeStyle = {
    top: y - options.size / 2,
    left: x - options.size / 2,
    width: options.size,
    height: options.size,
    backgroundColor: options.color,
    border: '1px solid grey',
  };
  const colorPickerStyle = {
    ...drawModeStyle,
    top: drawModeStyle.top - 15,
    width: '5px',
    height: '5px',
    backgroundColor: 'transparent',
    border: 'none',
    textShadow: '0 0 0 #fff'
  };
  const fillStyle = {
    ...colorPickerStyle,
    top: drawModeStyle.top,
    left: drawModeStyle.left,
  }
  const styles = {
    'draw': drawModeStyle,
    'picker': colorPickerStyle,
    'fill': fillStyle,
  }
  const classNames = {
    'draw': '',
    'picker': 'fa fa-eye-dropper',
    'fill': 'fa fa-fill',
  }
  return (
    <div
      className={`DrawCursor ${classNames[options.mode]}`}
      style={styles[options.mode]}
    />
  );
}

export default DrawCursor;