import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../Providers/ModalProvider";
import Header from "../Media/header.png";
import BG from "./../Media/bg.jpg";
import Ratings from "../Components/Rating/Ratings";
import AltalanosJavitasok from "../Media/alt.jpg";
import KulsoBelso from "../Media/kzm.jpg";
import Gumiabroncs from "../Media/giabr.jpg";
import Diagnosztika from "../Media/da.jpg";
import { motion } from "framer-motion";
import RatingModal from "../Components/RatingModal";
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
        item.classList.add("bg-white");
      }

      if (scrollTop < lastScrollTop && scrollTop < 240) {
        item.style.position = null;
        item.style.top = null;
        item.classList.remove("p-3");
        item.classList.remove("w-100");
        item.classList.remove("bg-white");
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }, []);

  const CreateRating = () => {
    CreateModal("Értékelés írása", <RatingModal />, true);
  };

  return (
    <div>
      <div className="row">
        <div className="col-sm-5 mx-auto mb-4">
          <div></div>
          <div className="mt-sm-1 mt-5 ms-2 ">
            <div>
              <br />
              <br />
              <br />
            </div>
            <p className="fw-bold fs-4">Üdvözöllek a SzalkaAutónál!</p>
            <p>Autód nálunk garantáltan jó kezekben lesz.</p>

            <div className="d-flex" id="contact">
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
        <motion.div
          initial={{ opacity: 1, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            ease: "linear",
            duration: 1,
            y: { duration: 0.5 },
          }}
        >
          <div className="row mx-sm-3 mx-0">
            <div className="col-sm-3 mx-auto mb-2">
              <div className="why-choose-us-card">
                <div className="header">
                  <h5 className="fw-bold text-center fw-3">
                    Tapasztalt Szakemberek 🔧
                  </h5>
                </div>
                <div className="body">
                  <p className="text-brake">
                    Több éves tapasztalattal rendelkező autószerelőink precízen
                    és gyorsan dolgoznak, hogy autója a legjobb kezekben legyen.
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
                    Tudjuk, hogy az idő pénz! Szervizünk gyors, hatékony és
                    pontos munkát végez, hogy minél hamarabb újra útra
                    kelhessen.
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
        </motion.div>

        <br />
        <br />
        <br />
        <h2 className="my-4 text-center mt-5">Szolgáltatásaink</h2>
        <div class="container">
          <div class="row service">
            <div class="col-md-6 text mx-auto">
              <p class="fw-bold fs-5">Általános javítások és karbantartás</p>
              <p>
                Rendszeres ellenőrzések, olajcsere, fék- és futóműjavítás,
                valamint egyéb kopó alkatrészek cseréje a jármű megbízható
                működése érdekében.
              </p>
            </div>
            {/* ide vissza kell tenni az animációt*/}
            <div class="col-md-6 image mx-auto">
              <img
                src={AltalanosJavitasok}
                class="img-fluid service-pictures"
                alt=""
              />
            </div>
          </div>

          <div class="row service reverse">
            <div class="col-md-6 text mx-auto">
              <p class="fw-bold fs-5">Autó külső és belső tisztítás</p>
              <p>
                Professzionális mosás, polírozás és belső tér ápolás a jármű
                esztétikai és higiéniai állapotának megőrzése érdekében.
              </p>
            </div>
            <div class="col-md-6 image mx-auto">
              <img
                src={KulsoBelso}
                class="img-fluid service-pictures"
                alt=""
              />
            </div>
          </div>

          <div class="row service">
            <div class="col-md-6 text mx-auto">
              <p class="fw-bold fs-5">Gumiabroncs javítás / csere</p>
              <p>
                Sérült gumiabroncsok javítása vagy új abroncsok felszerelése az
                optimális tapadás és biztonság érdekében.
              </p>
            </div>
            <div class="col-md-6 image mx-auto">
              <img
                src={Gumiabroncs}
                class="img-fluid service-pictures"
                alt=""
              />
            </div>
          </div>

          <div class="row service reverse">
            <div class="col-md-6 text mx-auto">
              <p class="fw-bold fs-5">Diagnosztika</p>
              <p>
                Modern műszerekkel végzett hibakódolvasás és műszaki
                állapotfelmérés a jármű elektromos és mechanikai problémáinak
                gyors beazonosítására.
              </p>
            </div>
            <div class="col-md-6 image mx-auto">
              <img
                src={Diagnosztika}
                class="img-fluid service-pictures"
                alt=""
              />
            </div>
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
          <button
            className="rate-btn fw-bold mt-3 text-light"
            onClick={CreateRating}
          >
            Írj értékelést!
          </button>
        </div>
      </div>
    </div>
  );
}
export default Home;
