import React from 'react'
import ReactDOM from 'react-dom/client'
import CenterFrame from './components/center-frame/CenterFrame.tsx'
import GameSetup from './pages/GameSetup.tsx'
import CharDresser from './components/char-dresser/CharDresser.tsx'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CenterFrame>
        <GameSetup/>
    </CenterFrame>
  </React.StrictMode>,
)

function handleJoinGame() {
    console.log('join game')
}

function handleCreateGame() {
    console.log('create game')
}

