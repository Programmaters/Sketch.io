import * as React from 'react';
import {useState, createContext, useContext} from 'react';
import {useRoom} from "./RoomContext";
import {GameConfigType} from "../domain/GameConfigType";
import {socket} from "../socket/socket";
import useSocketListeners from "../socket/useSocketListeners";
import {ScoresType} from "../domain/ScoresType";
import {PlayerType} from "../domain/PlayerType";
import {spaceLetters} from "../utils/Utils";
import {useSession} from "./SessionContext";
import Player from "../components/players/player/Player";

type NewTurnType = { word: string, round: number, drawer: string }
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
  drawer?: string,
  turns: number,
  setWord: (word: string) => void,
  scores: ScoresType,
  playAgain: () => void,
};

const GameContext = createContext<GameContextType>({
  round: 1,
  word: '',
  gameState: '',
  gameConfig: defaultGameConfig,
  isInGame: false,
  isDrawing: false,
  timer: 0,
  scores: {},
  drawer: undefined,
  turns: 0,
  setGameConfig: () => {},
  startGame: () => {},
  setWord: () => {},
  playAgain: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [word, setWord] = useState('');
  const [round, setRound] = useState(1);
  const [gameConfig, setGameConfig] = useState<GameConfigType>(defaultGameConfig);
  const [isInGame, setIsInGame] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [turns, setTurns] = useState(0);
  const [gameState, setGameState] = useState('Waiting to start...');
  const [drawer, setDrawer] = useState<string>();
  const [scores, setScores] = useState<ScoresType>({});
  const {roomId, isHost} = useRoom();

  function updateGameConfig(data: {gameConfig: GameConfigType}) {
    setGameConfig(data.gameConfig);
  }

  function startGame() {
    if (!roomId) throw new Error('Room is undefined');
    if (!gameConfig) throw new Error('Game config is undefined');
    if (isHost) socket.emit('startGame');
    onGameStarted()
  }

  function playAgain() {
    setIsInGame(false)
    setRound(1)
    setScores({})
    setGameState('Waiting to start...')
  }

  function onGameStarted() {
    setIsInGame(true)
    setRound(1)
    setGameState('Waiting to start...')
  }

  function startTimer() {
    setGameConfig(current => {
      setTimer(current.drawTime)
      return current
    })
  }

  function onDrawTurn({word, round}: NewTurnType) {
    setWord(word)
    setRound(round)
    setIsDrawing(true)
    setDrawer(socket.id)
    setTurns(prev => prev + 1)
    startTimer()
    setGameState('Draw this: ' + word)

  }

  function onGuessTurn({word, round, drawer}: NewTurnType) {
    setWord(word)
    setRound(round)
    setDrawer(drawer)
    setIsDrawing(false)
    setTurns(prev => prev + 1)
    startTimer()
    setGameState('Guess this:  ' + spaceLetters(word))
  }

  function onShowHint({hint}: {hint: string}) {
    setGameState('Guess this:  ' + spaceLetters(hint))
  }

  function onCorrectGuess({word}: {word: string}) {
    setGameState('Guess this:  ' + word)
  }

  function onUpdateScore(newScores: ScoresType) {
    setScores(prev => ({...prev, ...newScores}))
  }

  function onEndTurn({word}: EndTurnType) {
    setIsDrawing(false)
    setTimer(0)
    setGameState('The word was:  ' + word)
  }

  function onEndRound() {
    setRound(prev => prev + 1)
  }

  function onEndGame() {
    setGameState('Game over!')
    setIsInGame(false)
  }

  function onDisconnect() {
    setIsInGame(false)
    setIsDrawing(false)
    setTimer(0)
    setGameState('Waiting to start...')
    setScores({})
  }

  useSocketListeners({
    'updateGameConfig': updateGameConfig,
    'gameStarted': onGameStarted,
    'drawTurn': onDrawTurn,
    'guessTurn': onGuessTurn,
    'showHint': onShowHint,
    'correctGuess': onCorrectGuess,
    'updateScore': onUpdateScore,
    'endTurn': onEndTurn,
    'endRound': onEndRound,
    'endGame': onEndGame,
    'disconnect': onDisconnect
  });

  return (
    <GameContext.Provider value={{
      word, round, gameConfig, setGameConfig, isInGame, playAgain,
      startGame, isDrawing, timer, gameState, setWord, scores, drawer, turns
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  return useContext(GameContext);
}
