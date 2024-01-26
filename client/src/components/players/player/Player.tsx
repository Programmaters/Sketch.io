import {PlayerType} from "../../../domain/PlayerType";
import {useSession} from "../../../contexts/SessionContext";
import "./Player.css";

type PlayerProps = {
  player: PlayerType;
  index: number;
  score: number;
}

function Player({player, index, score}: PlayerProps) {
  const {session} = useSession();
  return (
    <li className="Player">
      <p>#{index}</p>
      <div>
        <p>{player.name} {session!.id === player.id && "(You)"}</p>
        <p>{score} points</p>
      </div>
    </li>
  );
}

export default Player;