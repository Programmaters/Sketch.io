import React from 'react';
import './Game.css';
import Players from "../players/Players";
import Canvas from "../canvas/Canvas";
import GameConfig from "../game-config/GameConfig";
import Chat from "../chat/Chat";
import {useGame} from "../../contexts/GameContext";
import Leaderboard from "../leaderboard/Leaderboard";

function Game() {
  const {isInGame, gameState} = useGame();
  return (
    <div className="Game">
      {gameState === 'Game over!' ?
        <>
          <Leaderboard/>
        </>
      :
        <>
          <Players/>
            {isInGame ? <Canvas/> : <GameConfig/>}
          <Chat/>
        </>
      }
    </div>
  );
}

export default Game;