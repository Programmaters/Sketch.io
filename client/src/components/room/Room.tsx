import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useRoom} from "../../contexts/RoomContext";
import TopBar from "../top-bar/TopBar";
import Game from "../game/Game";
import './Room.css';
import {socket} from "../../socket/socket";
import useSocketListeners from "../../socket/useSocketListeners";

function Room() {
  const {isInRoom, setRoomId} = useRoom();
  const {roomId} = useParams();
  const navigate = useNavigate();

  async function copyRoomLink() {
    await navigator.clipboard.writeText(window.location.href)
    alert('Copied room link to clipboard!');
  }

  useEffect(() => {
    if (socket.disconnected) socket.connect();
    if (!isInRoom) {
      setRoomId(roomId);
      navigate('/');
    }
  }, []);

  function onInvalidUserId() {
    navigate('/');
    alert('Could not join room');
  }

  function onDisconnect() {
    setRoomId(undefined)
    alert('Disconnected from server');
    navigate('/');
  }

  useSocketListeners({
    'invalidUserId': onInvalidUserId,
    'disconnect': onDisconnect,
  });

  if (!isInRoom) return null;
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