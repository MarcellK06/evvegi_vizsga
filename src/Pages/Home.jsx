import { useContext, useEffect } from "react";
import { ModalContext } from "../Providers/ModalProvider";
import Header from "../Media/header.png";
import BG from "./../Media/bg.jpg";
function Home() {
  const { CreateModal } = useContext(ModalContext);

  return (
    <div>
      <div className="row">
        <div className="col-sm-5 mx-auto">
          <div></div>
          <div className="mt-5 ms-md-5 ms-0">
            <div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
            <p className="fw-bold fs-4">Üdvözöllek a SzalkaAutónál!</p>
            <p>Autód nálunk garantáltan jó kezekben lesz.</p>

            <div className="d-flex">
              <button className="h-btn">Foglalj időpontot</button>
              <div className="fw-bold ms-3 mt-1">
                Hívj minket: <a href="tel:+36303926004">+36303926004</a>
              </div>
            </div>
          </div>
          <div>
            <img src={BG} className="bg" alt="" />
          </div>
        </div>
        <div className="col-sm-6">
          <img src={Header} alt="" className="img-fluid" />
        </div>
      </div>
    </div>
  );
}
export default Home;
