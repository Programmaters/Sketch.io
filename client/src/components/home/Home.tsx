import React, {useEffect} from 'react';
import './Home.css';
import {socket} from "../../socket/socket";
import {useNavigate} from "react-router-dom";
import {useRoom} from "../../contexts/RoomContext";
import {Player} from "../../domain/Player";
import {setCookie} from "../../utils/cookies";

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [roomId, setRoomId] = React.useState('');
  const room = useRoom();

  function onCreateRoom() {
    socket.connect();
    socket.emit('createRoom', { username })
    socket.on('joinedRoom', onJoinedRoom);
  }

  function onJoinRoom(){
    if (!username) {
      alert('Please enter a username');
      return;
    }
    if (!roomId) {
      alert('Please enter the room id to join');
      return;
    }
    socket.connect();
    socket.emit('joinRoom', { username, roomId });
    socket.on('joinedRoom', onJoinedRoom);
  }

  function onJoinedRoom(data: {players: Player[], roomId: string, playerId: string}) {
    room.join(data.players, data.roomId);
    setCookie('playerId', data.playerId)
    navigate(`room/${data.roomId}`);
  }

  useEffect(() => {
    return () => {
      socket.off('joinedRoom', onJoinedRoom);
    }
  }, []);

  return (
    <div className="Home">
      <h1>Home</h1>
      <input type="text" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)}/>
      <button onClick={onCreateRoom}>
        Create Room
      </button>
      <input type="text" placeholder="Enter Room Id" onChange={(e) => setRoomId(e.target.value)}/>
      <button onClick={onJoinRoom}>
        Join Room
      </button>
    </div>
  );
}

export default Home;