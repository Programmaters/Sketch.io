import * as React from 'react';
import { useState, createContext, useContext } from 'react';
import {Player} from "../domain/Player";
import {Room} from "../domain/Room";
import {Game} from "../domain/Game";
import {useRoom} from "./RoomContext";

type GameContextType = {
  game: Game | undefined,
  isInGame: () => boolean,
  startGame: (game: Game) => void,
};

const GameContext = createContext<GameContextType>({
  game: undefined,
  isInGame: () => false,
  startGame: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<Game>()
  const room = useRoom();

  function isInGame() {
    return !!game;
  }

  function startGame(g: Game) {
    if (!room) throw new Error('Room is undefined');
    setGame(g);
  }

  return (
    <GameContext.Provider value={{game, isInGame, startGame}}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  return useContext(GameContext);
}

