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
import RequestsAdminPanel from "./Pages/RequestsAdminPanel";
import OwnCars from "./Pages/OwnCars";
import Community from "./Pages/Community";
import CommunityAdminPanel from "./Pages/CommunityAdminPanel";
import Marketplaceitem from "./Pages/Marketplaceitem";
import Appointment from "./Pages/Appointment";
import { ModalProvider } from "./Providers/ModalProvider";
import NotFound from "./Pages/NotFound";
import MarketplaceAdminPanel from "./Pages/MarketplaceAdminPanel";
import MyAccount from "./Pages/MyAccount";
import MyAccountListings from "./Pages/MyAccountListings";
import MyAccountPosts from "./Pages/MyAccountPosts";
import MyAccountRequests from "./Pages/MyAccountRequests";
import AppointmentsAdminPanel from "./Components/AppointmentsAdmin/AppointmentsAdminPanel";
import About from "./Pages/About";
import Faq from "./Pages/Faq";
import Mailer from "./Pages/Mailer";
import GDPR from "./Pages/GDPR";
import Aszf from "./Pages/Aszf";
import CarsAdminPanel from "./Pages/CarsAdminPanel";
import USERDOC from "./Pages/USERDOC";
import DEVDOC from "./Pages/DEVDOC";
import TESTDOC from "./Pages/TESTDOC";
import Exam from "./Pages/Exam";
import VerifyAccount from "./Pages/VerifyAccount";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div style={{ minHeight: "65.7vh" }}>
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
            <Route path="/requests/admin" element={<RequestsAdminPanel />} />
            <Route path="/own-cars" element={<OwnCars />} />
            <Route path="/cars/admin" element={<CarsAdminPanel />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/admin" element={<CommunityAdminPanel />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route
              path="/appointments/admin"
              element={<AppointmentsAdminPanel />}
            />
            <Route path="/GDPR" element={<GDPR />} />
            <Route path="/aszf" element={<Aszf />} />
            <Route path="/user-doc" element={<USERDOC />} />
            <Route path="/dev-doc" element={<DEVDOC />} />
            <Route path="/test-doc" element={<TESTDOC />} />
            <Route
              path="/my-account/listings"
              element={<MyAccountListings />}
            />
            <Route
              path="/my-account/requests"
              element={<MyAccountRequests />}
            />
            <Route path="/my-account/posts" element={<MyAccountPosts />} />
            <Route path="/marketplace-item/:id" element={<Marketplaceitem />} />
            <Route path="/auth/:type" element={<Authentication />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/admin/mailer" element={<Mailer />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/verify-account/:token" element={<VerifyAccount />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ModalProvider>
    </NavigatorProvider>
  </div>
);
