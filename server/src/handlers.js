import { onMessage } from './chat/chat-events.js'
import { onDrawingAction, onClearCanvas, onMouseReleased, onUndo } from './draw/draw-events.js'
import { onNewLobby, onStartGame } from './game/game-events.js'

export default {
    'drawingAction': onDrawingAction,
    'clearCanvas': onClearCanvas,
    'mouseReleased': onMouseReleased,
    'undo': onUndo,
    'message': onMessage,
    'newLobby': onNewLobby,
    'startGame': onStartGame,
}
