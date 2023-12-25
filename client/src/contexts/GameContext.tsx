import * as React from 'react';
import p5 from 'p5';
import { useState, createContext, useContext } from 'react';
import {GameType} from "../domain/GameType";
import {useRoom} from "./RoomContext";

type GameContextType = {
  game: GameType | undefined,
  isInGame: () => boolean,
  startGame: (game: GameType) => void,
  p5: p5 | null,
  setP5: (p5: p5) => void,
};

const GameContext = createContext<GameContextType>({
  game: undefined,
  isInGame: () => false,
  startGame: () => {},
  p5: null,
  setP5: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameType>()
  const [p5, setP5] = useState<p5 | null>(null);
  const room = useRoom();

  function isInGame() {
    // return !!game;
    return true;
  }

  function startGame(g: GameType) {
    if (!room) throw new Error('Room is undefined');
    setGame(g);
  }

  return (
    <GameContext.Provider value={{game, isInGame, startGame, p5, setP5}}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  return useContext(GameContext);
}

