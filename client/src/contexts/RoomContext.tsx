import * as React from 'react';
import { useState, createContext, useContext } from 'react';
import {Player} from "../domain/Player";

type RoomContextType = {
  players: Player[],
  roomId: string,
  join: (players: Player[], roomId: string) => void,
  addPlayer: (player: Player) => void,
  removePlayer: (player: Player) => void,
};

const RoomContext = createContext<RoomContextType>({
  players: [],
  roomId: '',
  join: () => {},
  addPlayer: () => {},
  removePlayer: () => {},
});

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([])
  const [roomId, setRoomId] = useState<string>('')

  function join(players: Player[], roomId: string) {
    setPlayers(players);
    setRoomId(roomId);
  }

  function addPlayer(player: Player) {
    setPlayers([...players, player]);
  }

  function removePlayer(player: Player) {
    setPlayers(players.filter(p => p !== player));
  }

  return (
    <RoomContext.Provider value={{ players, roomId, join, addPlayer, removePlayer }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom(): RoomContextType {
  return useContext(RoomContext);
}