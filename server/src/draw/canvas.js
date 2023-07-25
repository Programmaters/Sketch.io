const maxUndos = 10

/**
 * @class Canvas
 * @description Stores the canvas data for a round
 */
class Canvas {
    #canvasData = []
    #canvasTimeline = []
    #prevCanvasData = []

    /**
     * Draws on the canvas
     * @param {Object} data 
     */
    draw(data) {
        this.canvasData.push(data)
    }

    /**
     * Undos the last action from the canvas
     */
    undo() {
        canvasData = canvasTimeline.length != 0 ? [...canvasTimeline.pop()] : canvasData
        prevCanvasData = [...canvasData]
    }

    /**
     * Clears the canvas
     */
    clear() {
        this.canvasData = []
        this.canvasTimeline.push([...this.canvasData])
    }

    /**
     * Saves a copy of the canvas in the timeline
     */
    save() {
        if (prevCanvasData) canvasTimeline.push(prevCanvasData)
        prevCanvasData = [...canvasData]
        if (canvasTimeline.length > maxUndos) canvasTimeline.shift()
    }

    /**
     * Get the canvas data
     */
    getCanvasData() {
        return this.canvasData
    }
}