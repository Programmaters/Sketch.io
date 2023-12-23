import {useRoom} from "../../../contexts/RoomContext";
import "./Players.css";

function Players(){
  const {room} = useRoom();
  return (
    <div className="Players">
      <h2>Players</h2>
      <ul>
        {room?.players.map(player => (
          <li key={player.id}>
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Players;