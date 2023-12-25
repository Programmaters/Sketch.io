import {useGame} from "../../../contexts/GameContext";
import {socket} from "../../../socket/socket";
import React from "react";
import "./TopBar.css";

function TopBar() {
  const {game, p5} = useGame();
  return (
    <div className="TopBar">
      <p>Time: 0 seconds</p>
      <p>Round: 1</p>
      <p>Draw this: _ _ _ _ _</p>
      <button onClick={() => socket.emit('skipTurn')}>Skip Turn</button>
      <button onClick={() => socket.emit('hint')}>Hint</button>
      <button onClick={() => p5?.saveCanvas('canvas', 'png')}>Save</button>
    </div>
  )
}

export default TopBar;