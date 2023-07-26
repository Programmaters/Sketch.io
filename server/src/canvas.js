const maxUndos = 10

/**
 * @class Canvas
 * @description Stores the canvas data
 */
class Canvas {
    canvasData = []
    canvasTimeline = []
    prevCanvasData = []

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
        this.canvasData = this.canvasTimeline.length != 0 ? [...this.canvasTimeline.pop()] : this.canvasData
        this.prevCanvasData = [...this.canvasData]
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
        if (this.prevCanvasData) this.canvasTimeline.push(this.prevCanvasData)
        this.prevCanvasData = [...this.canvasData]
        if (this.canvasTimeline.length > maxUndos) this.canvasTimeline.shift()
    }

    /**
     * Get the canvas data
     */
    getCanvasData() {
        return this.canvasData
    }
}