let imageData

function fillAction(x, y, color, dfs) {
    
    begin = drawingContext.getImageData(0, 0, 800, 600);
    imageData = drawingContext.getImageData(0, 0, 800, 600);
    filler(x, y, color, dfs);

    // test for checking if the imageData is the same as the begin imageData
    console.log(imageData.data === begin.data)
    drawingContext.putImageData(imageData, 0, 0); 

}

function filler(x, y, color, dfs) {
  console.log('filler')

  let fillStack = [];
    
  fillStack.push([x, y]);
  
  while (fillStack.length > 0) {
    let [x, y] = dfs ? fillStack.pop() : fillStack.shift();
      
    if (!valid(x, y))
      continue;
          
    if (isPixel(x, y))
      continue;
          
    setPixel(x, y, color);
      
    fillStack.push([x, y + 1]);
    fillStack.push([x, y - 1]);
    fillStack.push([x - 1, y]);
    fillStack.push([x + 1, y]);
  }
}

function setPixel(x, y, color) {
  let pixels = imageData.data;
  
  let i = (y * width + x) * 4;
  
  pixels[i] = color[0];    // R
  pixels[i + 1] = color[1];  // G
  pixels[i + 2] = color[2];  // B
  pixels[i + 3] = color[3]; // A
}

function isPixel(x, y) {
  let pixels = imageData.data;

  let i = (y * width + x) * 4;
  
  return pixels[i + 3] > 0;
}

function valid(x, y) {
  return x >= 0 && x <= width - 1 &&
          y >= 0 && y <= height - 1;
}
