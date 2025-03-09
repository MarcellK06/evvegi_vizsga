import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Check, X, Microscope, DollarSign, Shield } from "lucide-react";
import React from "react";
import AltalanosJavitasok from "../Media/alt.jpg";
import { FaWrench, FaSprayCan, FaCar, FaMicrochip } from "react-icons/fa";
import KulsoBelso from "../Media/kzm.jpg";
import Gumiabroncs from "../Media/giabr.jpg";
import Diagnosztika from "../Media/da.jpg";
import Ratings from "../Components/Rating/Ratings";
const ServiceCard = ({ title, description, image, icon: Icon, reverse }) => {
  return (
    <motion.div
      className={`service-card ${reverse ? "reverse" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="service-content">
        <div className="service-icon">
          <Icon size={40} />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <motion.div
        className="service-image"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <img src={image || "/placeholder.svg"} alt={title} />
      </motion.div>
    </motion.div>
  );
};

const services = [
  {
    title: "Általános javítások és karbantartás",
    description:
      "Rendszeres ellenőrzések, olajcsere, fék- és futóműjavítás, valamint egyéb kopó alkatrészek cseréje a jármű megbízható működése érdekében.",
    image: AltalanosJavitasok,
    icon: FaWrench,
  },
  {
    title: "Autó külső és belső tisztítás",
    description:
      "Professzionális mosás, polírozás és belső tér ápolás a jármű esztétikai és higiéniai állapotának megőrzése érdekében.",
    image: KulsoBelso,
    icon: FaSprayCan,
  },
  {
    title: "Gumiabroncs javítás / csere",
    description:
      "Sérült gumiabroncsok javítása vagy új abroncsok felszerelése az optimális tapadás és biztonság érdekében.",
    image: Gumiabroncs,
    icon: FaCar,
  },
  {
    title: "Diagnosztika",
    description:
      "Modern műszerekkel végzett hibakódolvasás és műszaki állapotfelmérés a jármű elektromos és mechanikai problémáinak gyors beazonosítására.",
    image: Diagnosztika,
    icon: FaMicrochip,
  },
];

const FeatureCard = ({ feature, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="col"
    >
      <div className="card h-100 bg-dark text-white">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <feature.icon className="me-2" size={24} />
            <h5 className="card-title mb-0">{feature.title}</h5>
          </div>
          <p className="card-text">{feature.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

function Home() {
  const navi = useNavigate();

  const features = [
    {
      title: "Tapasztalt Szakemberek",
      description:
        "Több éves tapasztalattal rendelkező autószerelőink precízen és gyorsan dolgoznak, hogy autója a legjobb kezekben legyen.",
      icon: Check,
    },
    {
      title: "Gyors és Megbízható Szolgáltatás",
      description:
        "Tudjuk, hogy az idő pénz! Szervizünk gyors, hatékony és pontos munkát végez, hogy minél hamarabb újra útra kelhessen.",
      icon: X,
    },
    {
      title: "Modern Diagnosztikai Eszközök",
      description:
        "A legújabb technológiát használjuk a hibák gyors és pontos felderítésére, így elkerülhetők a felesleges javítások és költségek.",
      icon: Microscope,
    },
    {
      title: "Korrekt Ár és Átláthatóság",
      description:
        "Nincsenek rejtett költségek! Előre ismertetjük az árakat, és csak azt javítjuk, amire valóban szükség van.",
      icon: DollarSign,
    },
  ];

  const warrantyRef = React.useRef(null);
  const isWarrantyInView = useInView(warrantyRef, { once: true });

  return (
    <>
      <div className="home-header">
        <div className="">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <h1
            className="brand-title text-center text-white"
            style={{ fontSize: "100px" }}
          >
            Szalkacar
          </h1>
          <h5
            className="brand-title text-center text-white"
            style={{ fontSize: "40px" }}
          >
            Szervíz / Kozmetika / Gumiabroncs...
          </h5>
          <div className="d-flex justify-content-center">
            <h3 className="text-center brand-title slogen">
              Az autód dokija, hogy mindig mozgásban maradj!
            </h3>
          </div>
          <div>
            <div className="d-flex justify-content-center">
              <button
                className="h-btn brand-title"
                onClick={() => navi("/appointment")}
              >
                Foglalj időpontot most
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="why-choose-us py-5">
        <div className="container">
          <motion.h2
            className="text-center mb-5"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Miért válasszon minket?
          </motion.h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>

          <motion.div
            className="row mt-4"
            ref={warrantyRef}
            initial={{ opacity: 0, y: 50 }}
            animate={
              isWarrantyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="col">
              <motion.div
                className="card bg-dark text-white"
                whileHover={{ scale: 1.02 }}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <Shield className="me-2" size={24} />
                    <h5 className="card-title mb-0">
                      Garancia Minden Javításra
                    </h5>
                  </div>
                  <p className="card-text">
                    Szervizünk minden elvégzett munkára garanciát vállal, így
                    biztos lehet benne, hogy autója megbízható állapotban hagyja
                    el a műhelyt.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      <div>
        <section className="services-section">
          <motion.h2
            className="services-title"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Szolgáltatásaink
          </motion.h2>
          <div className="services-container">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} reverse={index % 2 !== 0} />
            ))}
          </div>
        </section>
      </div>
      <div>
        <Ratings />
      </div>
    </>
  );
}

export default Home;
