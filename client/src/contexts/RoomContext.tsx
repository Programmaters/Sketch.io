import * as React from 'react';
import {useState, createContext, useContext} from 'react';
import {PlayerType} from "../domain/PlayerType";
import useSocketListeners from "../socket/useSocketListeners";

type RoomContextType = {
  roomId?: string,
  players: PlayerType[],
  isInRoom: boolean,
  joinRoom: (players: PlayerType[], roomId: string) => void,
  leaveRoom: () => void,
  setRoomId: (id?: string) => void,
  isHost: boolean,
};

const RoomContext = createContext<RoomContextType>({
  roomId: undefined,
  players: [],
  isInRoom: false,
  joinRoom: () => {},
  leaveRoom: () => {},
  setRoomId: () => {},
  isHost: false,
});

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [isInRoom, setIsInRoom] = useState(false);
  const [roomId, setRoomId] = useState<string>();
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [isHost, setIsHost] = useState(false);

  function joinRoom(players: PlayerType[], id: string) {
    setIsInRoom(true);
    setRoomId(id);
    setPlayers(players);
    if (players.length === 1) setIsHost(true)
  }

  function leaveRoom() {
    setRoomId(undefined);
    setIsInRoom(false);
  }

  function playerJoinedRoom({player}: {player: PlayerType}) {
    setPlayers(players => [...players, player])
  }

  function playerLeftRoom({playerId}: {playerId: string}) {
    setPlayers(players => players.filter(player => player.id !== playerId))
  }

  useSocketListeners({
    'playerJoinedRoom': playerJoinedRoom,
    'playerLeftRoom': playerLeftRoom,
  });

  return (
    <RoomContext.Provider value={{roomId, players, isInRoom, joinRoom, leaveRoom, setRoomId, isHost}}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom(): RoomContextType {
  return useContext(RoomContext);
}
