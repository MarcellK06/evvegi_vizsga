import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { HiOfficeBuilding } from "react-icons/hi";
import Logo from "../../Media/logo.png";
function Footer({ f = false }) {
  return (
    <footer>
      <div
        className={`container-fluid bg-dark w-100 footer py-2 mt-3 mt-5 ${
          f ? "postion-absolute button-0" : ""
        }`}
      >
        <div className="row">
          <div className="col-sm-3 mx-auto mb-sm-2">
            <img src={Logo} alt="SzalkaCarLogo" style={{ width: "40%" }} />
            <h5 className="text-uppercase fw-bold mt-4 mb-2">Támogató cégek</h5>
            <div>
              <a href="https://www.motul.com/hu/hu">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Motul_logo.svg/1280px-Motul_logo.svg.png"
                  alt=""
                  style={{ width: "30%" }}
                />
              </a>
            </div>
            <div className="mt-2">
              <a href="https://total.com">
                <img
                  src="https://cdn.worldvectorlogo.com/logos/total-logo-2.svg"
                  alt=""
                  style={{ width: "30%" }}
                />
              </a>
            </div>
          </div>

          <div className="col-sm-3 mx-auto mb-sm-2">
            <h5 className="text-uppercase fw-bold">Cégünk</h5>
            <div className="my-2">
              <div>
                {" "}
                <a href="/about">Rólunk</a>
              </div>
              <div>
                <a href="">Gyakran ismételt kérdések</a>
              </div>
              <div>
                {" "}
                <a href="">Adatkezelési tájékoztatót</a>
              </div>
              <div>
                <a href="/GDPR">GDPR</a>
              </div>
              <div>
                <a href="/aszf">ASZF</a>
              </div>
            </div>
          </div>
          <div className="col-sm-3 mx-auto mb-sm-2">
            <h5 className="text-uppercase fw-bold">Nyitvatartás</h5>
            <div>

              <p>Hetfő - Pántek | 7:00 - 18:00</p>
              <p>Szombat | 9:00 - 12:00</p>
              <p>Vasárnap | Zárva</p>
            </div>
          </div>
          <div className="col-sm-3 mx-auto mb-sm-2">
            <h5 className="text-uppercase fw-bold">Kapcsolat</h5>
            <div>
              <MdEmail /> info@Szalkacar.hu
              <br />
              <FaPhone /> 06303926004
              <br />
              <HiOfficeBuilding /> 4700, Mátászalka Kölcsey út 12
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
