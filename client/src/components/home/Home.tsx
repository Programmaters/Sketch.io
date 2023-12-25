import React, {useEffect} from 'react';
import './Home.css';
import {socket} from "../../socket/socket";
import {Link, useNavigate} from "react-router-dom";
import {useRoom} from "../../contexts/RoomContext";
import {Player} from "../../domain/Player";
import {useSession} from "../../contexts/SessionContext";

function Home() {
  const navigate = useNavigate();
  const [username, setName] = React.useState('');
  const [roomId, setRoomId] = React.useState('');
  const { room, joinRoom } = useRoom();
  const { setUsername } = useSession();

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
    setUsername(username);
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
      <a href="/"><h1>Sketch.io</h1></a>
      <div className="content">
        <input type="text" placeholder="Enter your name" onChange={(e) => setName(e.target.value)}/>
        <div className="actions">
          {!room &&
              <input type="text" placeholder="Enter room id to join" onChange={(e) => setRoomId(e.target.value)}/>
          }
          <button onClick={onJoinRoom}>Join</button>
          {!room && <button onClick={onCreateRoom}>Create</button>}
        </div>
      </div>
    </div>
  );
}

export default Home;