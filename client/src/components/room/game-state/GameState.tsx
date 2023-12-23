import {useRoom} from "../../../contexts/RoomContext";
import Chat from "../chat/Chat";
import {useGame} from "../../../contexts/GameContext";

function GameState() {
  const {game} = useGame();
  return (
    <div className="GameState">
      <p>Round {game?.round}</p>
    </div>
  )
}

export default GameState;