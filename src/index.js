import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Authentication from './Pages/Authentication';
import Marketplace from "./Pages/Markertplace";
import { NavigatorProvider } from "./Providers/NavigatorProvider";
//192.168.1.45
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <NavigatorProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/auth/:type" element={<Authentication />} />
      </Routes>
    </BrowserRouter></NavigatorProvider>
    
  </>
);

