import {MdEmail} from "react-icons/md";
import {FaPhone} from "react-icons/fa6";
import {HiOfficeBuilding} from "react-icons/hi";
function Footer() {
  return (
    <>
      <div className="container-fluid bg-dark w-100 footer py-2 mt-3 mt-5">
        <div className="row">
          <div className="col-3 mx-auto">
            SzalkaCar
            <h5 className="text-uppercase fw-bold">Támogató cégek</h5>
          </div>

          <div className="col-3 mx-auto">
            <h5 className="text-uppercase fw-bold">Cégünk</h5>
          </div>
          <div className="col-3 mx-auto">
            <h5 className="text-uppercase fw-bold">Állapotfelmérés</h5>
          </div>
          <div className="col-3 mx-auto">
            <h5 className="text-uppercase fw-bold">Kapcsolat</h5>
            <div >
              <MdEmail/> info@Szalkacar.hu
              <br />
              <FaPhone/> 06301235467
              <br />
              <HiOfficeBuilding/> 4700, Mátászalka KölcseY utca 3
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Footer;
