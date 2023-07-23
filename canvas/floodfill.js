function arrayEquals(a, b) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
  }
  
  function expandToNeighbours(queue,current){
    
    x = current.x
    y = current.y
    
    if(x-1>0){
      queue.push(createVector(x-1,y))
    }
    
    if(x+1<width){
      queue.push(createVector(x+1,y))
    } 
    
    if(y-1>0){
      queue.push(createVector(x,y-1))
    }
    
    if(y+1<height){
      queue.push(createVector(x,y+1))
    }
    
    return queue
    
  }
  
  function floodFill(seed, fillColor) {
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