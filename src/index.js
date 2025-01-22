import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Authentication from './Pages/Authentication';
import Marketplace from "./Pages/Marketplace";
import { NavigatorProvider } from "./Providers/NavigatorProvider";
import Contact from "./Pages/Contact";
import Requests from "./Pages/Requests";
import OwnCars from "./Pages/OwnCars";
import Community from "./Pages/Community";
import Marketplaceitem from "./Pages/Marketplaceitem";
//192.168.1.45
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <NavigatorProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/own-cars" element={<OwnCars />} />
        <Route path="/community" element={<Community />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/marketplace-item/:id" element={<Marketplaceitem/>} />
        <Route path="/auth/:type" element={<Authentication />} />
      </Routes>
    </BrowserRouter></NavigatorProvider>
    
  </>
);

