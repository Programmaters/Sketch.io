import p5 from "p5";

function floodFill(p5: p5, x: number, y: number, fillColor: string, width: number, height: number) {
  const color = (p5.color(fillColor) as any).levels
  p5.loadPixels()
  const initColor = p5.get(x, y)
  if (color.toString() === initColor.toString()) return

  const stack = []
  stack.push([x, y])
  while (stack.length > 0) {
    const [fx, fy] = (stack.shift() as number[]).map(Math.round) as number[]
    if (!isValid(fx, fy)) continue
    if (!isPixel(fx, fy, initColor)) continue

    setPixel(fx, fy, color)
    stack.push([fx, fy + 1])
    stack.push([fx, fy - 1])
    stack.push([fx - 1, fy])
    stack.push([fx + 1, fy])
  }
  p5.updatePixels()


  function setPixel(fx: number, fy: number, fillColor: number[]) {
    const i = getIndex(fx, fy)
    p5.pixels[i] = fillColor[0] // r
    p5.pixels[i + 1] = fillColor[1] // g
    p5.pixels[i + 2] = fillColor[2] // b
    p5.pixels[i + 3] = 255 // a
  }

  function isPixel(fx: number, fy: number, srcColor: number[]) {
    const i = getIndex(fx, fy)
    return p5.pixels[i] === srcColor[0] && p5.pixels[i + 1] === srcColor[1] && p5.pixels[i + 2] === srcColor[2]
  }

  function isValid(fx: number, fy: number) {
    return fx >= 0 && fx <= width - 1 && fy >= 0 && fy <= height - 1
  }

  function getIndex(fx: number, fy: number) {
    return (fy * width + fx) * 4
  }
}

export default floodFill