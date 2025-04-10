import { useContext, useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import { NavigatorContext } from "../../Providers/NavigatorProvider";
import Cookie from "js-cookie";
import { ModalContext } from "../../Providers/ModalProvider";

function Request() {
  var API = CONFIG.API;

  const subjectRef = useRef();
  const bodyRef = useRef();
  const ownCarsRef = useRef();
  const emailRef = useRef();
  const [ownCars, setOwnCars] = useState([]);
  const { CreateModal } = useContext(ModalContext);

  class OwnCar {
    constructor(id, data, vin, images, status) {
      this.id = id;
      this.data = data;
      this.vin = vin;
      this.images = images;
      this.status = status;
    }
  }

  const LoadOwnCars = () => {
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/car/load/all/${userid}`,
      success: function (resp) {
        var c = [];
        resp.forEach((el) => {
          var car = JSON.parse(el.data);
          c.push(new OwnCar(el.id, car, el.vin, el.images, el.status));
        });
        setOwnCars(c);
      },
    });
  };

  const ownCarEntry = (i) => {
    var vin = i.vin;
    var carid = i.id;
    return (
      <>
        <option value={carid}>{vin}</option>
      </>
    );
  };

  const SendRequest = () => {
    var subject = subjectRef.current.value;
    var body = bodyRef.current.value;
    var carid = ownCarsRef.current.value;
    if (subject == "" || body == "" || carid == "SELECT") {
      CreateModal(
        <>
          <p className="fs-3 fw-bold">Hibás árajánlat kérés!</p>
          <hr />
        </>,
        <p className="fs-4">Kérem töltse ki az összes mezőt!</p>,
        true
      );
      return;
    }
    var userid = Cookie.get("userid");

    $.ajax({
      url: `${API}/requests/send`,
      method: "post",
      data: {
        title: subject,
        description: body,
        carid: carid,
        userid: userid,
      },
      success: function (resp) {
        CreateModal(
          <>
            <p className="fs-3 fw-bold">Sikeres árajánlat kérés!</p>
            <hr />
          </>,
          <>
            <p className="fs-4">
              Kérem várjon, míg technikusaink válaszolnak kérésére.
            </p>
            <p>
              Ez pár órától egy napig is eltarthat, kérjük várjon türelemmel!
            </p>
          </>,
          true
        );
      },
    });
  };
  const SendRequestAnon = () => {
    var subject = subjectRef.current.value;
    var body = bodyRef.current.value;
    var email = emailRef.current.value;
    if (subject == "" || body == "" || email == "") {
      CreateModal(
        <>
          <p className="fs-3 fw-bold">Hibás árajánlat kérés!</p>
          <hr />
        </>,
        <p className="fs-4">Kérem Töltsön ki minden mezőt!</p>,
        true
      );
      return;
    }

    $.ajax({
      url: `${API}/requests/send/anon`,
      method: "post",
      data: {
        title: subject,
        description: body,
        email: email,
      },
      success: function (resp) {
        CreateModal(
          <>
            <p className="fs-3 fw-bold">Sikeres árajánlat kérés!</p>
            <hr />
          </>,
          <>
            <p className="fs-4">
              Kérem várjon, míg technikusaink válaszolnak kérésére emailen
              keresztül!
            </p>
            <p>
              Ez pár órától egy napig is eltarthat, kérjük várjon türelemmel!
            </p>
          </>,
          true
        );
      },
    });
  };
  const { _Navigator } = useContext(NavigatorContext);

  const loggedIn = Cookie.get("userid") != undefined;

  useEffect(() => {
    console.log(Cookie.get("userid"));
    _Navigator.footerFix();
    if (loggedIn) LoadOwnCars();
  }, []);
  if (loggedIn) {
    return (
      <div className="quote-container">
        <div className="quote-header">
          <h2 className="quote-title">Árajánlat Kérése</h2>
        </div>
        <div className="quote-form-wrapper">
          <div className="quote-form">
            <div className="form-group">
              <label htmlFor="subject" className="form-label">
                <span className="label-title">Cím</span>
                <span className="label-description ms-2">
                  Írja le röviden, mit tapasztal járműve!
                </span>
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                className="input-field"
                ref={subjectRef}
              />
            </div>

            <div className="form-group">
              <label htmlFor="body" className="form-label">
                <span className="label-title">Leírás</span>
                <span className="label-description ms-2">
                  Írja le részletesebben járműve problémáját!
                </span>
              </label>
              <input
                type="text"
                name="body"
                id="body"
                className="input-field"
                ref={bodyRef}
              />
            </div>

            <div className="form-group">
              <label htmlFor="owncars" className="form-label">
                <span className="label-title">Saját Járművek</span>
              </label>
              <select
                name="owncars"
                id="owncars"
                className="select-field"
                ref={ownCarsRef}
              >
                <option value={"SELECT"}>Válasszon járművet</option>
                {ownCars.map((i) => ownCarEntry(i))}
              </select>
            </div>

            <button
              type="button"
              className="submit-button"
              onClick={SendRequest}
            >
              Árajánlat Kérése
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="quote-container">
        <div className="quote-header">
          <h2 className="quote-title">Árajánlat Kérése</h2>
        </div>
        <div className="quote-form-wrapper">
          <div className="quote-form">
            <div className="form-group">
              <label htmlFor="subject" className="form-label">
                <span className="label-title">
                  Cím<span className="required-mark">*</span>
                </span>
                <span className="label-description">
                  Írja le röviden, mit tapasztal járműve!
                </span>
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                className="input-field"
                ref={subjectRef}
              />
            </div>

            <div className="form-group">
              <label htmlFor="body" className="form-label">
                <span className="label-title">
                  Leírás<span className="required-mark">*</span>
                </span>
                <span className="label-description">
                  Írja le részletesebben járműve problémáját!
                </span>
              </label>
              <textarea
                name="body"
                id="body"
                className="textarea-field"
                ref={bodyRef}
                rows={8}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-title">
                  Email cím <span className="required-mark">*</span>
                </span>
                <span className="label-description">
                  Adja meg email címét ahol elérhetjük!
                </span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="input-field"
                ref={emailRef}
              />
            </div>

            <button className="submit-button" onClick={SendRequestAnon}>
              Ajánlat kérése
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Request;
