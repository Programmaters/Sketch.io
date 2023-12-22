import React, {useEffect} from 'react';
import useSocketListeners from "../../socket/listeners";
import './Room.css';
import {useNavigate, useParams} from "react-router-dom";
import {useRoom} from "../../contexts/RoomContext";
import {Player} from "../../domain/Player";
import {clearCookie, getCookie, setCookie} from "../../utils/cookies";
import {socket} from "../../socket/socket";

function Room() {
  const { roomId } = useParams();
  const room = useRoom();
  const navigate = useNavigate();

  function playerJoinedRoom(data: {player: Player}) {
    room.addPlayer(data.player);
  }

  function onInvalidUserId() {
    clearCookie('playerId');
    navigate('/');
    alert('Could not join room');
  }

  const eventHandlers = {
    'playerJoinedRoom': playerJoinedRoom,
    'invalidUserId': onInvalidUserId,
    // 'playerLeftRoom': playerLeftRoom,
    // 'updateSettings': updateSettings,
    // 'gameStarted': startGame,
  };
  // useSocketListeners(eventHandlers);

  function onJoinedRoom(data: {players: Player[], roomId: string, playerId: string}) {
    room.join(data.players, data.roomId);
    setCookie('playerId', data.playerId)
  }

  useEffect(() => {
    if (socket.disconnected) {
      socket.connect();
    }
    if (room.players.length === 0) {
      const playerId = getCookie('playerId');
      socket.emit('reconnect', { playerId, roomId });
      socket.on('joinedRoom', onJoinedRoom);
    }
    return () => {
      socket.off('joinedRoom', onJoinedRoom);
    }
  }, []);

  return (
    <div className="Room">
      <h1>Room {roomId}</h1>
      <div className="players">
        {room.players.map(player => <div className="player" key={player.id}>{player.name}</div>)}
      </div>
      <button onClick={() => socket.emit('leaveRoom', { playerId: "abc", roomId })}>
        Leave Room
      </button>
    </div>
  );
}

export default Room;