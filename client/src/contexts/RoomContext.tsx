import * as React from 'react';
import { useState, createContext, useContext } from 'react';
import {Player} from "../domain/Player";
import {Room} from "../domain/Room";

type RoomContextType = {
  room: Room | undefined,
  joinRoom: (players: Player[], roomId: string) => void,
  leaveRoom: () => void,
  addPlayer: (player: Player) => void,
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
  const [room, setRoom] = useState<Room>()

  function joinRoom(players: Player[], id: string) {
    setRoom({id, players});
  }

  function leaveRoom() {
    setRoom(undefined);
  }

  function addPlayer(player: Player) {
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
