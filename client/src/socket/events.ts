import {socket} from "./socket";

export const Events = {
  MESSAGE: 'message',
  JOIN_ROOM: 'joinRoom',
  PLAYER_JOINED_ROOM: 'playerJoinedRoom',
  PLAYER_LEFT_ROOM: 'playerLeftRoom',
  UPDATE_SETTINGS: 'updateSettings',
  DRAWING_ACTION: 'drawingAction',
  CANVAS_DATA: 'canvasData',
  CLEAR_CANVAS: 'clearCanvas',
  SHOW_HINT: 'showHint',
  GAME_STARTED: 'gameStarted',
  DRAW_TURN: 'drawTurn',
  GUESS_TURN: 'guessTurn',
  END_TURN: 'endTurn',
  ROUND_END: 'roundEnd',
  END_GAME: 'endGame',
  CORRECT_GUESS: 'correctGuess',
  CLOSE_GUESS: 'closeGuess',
  PLAYER_GUESSED: 'playerGuessed',
  DISCONNECT: 'disconnect'
} as const;

