import {PlayerType} from "../../../domain/PlayerType";
import {useSession} from "../../../contexts/SessionContext";
import "./Player.css";
import {useEffect, useState} from "react";
import {useGame} from "../../../contexts/GameContext";

type PlayerProps = {
  player: PlayerType;
  index: number;
  score: number;
  isHost: boolean;
  isDrawing: boolean;
}

function Player({player, index, score, isHost, isDrawing}: PlayerProps) {
  const {session} = useSession();
  const {turns} = useGame();
  const [prevScore, setPrevPoints] = useState(score);
  const [guessed, setGuessed] = useState(false);

  useEffect(() => {
    if (score !== prevScore) {
      setGuessed(true);
      setPrevPoints(score);
    }
  }, [score]);

  useEffect(() => {
    setGuessed(false);
  }, [turns]);

  return (
    <li className="Player">
      <p>#{index}</p>
      <div>
        <div>
          <p>{player.name} {session!.id === player.id && "(You)"}</p>
          {isHost && <i className="fa fa-crown"></i>}
        </div>
        <p>{score} points</p>
      </div>
      {isDrawing && <i className="fa fa-pencil"></i>}
      {guessed && <i className="fa fa-check"></i>}
    </li>
  );
}

export default Player;