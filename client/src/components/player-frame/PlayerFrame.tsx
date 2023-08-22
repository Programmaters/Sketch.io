import "./PlayerFrame.css"

function PlayerFrame({onClick}: {onClick?: (() => void) | undefined}){
    return(
        <div className="player-frame">

            <img src="" alt="">
                if(onClick) <button onClick={onClick}></button>
            </img> // character

        </div>
    )
}
export default PlayerFrame