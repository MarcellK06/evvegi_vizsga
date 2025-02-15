import { toHaveAccessibleDescription } from "@testing-library/jest-dom/matchers";
import Cookies from "js-cookie";
import Logo from "../../Media/logo.png";
import { FaWindowMinimize } from "react-icons/fa6";
import { VscListSelection } from "react-icons/vsc";
import { useState } from "react";
function Navbar() {
  class NavLink {
    constructor(title, path, loginRequire) {
      this.title = title;
      this.path = path;
      this.loginRequire = loginRequire;
    }
  }
  const Navigate = (link) => {
    const userLogined = Cookies.get("userid") != null;
    if (link.loginRequire) {
      if (userLogined) {
        window.location.href = link.path;
      } else window.location.href = "/auth/login?r=" + link.path;
      return;
    }
    window.location.href = link.path;
  };
  const navLinks = [
    new NavLink("Főoldal", "/", false),
    new NavLink("Áranjánlat", "/requests", false),
    new NavLink("Időpont foglalás", "/appointment", true),
    new NavLink("Marketplace", "/marketplace", false),
    new NavLink("Közösség", "/community", true),
    new NavLink("Autóim", "/own-cars", true),
  ];

  const OpenClose = () => {
    const hours = {
      Mon: "7:00-18:00",
      Tue: "7:00-18:00",
      Wed: "7:00-18:00",
      Thu: "7:00-18:00",
      Fri: "7:00-18:00",
      Sat: "9:00-12:00",
      Sun: "Zárva",
    };

    const d = new Date();
    const day = d.toLocaleString("en-US", { weekday: "short" });
    const openClose = hours[day];

    if (openClose === "Zárva") {
      return (
        <>
          <div className="open-close close mt-2"></div>
          <div className="text-light ms-2">Jelenleg Zárva</div>
        </>
      );
    }

    const [openTime, closeTime] = openClose.split("-");
    const now = d.toTimeString().split(" ")[0].split(":").slice(0, 2).join(":");

    const [nowHour, nowMin] = now.split(":").map(Number);
    const [oHour, oMin] = openTime.split(":").map(Number);
    const [cHour, cMin] = closeTime.split(":").map(Number);

    if (nowHour < oHour || (nowHour === oHour && nowMin < oMin)) {
      return (
        <>
          <div className="open-close close mt-2"></div>
          <div className="text-light ms-2">Jelenleg Zárva</div>
        </>
      );
    }

    if (nowHour > cHour || (nowHour === cHour && nowMin >= cMin)) {
      return (
        <>
          <div className="open-close close mt-2"></div>
          <div className="text-light ms-2">Jelenleg Zárva</div>
        </>
      );
    }

    return (
      <>
        <div className="open-close open mt-2"></div>
        <div className="text-light ms-2">Jelenleg Nyitva</div>
      </>
    );
  };

  const Mobile = () => {
    return (
      <>
        <nav class="navbar navbar-expand-lg bg-black p-3 d-lg-none">
          <div class="container">
            <a class="navbar-brand" href="/">
              <img src={Logo} alt="SzalkaCar" width="100" height="50" />
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="">
                <VscListSelection className="text-white" size={35} />
              </span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                {navLinks.map((i) => (
                  <li class="nav-item">
                    <a
                      class={`nav-link text-light ${
                        i.path == window.location.pathname
                          ? "active-link fw-bold"
                          : ""
                      }`}
                      aria-current="page"
                      onClick={() => Navigate(i)}
                    >
                      {i.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div class="d-flex mt-2">
            <div>
              {Cookies.get("userid") == null ? (
                <button
                  className="btn btn-light hoverbutton"
                  onClick={() => {
                    window.location.href = "/auth/login";
                  }}
                >
                  Bejelentkezés
                </button>
              ) : (
                <div
                  className="d-flex own-cars ms-3 cursor-pointer hoverbutton"
                  onClick={() => (window.location.href = "/my-account")}
                >
                  <div className="ms-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="currentColor"
                      class="bi bi-person-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg>
                  </div>
                  <div className="mt-1 mx-2 fw-bold">Profilom</div>
                </div>
              )}
            </div>
            <div className="ms-3 mt-2 fw-bold d-flex justify-content-end">
              {OpenClose()}
            </div>
          </div>
        </nav>
      </>
    );
  };
  const Pc = () => {
    return (
      <>
        <nav class="navbar navbar-expand-lg bg-black p-3">
          <div class="container">
            <a class="navbar-brand" href="/">
              <img src={Logo} alt="SzalkaCar" width="100" height="50" />
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="">
                <VscListSelection className="text-white" size={35} />
              </span>
            </button>
            <div
              class="collapse navbar-collapse ms-5"
              id="navbarSupportedContent"
            >
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                {navLinks.map((i) =>
                  i.path != "/own-cars" ? (
                    <li class="nav-item">
                      <a
                        class={`nav-link text-light ${
                          i.path == window.location.pathname
                            ? "active-link fw-bold"
                            : ""
                        }`}
                        aria-current="page"
                        onClick={() => Navigate(i)}
                      >
                        {i.title}
                      </a>
                    </li>
                  ) : null
                )}
              </ul>
              <div class="d-flex">
                <div>
                  {Cookies.get("userid") == null ? (
                    <button
                      className="btn btn-light hoverbutton"
                      onClick={() => {
                        window.location.href = "/auth/login";
                      }}
                    >
                      Bejelentkezés
                    </button>
                  ) : (
                    <div
                      className="d-flex own-cars ms-5 cursor-pointer hoverbutton"
                      onClick={() => (window.location.href = "/my-account")}
                    >
                      <div className="ms-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          class="bi bi-person-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                      </div>
                      <div className="mt-1 mx-2 fw-bold">Profilom</div>
                    </div>
                  )}
                </div>
                <div
                  className="d-flex own-cars ms-5 cursor-pointer hoverbutton"
                  onClick={() => (window.location.href = "/own-cars")}
                >
                  <div className="ms-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="currentColor"
                      class="bi bi-car-front"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0m10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17s2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276" />
                      <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.8.8 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155s4.037-.084 5.592-.155A1.48 1.48 0 0 0 15 9.611v-.413q0-.148-.03-.294l-.335-1.68a.8.8 0 0 0-.43-.563 1.8 1.8 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3z" />
                    </svg>
                  </div>
                  <div className="mt-1 mx-2 fw-bold">Autóim</div>
                </div>
                <div className="ms-5 mt-2 fw-bold d-flex justofx-content-end">
                  {OpenClose()}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  };
  const GetNav = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("mobile")) {
      return Mobile();
    } else {
      return Pc();
    }
  };
  const [nav, setNav] = useState(GetNav());

  return <>{nav}</>;
}
export default Navbar;
