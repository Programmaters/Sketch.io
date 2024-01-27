import {useRoom} from "../../contexts/RoomContext";
import "./Players.css";
import Player from "./player/Player";
import {useGame} from "../../contexts/GameContext";

function Players(){
  const {players, host} = useRoom();
  const {scores, drawer} = useGame();
  return (
    <div className="Players">
      <ul>
        {players
          .sort((a, b) => scores[b.id] - scores[a.id])
          .map((player, index) =>
            <Player
              player={player}
              index={index+1}
              score={scores[player.id] ?? 0}
              isHost={host === player.id}
              isDrawing={drawer === player.id}
              key={player.id}
            />
        )}
      </ul>
    </div>
  )
}

export default Players;