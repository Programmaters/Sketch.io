function floodFill(data) {
    const { x, y, color } = data
    loadPixels()
    const initColor = get(x, y)
    if (initColor.toString() === color.toString()) return

    const stack = []
    stack.push([x, y])
    while(stack.length > 0){
        const [fx, fy] = stack.shift()
        if (!isValid(fx, fy)) continue
        if (!isPixel(fx, fy, initColor)) continue

        setPixel(fx, fy, color)

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
