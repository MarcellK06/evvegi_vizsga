import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { HiOfficeBuilding } from "react-icons/hi";
import Logo from "../../Media/logo.png";
function Footer({ f = false }) {
  return (
    <>
      <div
        className={`container-fluid bg-dark w-100 footer py-2 mt-3 mt-5 ${
          f ? "postion-absolute button-0" : ""
        }`}
      >
        <div className="row">
          <div className="col-3 mx-auto">
            <img src={Logo} alt="SzalkaCarLogo" style={{ width: "40%" }} />
            <h5 className="text-uppercase fw-bold mt-4 mb-2">Támogató cégek</h5>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Motul_logo.svg/1280px-Motul_logo.svg.png"
                alt=""
                style={{ width: "20%" }}
              />
            </div>
          </div>

          <div className="col-3 mx-auto">
            <h5 className="text-uppercase fw-bold">Cégünk</h5>
            <div className="my-2">
              <div>
                {" "}
                <a href="">Rólunk</a>
              </div>
              <div>
                <a href="">Gyakran ismételt kérdések</a>
              </div>
              <div>
                {" "}
                <a href="">Adatkezelési tájékoztatót</a>
              </div>
            </div>
          </div>
          <div className="col-3 mx-auto">
            <h5 className="text-uppercase fw-bold">Állapotfelmérés</h5>
          </div>
          <div className="col-3 mx-auto">
            <h5 className="text-uppercase fw-bold">Kapcsolat</h5>
            <div>
              <MdEmail /> info@Szalkacar.hu
              <br />
              <FaPhone /> 06301235467
              <br />
              <HiOfficeBuilding /> 4700, Mátászalka KölcseY utca 3
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Footer;
