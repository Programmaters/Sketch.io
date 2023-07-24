function floodFill(fx, fy, fillColor){
  loadPixels()
  const stack = []
  const initColor = get(fx, fy)
  if (initColor.toString() === fillColor.toString()) return
  stack.push([fx, fy])
  
  while(stack.length > 0){
      const [fx, fy] = stack.shift()
      if (!isValid(fx, fy)) continue
      if (!isPixel(fx, fy, initColor)) continue

      setPixel(fx, fy, fillColor)

      stack.push([fx, fy + 1])
      stack.push([fx, fy - 1])
      stack.push([fx - 1, fy])
      stack.push([fx + 1, fy])
  }
  updatePixels()
}

function setPixel(fx, fy, fillColor){
  const i = getIndex(fx, fy)
  pixels[i] = fillColor[0] // r
  pixels[i + 1] = fillColor[1] // g
  pixels[i + 2] = fillColor[2] // b
  pixels[i + 3] = 255 // a
}

function isPixel(fx, fy, initColor) {
  const i = getIndex(fx, fy)
  return pixels[i] === initColor[0] && pixels[i + 1] === initColor[1] && pixels[i + 2] === initColor[2]
}

function isValid(fx, fy){
    return fx >= 0 && fx <= width - 1 && fy >= 0 && fy <= height - 1
}

function getIndex(fx, fy) {
  return (fy * width + fx) * 4
}