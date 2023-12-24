import * as React from 'react';
import p5 from 'p5';
import { useState, createContext, useContext } from 'react';
import {Game} from "../domain/Game";
import {useRoom} from "./RoomContext";

type GameContextType = {
  game: Game | undefined,
  isInGame: () => boolean,
  startGame: (game: Game) => void,
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
  const [game, setGame] = useState<Game>()
  const [p5, setP5] = useState<p5 | null>(null);
  const room = useRoom();

  function isInGame() {
    // return !!game;
    return true;
  }

  function startGame(g: Game) {
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

