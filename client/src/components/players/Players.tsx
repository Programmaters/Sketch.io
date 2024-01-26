import {useRoom} from "../../contexts/RoomContext";
import "./Players.css";
import Player from "./player/Player";
import {useGame} from "../../contexts/GameContext";

function Players(){
  const {players} = useRoom();
  const {scores} = useGame();
  return (
    <div className="Players">
      <ul>
        {players.map((player, index) =>
          <Player player = {player} index={index+1} score={scores[player.id] ?? 0} key={player.id}/>
        )}
      </ul>
    </div>
  )
}

export default Players;