import React, {useRef, useState} from 'react';
import p5 from 'p5';
import Sketch from "react-p5";
import {socket} from "../../socket/socket";
import useSocketListeners from "../../socket/useSocketListeners";
import DrawTools, {DrawMode, DrawOptions} from "./components/DrawTools";
import DrawCursor from "./components/DrawCursor";
import floodFill from "./floodfill";
import './Canvas.css';
import {useGame} from "../../contexts/GameContext";

type DrawData = { mode: DrawMode, x: number, y: number, px: number, py: number, color: string, size: number }

const WIDTH = 600
const HEIGHT = 400
const EASING = 0.3
const WHEEL_SENSITIVITY = 15

function Canvas() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);
  const [mouseInCanvas, setMouseInCanvas] = useState(false);
  const [drawOptions, setDrawOptions] = useState<DrawOptions>({color: 'black', size: 5, mode: 'draw'});
  const {isDrawing} = useGame();
  const [absoluteX, setAbsoluteX] = useState(0);
  const [absoluteY, setAbsoluteY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const p5Ref = useRef<p5 | null>(null);



  function setup(p5: p5, canvasParentRef: Element) {
    p5.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef);
    p5.pixelDensity(1);
    p5.background(255);
    canvasRef.current = canvasParentRef as HTMLCanvasElement;
    p5Ref.current = p5;
    document.getElementById('save-button')!.onclick = () => {
      p5.saveCanvas('canvas', 'png')
    }
  }

  function handleMouseMove(e: p5) {
    if (!isDrawing) return
    setX(e.mouseX);
    setY(e.mouseY);
    setPx(x)
    setPy(y)

    const handleMouseIn = () => {
      setMouseInCanvas(true);
      updateAbsoluteCoordinates()
    };
    const handleMouseOut = () => {
      setMouseInCanvas(false);
    }
    if (e.mouseX >= 0 && e.mouseX <= WIDTH && e.mouseY >= 0 && e.mouseY <= HEIGHT) {
      handleMouseIn();
    } else {
      handleMouseOut();
    }
  }

  function mouseDragged(e: p5) {
    if (!isDrawing) return
    setX(x + (e.mouseX - x) * EASING);
    setY(y + (e.mouseY - y) * EASING);
    setPx(x)
    setPy(y)
    if (drawOptions.mode === 'draw') drawAction()
    updateAbsoluteCoordinates()
    if (e.mouseX >= 0 && e.mouseX <= WIDTH && e.mouseY >= 0 && e.mouseY <= HEIGHT) {
      setMouseInCanvas(true);
    } else {
      setMouseInCanvas(false);
    }
  }

  function drawAction() {
    const data = { x, y, px, py, ...drawOptions }
    drawLine(data)
    socket.emit('drawingAction', data)
  }

  function mousePressed() {
    if (!mouseInCanvas || !isDrawing) return
    switch (drawOptions.mode) {
      case 'draw':
        drawAction()
        break
      case 'picker':
        const color = `rgba(${p5Ref.current!.get(x, y)})`
        setDrawOptions({ ...drawOptions, color, mode: 'draw' })
        break
      case 'fill':
        const data = { mode: 'fill', x, y, color: drawOptions.color }
        floodFill(p5Ref.current!, x, y, drawOptions.color, WIDTH, HEIGHT)
        socket.emit('drawingAction', data)
        break
    }
  }
  function mouseReleased() {
    if (!isDrawing) return
    if (mouseInCanvas) {
      socket.emit('mouseReleased')
    }
  }

  function drawLine(data: DrawData) {
    p5Ref.current!.stroke(data.color)
    p5Ref.current!.strokeWeight(data.size)
    p5Ref.current!.line(data.x, data.y, data.px, data.py)
  }

  function clearCanvas() {
    p5Ref.current!.background(255)
  }

  function onDrawingAction(data: DrawData) {
    switch (data.mode) {
      case 'draw':
        drawLine(data)
        break
      case 'fill':
        const {x, y, color} = data
        floodFill(p5Ref.current!, x, y, color, WIDTH, HEIGHT)
        break
    }
  }

  function onCanvasData(data: DrawData[]) {
    clearCanvas()
    data.forEach(onDrawingAction)
  }

  function updateAbsoluteCoordinates() {
    const { top, left } = canvasRef.current?.getBoundingClientRect()!;
    setAbsoluteX(left + x)
    setAbsoluteY(top + y)
  }

  function handleWheel(e: React.WheelEvent) {
    const newSize = drawOptions.size - e.deltaY / WHEEL_SENSITIVITY;
    setDrawOptions({ ...drawOptions, size: Math.max(1, Math.min(100, newSize)) });
  }

  useSocketListeners({
    'drawingAction': onDrawingAction,
    'canvasData': onCanvasData,
    'clearCanvas': clearCanvas,
  })

  return (
    <div className="Canvas" onWheel={handleWheel}>
      <Sketch
        setup={setup}
        mouseMoved={handleMouseMove}
        mouseDragged={mouseDragged}
        mousePressed={mousePressed}
        mouseReleased={mouseReleased}
      />
      {isDrawing &&
          <>
              <DrawCursor x={absoluteX} y={absoluteY} options={drawOptions} enabled={mouseInCanvas}/>
              <DrawTools
                  drawOptions={drawOptions}
                  setDrawOptions={setDrawOptions}
                  clearCanvas={() => {
                    clearCanvas()
                    socket.emit('clearCanvas')
                  }}
              />
          </>
      }
    </div>
  );
}

export default Canvas;
