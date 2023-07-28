import PlayerFrame from "../player-frame/PlayerFrame";

interface PlayerInfo {
  name: string;
  character: string;
  place: number;
  points: number;
}

function GameStats({ players }: { players: PlayerInfo[] }) {
  return (
    <div className="game-stats">

      <div className="game-stats-player-frame">
        <PlayerFrame />
      </div>

      <div className="players-stats-container">

        <h1>Players</h1>

        {players.map((player, index) => (
          <div className="player-stats" key={index}>

            <div className="player-frame">

              <div className="player-placeholder">
                <PlayerFrame />
              </div>

              <div className={player.place <= 3 ? "player-spot-" + player.place : "player-not-qualified"}>
                {renderPlace(player.place)}
              </div>

            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
}

function renderPlace(place: number) {
  switch (place) {
    case 1:
      return "1st"
    case 2:
      return "2nd"
    case 3:
      return "3rd"
    default:
      return `${place}th`
  }
}




export default GameStats;
