import {useRoom} from "../../../contexts/RoomContext";
import "./Players.css";
import Player from "./player/Player";

function Players(){
  const {room} = useRoom();
  return (
    <div className="Players">
      <ul>
        {room?.players.map((player, index) => <Player player={player} index={index+1} key={player.id} />)}
      </ul>
    </div>
  )
}

export default Players;