import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/global.css'
import Web3Auth from "./Web3Auth/Web3Auth";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <div className="App">
    <Web3Auth />
  </div>
);
