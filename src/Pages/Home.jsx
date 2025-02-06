import { useContext, useEffect } from "react";
import { ModalContext } from "../Providers/ModalProvider";
import Header from "../Media/header.png";
import BG from "./../Media/bg.jpg";
import Ratings from "../Components/Rating/Ratings";
function Home() {
  const { CreateModal } = useContext(ModalContext);

  useEffect(() => {
    let lastScrollTop = 0;

    window.addEventListener("scroll", (e) => {
      var item = document.getElementById("contact");
      if (item == null) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop - 17 > lastScrollTop) {
        item.style.position = "fixed";
        item.style.top = "0";
        item.classList.add("p-3");
        item.classList.add("w-100");
      }

      if (scrollTop < lastScrollTop && scrollTop < 240) {
        item.style.position = null;
        item.style.top = null;
        item.classList.remove("p-3");
        item.classList.remove("w-100");
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-sm-5 mx-auto mb-4">
          <div></div>
          <div className="mt-5 ms-md-5 ms-0">
            <div>
              <br />
              <br />
              <br />
            </div>
            <p className="fw-bold fs-4">Üdvözöllek a SzalkaAutónál!</p>
            <p>Autód nálunk garantáltan jó kezekben lesz.</p>

            <div className="d-flex post" id="contact">
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
      <br />
      <br />
      <br />
      <br />
      <div className="my-5">
        <h2 className="my-4 text-center mt-5">Miért válasszon minet?</h2>
        <div className="row mx-sm-3">
          <div className="col-sm-3 mx-auto mb-2">
            <div className="why-choose-us-card">
              <div className="header">
                <h5 className="fw-bold text-center fw-3">
                  Tapasztalt Szakemberek 🔧
                </h5>
              </div>
              <div className="body">
                <p className="text-brake">
                  Több éves tapasztalattal rendelkező autószerelőink precízen és
                  gyorsan dolgoznak, hogy autója a legjobb kezekben legyen.
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-3 mx-auto mb-2">
            <div className="why-choose-us-card">
              <div className="header">
                <h5 className="fw-bold text-center fw-3">
                  Gyors és Megbízható Szolgáltatás ⏳
                </h5>
              </div>
              <div className="body">
                <p className="text-brake">
                  Tudjuk, hogy az idő pénz! Szervizünk gyors, hatékony és pontos
                  munkát végez, hogy minél hamarabb újra útra kelhessen.
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-3 mx-auto mb-2">
            <div className="why-choose-us-card">
              <div className="header">
                <h5 className="fw-bold text-center fw-3">
                  Modern Diagnosztikai Eszközök 📊
                </h5>
              </div>
              <div className="body">
                <p className="text-brake">
                  A legújabb technológiát használjuk a hibák gyors és pontos
                  felderítésére, így elkerülhetők a felesleges javítások és
                  költségek.
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-3 mx-auto mb-2">
            <div className="why-choose-us-card">
              <div className="header">
                <h5 className="fw-bold text-center fw-3">
                  Korrekt Ár és Átláthatóság 💰
                </h5>
              </div>
              <div className="body">
                <p className="text-brake">
                  Nincsenek rejtett költségek! Előre ismertetjük az árakat, és
                  csak azt javítjuk, amire valóban szükség van.
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-3 mx-auto mb-2">
            <div className="why-choose-us-card">
              <div className="header">
                <h5 className="fw-bold text-center fw-3">
                  Garancia Minden Javításra ✅
                </h5>
              </div>
              <div className="body">
                <p className="text-brake">
                  Szervizünk minden elvégzett munkára garanciát vállal, így
                  biztos lehet benne, hogy autója megbízható állapotban hagyja
                  el a műhelyt.
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <h2 className="my-4 text-center mt-5">Szolgáltatásaink</h2>
        <div className="d-flex justify-content-center">
          <div className="row justify-content-center">
            <div className="col-3">
          <div className="container mx-auto text-center why-choose-us-card h-100">
          <p className="fs-4">Általános javítások- és karbantartás</p>
          </div></div>
            <div className="col-3">
          <div className="container mx-auto text-center why-choose-us-card h-100">
          <p className="fs-4">Autó külső- és belső</p>
          </div></div>
            <div className="col-3">
          <div className="container mx-auto text-center why-choose-us-card h-100">
          <p className="fs-4">Gumiabroncs javítás / csere</p>
          </div></div>
            <div className="col-3">
          <div className="container mx-auto text-center why-choose-us-card h-100">
          <p className="fs-4">Diagnosztika</p>
          </div></div>
          </div>
           
        </div>
        <br />
        <br />
        <br />
        <br />

        <h2 className="my-4 text-center mt-5">Értékelések</h2>
        <div className="container">
          <Ratings />
        </div>
        <div className="d-flex justify-content-center">
          <button className="rate-btn fw-bold mt-3 text-light">
            Írj értékelést!
          </button>
        </div>
      </div>
    </div>
  );
}
export default Home;
