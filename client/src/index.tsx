import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/app/App';
import {RoomProvider} from "./contexts/RoomContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RoomProvider>
    <App />
  </RoomProvider>
);
