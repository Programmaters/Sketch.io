import {PlayerType} from "../../../domain/PlayerType";
import {useSession} from "../../../contexts/SessionContext";
import "./Player.css";

type PlayerProps = {
  player: PlayerType;
  index: number;
}

function Player({player, index}: PlayerProps) {
  const {session} = useSession();
  return (
    <li className="Player">
      <p>#{index}</p>
      <div>
        <p>{player.name} {session!.id === player.id && "(You)"}</p>
        <p>0 points</p>
      </div>
    </li>
  );
}

export default Player;