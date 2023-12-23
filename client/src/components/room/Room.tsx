import React, {useEffect} from 'react';
import useSocketListeners from "../../socket/listeners";
import './Room.css';
import {useNavigate, useParams} from "react-router-dom";
import {useRoom} from "../../contexts/RoomContext";
import {Player} from "../../domain/Player";
import {socket} from "../../socket/socket";
import GameConfig from "../game-config/GameConfig";
import Players from "./players/Players";
import Chat from "./chat/Chat";
import {useGame} from "../../contexts/GameContext";
import Canvas from "./canvas/Canvas";
import GameState from "./game-state/GameState";

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const {joinRoom, leaveRoom, addPlayer, removePlayer, setRoomId, isInRoom} = useRoom();
  const {isInGame} = useGame();

  function playerJoinedRoom(data: {player: Player}) {
    addPlayer(data.player);
  }

  function playerLeftRoom(data: {playerId: string}) {
    removePlayer(data.playerId);
  }

  function onInvalidUserId() {
    navigate('/');
    alert('Could not join room');
  }

  const eventHandlers = {
    'joinedRoom': onJoinedRoom,
    'playerJoinedRoom': playerJoinedRoom,
    'invalidUserId': onInvalidUserId,
    'playerLeftRoom': playerLeftRoom,
    // 'updateSettings': updateSettings,
    // 'gameStarted': startGame,
  };
  useSocketListeners(eventHandlers);

  function onJoinedRoom(data: {players: Player[], roomId: string}) {
    joinRoom(data.players, data.roomId);
  }
  
  useEffect(() => {
    if (socket.disconnected) socket.connect();
    if (!isInRoom()) {
      setRoomId(roomId);
      navigate('/');
    }
  }, []);

  if (!isInRoom()) return null;
  return (
    <div className="Room">
      <h1>Room {roomId}</h1>
      <div>
          <GameState />
      </div>
      <div className="middle">
        <Players />
        {isInGame() ? <Canvas /> : <GameConfig />}
        <Chat />
      </div>
    </div>
  );
}
export default Room;