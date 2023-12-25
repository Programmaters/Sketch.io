import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/app/App';
import {RoomProvider} from "./contexts/RoomContext";
import {GameProvider} from "./contexts/GameContext";
import {SessionProvider} from "./contexts/SessionContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <SessionProvider>
    <RoomProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </RoomProvider>
  </SessionProvider>
);
