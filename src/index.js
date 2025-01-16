import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Request from "./Components/PriceQuote/Request";
import ActiveRequests from "./Components/PriceQuote/ActiveRequests";
//192.168.1.45
const root = ReactDOM.createRoot(document.getElementById("root"));
import Home from "./Pages/Home";

root.render(
  <>
    <ActiveRequests />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </>
);
