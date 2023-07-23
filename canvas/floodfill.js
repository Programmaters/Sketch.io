function floodFill1(seed, fillColor) {
  loadPixels();

  index = 4 * (width * seed.y + seed.x);
  seedColor = [
    pixels[index],
    pixels[index + 1],
    pixels[index + 2],
    pixels[index + 3],
  ];

  let queue = [];
  queue.push(seed);

  for (let i = 0; i < queue.length; i += 4) {
    let current = queue[i];

    let color = [
      pixels[i],
      pixels[i + 1],
      pixels[i + 2],
      pixels[i + 3],
    ];

    if (!arrayEquals(color, seedColor)) {
      continue;
    }

    for (let j = 0; j < 4; j++) {
      pixels[i+j] = fillColor[j];
    }
    
    queue = expandToNeighbours(queue, current)  // cheira me que seja aqui o erro ass: Diogo
  }
  
  updatePixels()
}


function paintScreenByIteratingOverEveryPixel(targetColor) {
  loadPixels()

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4
      pixels[index] = parseInt(targetColor[0]) // red 
      pixels[index + 1] = parseInt(targetColor[1]) // green
      pixels[index + 2] = parseInt(targetColor[2]) // blue
      pixels[index + 3] = 255
    }
  }

  updatePixels()
}


function floodFill2(posX, posY, targetColor) {
  loadPixels()

  const stack = []
  const r = parseInt(targetColor[0])
  const g = parseInt(targetColor[1])
  const b = parseInt(targetColor[2])
  
  // helper function to check if two colors are the same
  function colorsMatch(x, y) {
    const index = (x + y * width) * 4
    const red = pixels[index]
    const green = pixels[index + 1]
    const blue = pixels[index + 2]
    return r === red && g === green && b === blue
  }
  
  // Check if the initial position is within the canvas boundaries
  if (posX >= 0 && posX < width && posY >= 0 && posY < height) {
    stack.push({ x: posX, y: posY })
  }

  while (stack.length > 0) {
    const { x, y } = stack.pop()
    
    // check if the current pixel is the same color as the targetColor
    if (colorsMatch(x, y)) {
      const index = (x + y * width) * 4
      pixels[index] = r
      pixels[index + 1] = g
      pixels[index + 2] = b
      pixels[index + 3] = 255

      // add adjacent pixels to the stack
      if (x + 1 < width) stack.push({ x: x + 1, y })
      if (x - 1 >= 0) stack.push({ x: x - 1, y })
      if (y + 1 < height) stack.push({ x, y: y + 1 })
      if (y - 1 >= 0) stack.push({ x, y: y - 1 })
    }
  }
  updatePixels()
}
