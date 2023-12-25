import React, {useEffect, useRef, useState} from 'react';
import p5 from 'p5';
import Sketch from "react-p5";
import {socket} from "../../../socket/socket";
import DrawTools, {DrawMode, DrawOptions} from "./components/DrawTools";
import useSocketListeners from "../../../socket/useSocketListeners";
import DrawCursor from "./components/DrawCursor";
import './Canvas.css';
import {useGame} from "../../../contexts/GameContext";

type DrawData = { mode: DrawMode, x: number, y: number, px: number, py: number, color: string, size: number }

const WIDTH = 600
const HEIGHT = 400
const EASING = 0.3

function Canvas() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);
  const [mouseInCanvas, setMouseInCanvas] = useState(false);
  const [drawOptions, setDrawOptions] = useState<DrawOptions>({color: 'black', size: 5, mode: 'draw'});
  const [isDrawing, setIsDrawing] = useState(true);
  const [absoluteX, setAbsoluteX] = useState(0);
  const [absoluteY, setAbsoluteY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {p5, setP5} = useGame();

  function setup(p5: p5, canvasParentRef: Element) {
    p5.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef);
    p5.background(255);
    canvasRef.current = canvasParentRef as HTMLCanvasElement;
    setP5(p5);
  }

  function handleMouseMove(e: p5) {
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
    if (e.mouseX >= 0 && e.mouseX <= WIDTH! && e.mouseY >= 0 && e.mouseY <= HEIGHT) {
      handleMouseIn();
    } else {
      handleMouseOut();
    }
  }

  function mouseDragged(e: p5) {
    // if(!drawMode) return
    // if (!mouseInCanvas || (!['draw', 'erase'].includes(drawMode))) return
    setX(x + (e.mouseX - x) * EASING);
    setY(y + (e.mouseY - y) * EASING);
    setPx(x)
    setPy(y)
    drawAction()
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

  function mousePressed() {}
  function mouseReleased() {}

  function drawLine(data: DrawData) {
    console.log('drawing line')
    p5?.stroke(data.color)
    p5?.strokeWeight(data.size)
    p5?.line(data.x, data.y, data.px, data.py)
  }

  function clearCanvas() {
    p5?.background(255)
  }

  function onCanvasData(data: DrawData[]) {
    clearCanvas()
    data.forEach(drawLine)
  }

  function updateAbsoluteCoordinates() {
    const { top, left } = canvasRef.current?.getBoundingClientRect()!;
    setAbsoluteX(left + x)
    setAbsoluteY(top + y)
  }

  const socketListeners = {
    'drawingAction': drawLine,
    'canvasData': onCanvasData,
    'clearCanvas': clearCanvas,
  }
  useSocketListeners(socketListeners)

  return (
    <div className="Canvas">
      <Sketch
        setup={setup}
        mouseMoved={handleMouseMove}
        mouseDragged={mouseDragged}
        mousePressed={mousePressed}
        mouseReleased={mouseReleased}
      />
      {isDrawing &&
          <>
              <DrawCursor x={absoluteX} y = {absoluteY} options={drawOptions} enabled={mouseInCanvas}/>
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
