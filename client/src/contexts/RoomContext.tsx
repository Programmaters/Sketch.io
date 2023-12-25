import * as React from 'react';
import { useState, createContext, useContext } from 'react';
import {PlayerType} from "../domain/PlayerType";
import {RoomType} from "../domain/RoomType";

type RoomContextType = {
  room: RoomType | undefined,
  joinRoom: (players: PlayerType[], roomId: string) => void,
  leaveRoom: () => void,
  addPlayer: (player: PlayerType) => void,
  removePlayer: (playerId: string) => void,
  setRoomId: (id?: string) => void,
  isInRoom: () => boolean,
};

const RoomContext = createContext<RoomContextType>({
  room: undefined,
  joinRoom: () => {},
  leaveRoom: () => {},
  addPlayer: () => {},
  removePlayer: () => {},
  setRoomId: () => {},
  isInRoom: () => false,
});

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [room, setRoom] = useState<RoomType>()

  function joinRoom(players: PlayerType[], id: string) {
    setRoom({id, players});
  }

  function leaveRoom() {
    setRoom(undefined);
  }

  function addPlayer(player: PlayerType) {
    if (!room) throw new Error('Player not in room');
    const players =  [...room.players, player]
    setRoom({...room, players});
  }

  function removePlayer(playerId: string) {
    if (!room) throw new Error('Player not in room');
    const players = room.players.filter(player => player.id !== playerId);
    setRoom({...room, players});
  }

  function setRoomId(id?: string) {
    setRoom({id, players: room?.players || []});
  }

  function isInRoom() {
    return !!room;
  }

  return (
    <RoomContext.Provider value={{room, joinRoom, leaveRoom, addPlayer, removePlayer, setRoomId, isInRoom}}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom(): RoomContextType {
  return useContext(RoomContext);
}
