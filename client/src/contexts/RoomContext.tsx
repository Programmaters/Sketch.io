import * as React from 'react';
import {useState, createContext, useContext} from 'react';
import {PlayerType} from "../domain/PlayerType";
import useSocketListeners from "../socket/useSocketListeners";
import {socket} from "../socket/socket";

type RoomContextType = {
  roomId?: string,
  players: PlayerType[],
  isInRoom: boolean,
  joinRoom: (players: PlayerType[], roomId: string, host?: string) => void,
  leaveRoom: () => void,
  setRoomId: (id?: string) => void,
  host?: string,
  isHost: boolean,
};

const RoomContext = createContext<RoomContextType>({
  roomId: undefined,
  players: [],
  isInRoom: false,
  joinRoom: () => {},
  leaveRoom: () => {},
  setRoomId: () => {},
  host: undefined,
  isHost: false,
});

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [isInRoom, setIsInRoom] = useState(false);
  const [roomId, setRoomId] = useState<string>();
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [host, setHost] = useState<string>();

  function joinRoom(players: PlayerType[], roomId: string, host?: string) {
    setIsInRoom(true);
    setRoomId(roomId);
    setPlayers(players);
    setHost(host ?? socket.id);
    setIsHost(host === undefined);
  }

  function leaveRoom() {
    setRoomId(undefined);
    setIsInRoom(false);
  }

  function playerJoinedRoom(player: PlayerType) {
    setPlayers(players => [...players, player])
  }

  function playerLeftRoom({id}: PlayerType) {
    setPlayers(players => players.filter(player => player.id !== id))
  }

  function newHost({host}: {host: string}) {
    setHost(host);
    setIsHost(host === socket.id);
  }

  useSocketListeners({
    'playerJoinedRoom': playerJoinedRoom,
    'playerLeftRoom': playerLeftRoom,
    'newHost': newHost,
  });

  return (
    <RoomContext.Provider value={{roomId, players, isInRoom, joinRoom, leaveRoom, setRoomId, isHost, host}}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom(): RoomContextType {
  return useContext(RoomContext);
}
