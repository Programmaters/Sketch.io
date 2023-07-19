function Canvas() {
    function changePixelColor(x, y){
        const cvs = document.getElementById("drawCanvas")
        const ctx = cvs.getContext("2d")
        ctx.fillStyle = "green"
        ctx.fillRect(x, y, 2, 2)
    }
    function onDraw(event) {
        if (event.which == 1) {
            const yCoord = event.y
            const xCoord = event.x
            changePixelColor(xCoord, yCoord)
        }
    }
    return (
        <div className="Canvas">
            <canvas
                id="drawCanvas"
                width="1280"
                height="720"
                style={{ 'background-color': 'burlywood' }}
                onMouseMove={(mouse) =>{onDraw(mouse.nativeEvent)}}
            >
            </canvas>
        </div>
    );
}

export default Canvas;
