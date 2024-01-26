import * as React from 'react';
import {useState, createContext, useContext, useEffect} from 'react';
import {GameType} from "../domain/GameType";
import {useRoom} from "./RoomContext";
import {GameConfigType} from "../domain/GameConfigType";
import {socket} from "../socket/socket";
import useSocketListeners from "../socket/useSocketListeners";

type NewTurnType = { word: string, round: number }
type EndTurnType = { word: string, scores: number[] }

const defaultGameConfig: GameConfigType = {
  maxPlayers: 8,
  language: 'English',
  drawTime: 60,
  rounds: 3,
  wordCount: 3,
  hints: 2,
}

type GameContextType = {
  game?: GameType,
  gameState: string,
  gameConfig: GameConfigType,
  setGameConfig: (config: GameConfigType) => void,
  isInGame: () => boolean,
  startGame: () => void,
  isDrawing: boolean,
  timer: number,
  setWord: (word: string) => void,
};

const GameContext = createContext<GameContextType>({
  game: undefined,
  gameState: '',
  gameConfig: defaultGameConfig,
  setGameConfig: () => {},
  isInGame: () => false,
  startGame: () => {},
  isDrawing: false,
  timer: 0,
  setWord: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameType>();
  const [gameConfig, setGameConfig] = useState<GameConfigType>(defaultGameConfig);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameState, setGameState] = useState('Waiting to start...');
  const room = useRoom();

  function updateGameConfig(data: {gameConfig: GameConfigType}) {
    setGameConfig(data.gameConfig);
  }

  function isInGame() {
    return game !== undefined;
  }

  function startGame() {
    if (!room) throw new Error('Room is undefined');
    if (!gameConfig) throw new Error('Game config is undefined');
    socket.emit('startGame');
  }


  function onDrawTurn ({word, round}: NewTurnType) {
    setGame({...game, word, round, state: 'drawing' } as GameType)
    setIsDrawing(true)
    setTimer(gameConfig!.drawTime)
    setGameState('Draw this: ' + word)
  }

  function onGuessTurn ({word, round}: NewTurnType) {
    setGame({...game, word, round, state: 'guessing' } as GameType)
    setIsDrawing(false)
    setTimer(gameConfig!.drawTime)
    setGameState('Guess this: ' + word)
  }

  function onEndTurn ({word, scores}: EndTurnType) {
    setGame({...game, word } as GameType)
    setIsDrawing(false)
    setTimer(0)
    setGameState('Turn ended')
  }

  function onEndRound () {
    setGameState('Round ended')
  }

  function setWord(word: string) {
    setGame({...game, word } as GameType)
  }

  const eventHandlers = {
    'updateGameConfig': updateGameConfig,
    'gameStarted': startGame,
    'drawTurn': onDrawTurn,
    'guessTurn': onGuessTurn,
    'endTurn': onEndTurn,
    'endRound': onEndRound,
  };
  useSocketListeners(eventHandlers);

  return (
    <GameContext.Provider value={{game, gameConfig, setGameConfig, isInGame, startGame, isDrawing, timer, gameState, setWord}}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  return useContext(GameContext);
}
