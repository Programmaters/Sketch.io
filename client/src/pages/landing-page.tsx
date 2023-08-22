import React from 'react'
import ReactDOM from 'react-dom/client'
import CenterFrame from '../components/center-frame/CenterFrame.tsx'
import BackgroundButton from '../components/background-button/BackgroundButton.tsx'
import CharDresser from '../components/player-dresser/CharDresser.tsx'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CenterFrame>
        <CharDresser/>
        <BackgroundButton onclick={handleJoinGame}/>
        <BackgroundButton onclick={handleCreateGame} image={''} label={''}/>
    </CenterFrame>
  </React.StrictMode>,
)

function handleJoinGame() {
    console.log('join game')
}

function handleCreateGame() {
    console.log('create game')
}

