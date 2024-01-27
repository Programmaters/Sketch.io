import {useGame} from "../../contexts/GameContext";
import {socket} from "../../socket/socket";
import React, {useState} from "react";
import "./TopBar.css";
import Timer from "../../utils/Timer";

function TopBar() {
  const {round, gameState, timer, isDrawing, isInGame, gameConfig} = useGame();

  function onSkipTurn() {
    socket.emit('skipTurn');
  }

  function onHint() {
    socket.emit('hint');
  }

  return (
    <div className="TopBar">
      <div>
          {isInGame &&
          <>
            <div>
              <Timer seconds={timer}/>
              <i className={'fa fa-clock'}></i>
            </div>
            <p>Round: {round}/{gameConfig.rounds}</p>
          </>
        }
      </div>
      <p>{gameState}</p>
      <div>
        {isDrawing &&
          <>
            <button onClick={onSkipTurn}>Skip</button>
            <button onClick={onHint}>Hint</button>
          </>
        }
        {isInGame &&
          <button id="save-button">Save</button>
        }

      </div>
    </div>
  )
}

export default TopBar;