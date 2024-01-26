import React, {useEffect} from 'react';
import './Home.css';
import {socket} from "../../socket/socket";
import {Link, useNavigate} from "react-router-dom";
import {useRoom} from "../../contexts/RoomContext";
import {PlayerType} from "../../domain/PlayerType";
import {useSession} from "../../contexts/SessionContext";
import {GameConfigType} from "../../domain/GameConfigType";
import {useGame} from "../../contexts/GameContext";

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [roomId, setRoomId] = React.useState('');
  const { room, joinRoom } = useRoom();
  const { setSession } = useSession();
  const { setGameConfig } = useGame();

  function onCreateRoom() {
    if (!username) {
      alert('Please enter a username');
      return;
    }
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

  function onJoinedRoom(data: {players: PlayerType[], roomId: string, config: GameConfigType}) {
    setSession({ name: username, id: socket.id });
    joinRoom(data.players, data.roomId);
    setGameConfig(data.config);
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
        <input type="text" placeholder="Enter your name" onChange={(e) => setUsername(e.target.value)}/>
        <div className="actions">
          {!room &&
              <input type="text" placeholder="Room id" onChange={(e) => setRoomId(e.target.value)}/>
          }
          <button onClick={onJoinRoom}>Join</button>
          {!room && <button onClick={onCreateRoom}>Create</button>}
        </div>
      </div>
    </div>
  );
}

export default Home;