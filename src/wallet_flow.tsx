import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/global.css'
import Web3Auth from "./Web3Auth/Web3Auth";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SteamAuth from "./SteamAuth/SteamAuth";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/' element={<Web3Auth />} />
        <Route path='/steam' element={<SteamAuth />} />
      </Routes>
    </div>
  </BrowserRouter>
);
