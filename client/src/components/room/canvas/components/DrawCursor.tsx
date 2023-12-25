import {DrawMode, DrawOptions} from "./DrawTools";

type DrawCursorProps = {
  x: number,
  y: number,
  options: DrawOptions,
  enabled: boolean,
}

function DrawCursor({x, y, options, enabled}: DrawCursorProps) {
  if (!enabled) return null;
  return (
    <div
      className="DrawCursor"
      style={{
        top: y - options.size / 2,
        left: x - options.size / 2,
        width: options.size,
        height: options.size,
        backgroundColor: options.color,
      }}
    />
  );
}

export default DrawCursor;