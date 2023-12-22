import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "../home/Home";
import Game from "../game/Game";
import Room from "../room/Room";
import NotFound from "../not-found/NotFound";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route index element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/game/:gameId" element={<Game />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

