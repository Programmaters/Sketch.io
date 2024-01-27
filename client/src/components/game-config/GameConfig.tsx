import React from 'react';
import './GameConfig.css';
import {useGame} from "../../contexts/GameContext";
import GameConfigOption from "./components/GameConfigOption";
import {useRoom} from "../../contexts/RoomContext";

const maxPlayersOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const languageOptions = ['English', 'Portuguese']
const drawTimeOptions = [30, 45, 60, 75, 90, 105, 120];
const roundsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const wordCountOptions = [1, 2, 3, 4, 5];
const hintsOptions = [0, 1, 2, 3, 4];

function GameConfig() {
  const {isHost, players} = useRoom()
  const {gameConfig, startGame} = useGame()
  const {maxPlayers, language, drawTime, rounds, wordCount, hints} = gameConfig!;
  return (
    <div className="GameConfig">
      <div className="Options">
        <GameConfigOption icon="user" label="Max Players" value={maxPlayers} values={maxPlayersOptions} />
        <GameConfigOption icon="globe" label="Language" value={language} values={languageOptions}/>
        <GameConfigOption icon="clock" label="Draw Time" value={drawTime} values={drawTimeOptions}/>
        <GameConfigOption icon="hashtag" label="Rounds" value={rounds} values={roundsOptions}/>
        <GameConfigOption icon="bars" label="Word Count" value={wordCount} values={wordCountOptions}/>
        <GameConfigOption icon="question" label="Hints" value={hints} values={hintsOptions}/>
      </div>
      <button onClick={startGame} disabled={!isHost || players.length < 2}>Start Game</button>
    </div>
  );
}

export default GameConfig;