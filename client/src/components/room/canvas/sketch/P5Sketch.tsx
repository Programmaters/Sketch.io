import React, {useEffect, useRef, useState} from 'react';
import p5 from 'p5';
import Sketch from "react-p5";
import {socket} from "../../../../socket/socket";
import DrawTools, {DrawMode, DrawOptions} from "../draw-tools/DrawTools";
import useSocketListeners from "../../../../socket/listeners";

type DrawData = { mode: DrawMode, x: number, y: number, px: number, py: number, color: string, size: number }

const WIDTH = 500
const HEIGHT = 350
const EASING = 0.3

function P5Sketch() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);
  const [mouseInCanvas, setMouseInCanvas] = useState(false);
  const [drawOptions, setDrawOptions] = useState<DrawOptions>({color: 'black', size: 5, mode: 'draw'});

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const p5Ref = useRef<p5 | null>(null);

  function setup(p5: p5, canvasParentRef: Element) {
    p5.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef);
    p5.background(255);
    canvasRef.current = canvasParentRef as HTMLCanvasElement;
    p5Ref.current = p5;
  }

  function handleMouseMove(e: p5) {
    setX(e.mouseX);
    setY(e.mouseY);

    const handleMouseIn = () => {
      setMouseInCanvas(true);
      setPx(e.mouseX);
      setPy(e.mouseY);
    };

    const handleMouseOut = () => {
      setMouseInCanvas(false);
    }

    const { left, right, top, bottom } = canvasRef.current?.getBoundingClientRect() || {};

    if (e.mouseX >= left! && e.mouseX <= right! && e.mouseY >= top! && e.mouseY <= bottom!) {
      handleMouseIn();
    } else {
      handleMouseOut();
    }
  }

  function mouseDragged(e: p5) {
    // if(!drawMode) return
    // if (!mouseInCanvas || (!['draw', 'erase'].includes(drawMode))) return
    setX(prev => prev + (e.mouseX - x) * EASING);
    setY(prev => prev + (e.mouseY - y) * EASING);
    drawAction()
    setPx(x)
    setPy(y)
  }

  function mousePressed(e: p5) {
    setX(e.mouseX)
    setY(e.mouseY)
    setPx(e.mouseX)
    setPy(e.mouseY)
  }

  function mouseReleased() {
    // Your mouseReleased logic here
  }

  function drawAction() {
    const { mode, color, size } = drawOptions;
    const data: DrawData = { mode, x, y, px, py, color, size }
    socket.emit('drawingAction', data)
    drawLine(data)
  }

  function drawLine(data: DrawData) {
    const p5 = p5Ref.current!
    p5.stroke(data.color)
    p5.strokeWeight(data.size)
    p5.line(data.x, data.y, data.px, data.py)
  }

  function clearCanvas(p5: p5) {
    p5.background(255)
  }

  function saveDraw(p5: p5) {
    p5.saveCanvas('canvas', 'png')
  }

  function onCanvasData(data: DrawData[]) {
    const p5 = p5Ref.current!
    clearCanvas(p5)
    data.forEach(drawLine)
  }

  const socketListeners = {
    'drawingAction': drawLine,
    'canvasData': onCanvasData,
  }

  useSocketListeners(socketListeners)

  return <Sketch
    setup={setup}
    mouseMoved={handleMouseMove}
    mouseDragged={mouseDragged}
    mousePressed={mousePressed}
    mouseReleased={mouseReleased}
  />
}

export default P5Sketch;
