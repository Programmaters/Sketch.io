import React from 'react';
import {useGame} from "../../contexts/GameContext";
import './Leaderboard.css';
import {useRoom} from "../../contexts/RoomContext";

function Leaderboard() {
  const {players} = useRoom()
  const {scores, playAgain} = useGame();
  return (
    <div className="Leaderboard">
      <div>
        <h1>Results:</h1>
        <table>
          <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Points</th>
          </tr>
          </thead>
          <tbody>
          {players
            .sort((a, b) => scores[b.id] - scores[a.id])
            .map((player, index) =>
            <tr key={player.id}>
              <td>{index + 1}.</td>
              <td>{player.name}</td>
              <td>{scores[player.id]}</td>
            </tr>
          )}
          </tbody>
        </table>
        <button onClick={playAgain}>Play Again</button>
      </div>
    </div>
  );
}

export default Leaderboard;