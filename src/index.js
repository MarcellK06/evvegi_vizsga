import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Request from './Components/PriceQuote/Request';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ActiveRequests from './Components/PriceQuote/ActiveRequests';
import Home from './Pages/Home';
 //192.168.1.45

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
  <ActiveRequests/>
  <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />    
        </Routes>
      </BrowserRouter>
  </>
);