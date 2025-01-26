import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Authentication from "./Pages/Authentication";
import Marketplace from "./Pages/Marketplace";
import { NavigatorProvider } from "./Providers/NavigatorProvider";
import Contact from "./Pages/Contact";
import Requests from "./Pages/Requests";
import OwnCars from "./Pages/OwnCars";
import Community from "./Pages/Community";
import Marketplaceitem from "./Pages/Marketplaceitem";
import Appointment from "./Pages/Appointment";
import { ModalProvider } from "./Providers/ModalProvider";
import NotFound from "./Pages/NotFound";
import MarketplaceAdminPanel from "./Pages/MarketplaceAdminPanel";
import MyAccount from "./Pages/MyAccount";
import MyAccountListings from "./Pages/MyAccountListings";
import MyAccountPosts from "./Pages/MyAccountPosts";
//192.168.1.45
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <NavigatorProvider>
      <ModalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route
              path="/marketplace/admin"
              element={<MarketplaceAdminPanel />}
            />
            <Route path="/requests" element={<Requests />} />
            <Route path="/own-cars" element={<OwnCars />} />
            <Route path="/community" element={<Community />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route
              path="/my-account/listings"
              element={<MyAccountListings />}
            />
            <Route path="/my-account/posts" element={<MyAccountPosts />} />
            <Route path="/marketplace-item/:id" element={<Marketplaceitem />} />
            <Route path="/auth/:type" element={<Authentication />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ModalProvider>
    </NavigatorProvider>
  </>
);
