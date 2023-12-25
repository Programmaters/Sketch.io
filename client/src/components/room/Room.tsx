import React, {useEffect} from 'react';
import useSocketListeners from "../../socket/useSocketListeners";
import {useNavigate, useParams} from "react-router-dom";
import {useRoom} from "../../contexts/RoomContext";
import {PlayerType} from "../../domain/PlayerType";
import {socket} from "../../socket/socket";
import TopBar from "./top-bar/TopBar";
import Game from "../game/Game";
import './Room.css';

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const {joinRoom, addPlayer, removePlayer, setRoomId, isInRoom} = useRoom();

  function playerJoinedRoom(data: {player: PlayerType}) {
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

  function onJoinedRoom(data: {players: PlayerType[], roomId: string}) {
    joinRoom(data.players, data.roomId);
  }

  async function copyRoomLink() {
    await navigator.clipboard.writeText(window.location.href)
    alert('Copied room link to clipboard!');
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
      <div className="title">
        <a href="/"><h1>Sketch.io</h1></a>
        <div>
          <h1>Room {roomId}</h1>
          <button className="fa fa-copy" onClick={copyRoomLink}></button>
        </div>
      </div>
      <TopBar />
      <Game />
    </div>
  );
}
export default Room;