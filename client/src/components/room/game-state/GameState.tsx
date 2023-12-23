import {useGame} from "../../../contexts/GameContext";
import "./GameState.css";

function GameState() {
  const {game} = useGame();
  return (
    <div className="GameState">
      <p>Time: 0 seconds</p>
      <p>Round {game?.round}</p>
      <p>{/*game?.state*/}</p>
    </div>
  )
}

export default GameState;