import {useGame} from "../../../contexts/GameContext";
import {GameConfigType} from "../../../domain/GameConfigType";
import {useRoom} from "../../../contexts/RoomContext";
import {socket} from "../../../socket/socket";
import {toCamelCase} from "../../../utils/Utils";

type GameConfigOptionProps = {
  icon: string,
  label: string,
  value: any,
  values: any[]
}

function GameConfigOption({ icon, label, value, values }: GameConfigOptionProps) {
  const {gameConfig, setGameConfig} = useGame()
  const {isHost} = useRoom()
  return (
    <div className="Option">
      <span>
         <i className={`fa fa-${icon}`}></i>
        <label htmlFor={label}>{label}</label>
      </span>
      <select id={label} value={value} disabled={!isHost} onChange={e => {
        const key = toCamelCase(label)
        const newGameConfig = {...gameConfig!, [key]: e.target.value}
        setGameConfig(newGameConfig)
        socket.emit('updateGameConfig', {gameConfig: newGameConfig})
      }}>
        {values.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
    </div>
  );
}

export default GameConfigOption;