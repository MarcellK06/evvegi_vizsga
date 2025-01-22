import { toHaveAccessibleDescription } from "@testing-library/jest-dom/matchers";
import Cookies from "js-cookie";
import Logo from "../../Media/logo.png";
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
      } else window.location.href = "/auth/login";
      return;
    }
    window.location.href = link.path;
  };
  const navLinks = [
    new NavLink("Főőoldal", "/", false),
    new NavLink("Áranjánlat", "/requests", true),
    new NavLink("Időpont foglalás", "/majdlesz", true),
    new NavLink("Marketplace", "/marketplace", false),
    new NavLink("Közösség", "/community", true),
  ];
  return (
    <>
      <nav class="navbar navbar-expand-lg bg-black p-3">
        <div class="container">
          <a class="navbar-brand" href="/">
            <img
              src={Logo}
              alt="SzalkaCar"
              width="100"
              height="50"
            />
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
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="collapse navbar-collapse ms-5"
            id="navbarSupportedContent"
          >
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
            <div class="d-flex">
              <div>
                <button
                  className="btn btn-light"
                  onClick={() => {
                    window.location.href = "/auth/login";
                  }}
                >
                  Bejelentkezés
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
