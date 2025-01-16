import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Request from './Components/PriceQuote/Request';
import ActiveRequests from './Components/PriceQuote/ActiveRequests';
 //192.168.1.45
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
  <ActiveRequests/>
  </>
);