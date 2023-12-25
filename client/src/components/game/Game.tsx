import React from 'react';
import './Game.css';
import Players from "../room/players/Players";
import Canvas from "../room/canvas/Canvas";
import GameConfig from "../game-config/GameConfig";
import Chat from "../room/chat/Chat";
import {useGame} from "../../contexts/GameContext";

function Game() {
  const {isInGame} = useGame();
  return (
    <div className="Game">
      <Players />
      {isInGame() ? <Canvas /> : <GameConfig />}
      <Chat />
    </div>
  );
}

export default Game;