import React, {useEffect} from 'react';
import useSocketListeners from "../../socket/listeners";
import './Room.css';
import {useNavigate, useParams} from "react-router-dom";
import {useRoom} from "../../contexts/RoomContext";
import {Player} from "../../domain/Player";
import {socket} from "../../socket/socket";
import Game from "../game/Game";
import GameConfig from "../game-config/GameConfig";
import Players from "./components/players/Players";
import Chat from "./components/chat/Chat";
import {useGame} from "../../contexts/GameContext";

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

  function leave() {
    socket.disconnect();
    leaveRoom();
    navigate('/');
  }

  useEffect(() => {
    if (socket.disconnected) socket.connect();
    if (!isInRoom()) {
      setRoomId(roomId);
      navigate('/');
    }
  }, []);

  return (
    <div className="Room">
      <h1>Room {roomId}</h1>
      <Players />
      <Chat />
      <button onClick={leave}>Leave Room</button>
      {isInRoom() &&
        isInGame() ? <Game /> : <GameConfig />
      }
    </div>
  );
}
export default Room;