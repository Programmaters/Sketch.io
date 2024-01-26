import * as React from 'react';
import {useState, createContext, useContext} from 'react';
import {useRoom} from "./RoomContext";
import {GameConfigType} from "../domain/GameConfigType";
import {socket} from "../socket/socket";
import useSocketListeners from "../socket/useSocketListeners";
import {ScoresType} from "../domain/ScoresType";
import {PlayerType} from "../domain/PlayerType";
import {spaceLetters} from "../utils/Utils";

type NewTurnType = { word: string, round: number }
type EndTurnType = { word: string, scores: ScoresType }

const defaultGameConfig: GameConfigType = {
  maxPlayers: 8,
  language: 'English',
  drawTime: 60,
  rounds: 3,
  wordCount: 3,
  hints: 2,
}

type GameContextType = {
  round: number;
  word: string;
  gameState: string,
  gameConfig: GameConfigType,
  setGameConfig: (config: GameConfigType) => void,
  startGame: () => void,
  isInGame: boolean,
  isDrawing: boolean,
  timer: number,
  setWord: (word: string) => void,
  scores: ScoresType,
};

const GameContext = createContext<GameContextType>({
  round: 1,
  word: '',
  gameState: '',
  gameConfig: defaultGameConfig,
  setGameConfig: () => {},
  startGame: () => {},
  isInGame: false,
  isDrawing: false,
  timer: 0,
  setWord: () => {},
  scores: {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [word, setWord] = useState('');
  const [round, setRound] = useState(1);
  const [gameConfig, setGameConfig] = useState<GameConfigType>(defaultGameConfig);
  const [isInGame, setIsInGame] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameState, setGameState] = useState('Waiting to start...');
  const [scores, setScores] = useState<ScoresType>({});
  const room = useRoom();

  function updateGameConfig(data: {gameConfig: GameConfigType}) {
    setGameConfig(data.gameConfig);
  }

  function startGame() {
    if (!room) throw new Error('Room is undefined');
    if (!gameConfig) throw new Error('Game config is undefined');
    setIsInGame(true);
    socket.emit('startGame');
  }

  function onDrawTurn({word, round}: NewTurnType) {
    setWord(word)
    setRound(round)
    setIsDrawing(true)
    setTimer(gameConfig.drawTime)
    setGameState('Draw this: ' + word)
  }

  function onGuessTurn({word, round}: NewTurnType) {
    setWord(word)
    setRound(round)
    setIsDrawing(false)
    setTimer(gameConfig.drawTime)
    setGameState('Guess this:  ' + spaceLetters(word))
  }

  function onPlayerGuessed({player, score}: {player: PlayerType, score: number}) {
    setScores({...scores, [player.id]: score})
  }

  function onShowHint({hint}: {hint: string}) {
    setGameState('Guess this:  ' + spaceLetters(hint))
  }

  function onCorrectGuess({word}: {word: string}) {
    setGameState('Guess this:  ' + word)
  }

  function onEndTurn({word, scores}: EndTurnType) {
    setIsDrawing(false)
    setTimer(0)
    setGameState('The word was:  ' + word)
    setScores(scores)
  }

  function onEndRound () {
    setRound(prev => prev + 1)
  }

  useSocketListeners({
    'updateGameConfig': updateGameConfig,
    'gameStarted': startGame,
    'drawTurn': onDrawTurn,
    'guessTurn': onGuessTurn,
    'playerGuessed': onPlayerGuessed,
    'showHint': onShowHint,
    'endTurn': onEndTurn,
    'endRound': onEndRound,
    'correctGuess': onCorrectGuess
  });

  return (
    <GameContext.Provider value={{
      word, round, gameConfig, setGameConfig, isInGame,
      startGame, isDrawing, timer, gameState, setWord, scores
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  return useContext(GameContext);
}
