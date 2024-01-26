import {useGame} from "../../contexts/GameContext";
import {socket} from "../../socket/socket";
import React from "react";
import "./TopBar.css";
import Timer from "../../utils/Timer";

function TopBar() {
  const {gameState, timer} = useGame();

  return (
    <div className="TopBar">
      <div>
        <Timer seconds={timer}/>
        <p>Round: 1</p>
      </div>
      <p>{gameState}</p>
      <div>
        <button onClick={() => socket.emit('skipTurn')}>Skip Turn</button>
        <button onClick={() => socket.emit('hint')}>Hint</button>
        <button id="save-button">Save</button>
      </div>
    </div>
  )
}

export default TopBar;