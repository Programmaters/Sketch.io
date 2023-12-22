import React, {useEffect} from 'react';
import './Home.css';
import {socket} from "../../socket/socket";
import {useNavigate} from "react-router-dom";
import {useRoom} from "../../contexts/RoomContext";
import {Player} from "../../domain/Player";

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [roomId, setRoomId] = React.useState('');
  const { room, joinRoom } = useRoom();

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
    const rId = room?.id || roomId;
    if (!rId) {
      alert('Please enter the room id to join');
      return;
    }
    socket.connect();
    socket.emit('joinRoom', { username, roomId: rId });
    socket.on('joinedRoom', onJoinedRoom);
  }

  function onJoinedRoom(data: {players: Player[], roomId: string}) {
    joinRoom(data.players, data.roomId);
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
      {room === undefined &&
        <>
          <input type="text" placeholder="Enter Room Id" onChange={(e) => setRoomId(e.target.value)}/>
          <button onClick={onCreateRoom}>
              Create Room
          </button>
        </>
      }
      <button onClick={onJoinRoom}>
        Join Room
      </button>
    </div>
  );
}

export default Home;