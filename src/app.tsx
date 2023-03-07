import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/global.css'
import Web3Auth from "./Web3Auth/Web3Auth";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SteamAuth from "./SteamAuth/SteamAuth";
import TwitterAuth from "./TwitterAuth/TwitterAuth";
import DiscordAuth from "./DiscordAuth/DiscordAuth";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/' element={<Web3Auth />} />
        <Route path='/steam' element={<SteamAuth />} />
        <Route path='/twitter' element={<TwitterAuth />} />
        <Route path='/discord' element={<DiscordAuth />} />
      </Routes>
    </div>
  </BrowserRouter>
);
