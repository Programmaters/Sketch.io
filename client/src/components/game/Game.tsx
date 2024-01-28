import React from 'react';
import './Game.css';
import Players from "../players/Players";
import Canvas from "../canvas/Canvas";
import GameConfig from "../game-config/GameConfig";
import Chat from "../chat/Chat";
import {useGame} from "../../contexts/GameContext";
import Leaderboard from "../leaderboard/Leaderboard";
import ChooseWord from "../choose-word/ChooseWord";

function Game() {
  const {isInGame, gameState, isDrawing, choosingWords} = useGame();
  return (
    <div className="Game">
      {gameState === 'Game over!' ?
        <>
          <Leaderboard/>
        </>
      :
        <>
          <Players/>
            {isInGame && isDrawing && choosingWords.length !== 0
              ? <ChooseWord/>
              : isInGame
                ? <Canvas/>
                : <GameConfig/>
            }
          <Chat/>
        </>
      }
    </div>
  );
}

export default Game;