import {useGame} from "../../contexts/GameContext";
import {socket} from "../../socket/socket";
import React, {useState} from "react";
import "./TopBar.css";
import Timer from "../../utils/Timer";

function TopBar() {
  const {round, gameState, timer, isDrawing, isInGame, gameConfig} = useGame();
  const [hintsGiven, setHintsGiven] = useState(0);

  function onSkipTurn() {
    socket.emit('skipTurn');
  }

  function onHint() {
    setHintsGiven(prev => prev + 1)
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
            <p>Round {round} of {gameConfig.rounds}</p>
          </>
        }
      </div>
      <p>{gameState}</p>
      <div>
        {isDrawing &&
          <>
            <button onClick={onSkipTurn}>Skip</button>
            <button onClick={onHint} disabled={hintsGiven >= gameConfig.hints}>Hint</button>
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