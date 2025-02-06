import { useContext, useRef } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { FaFile } from "react-icons/fa";
import { ModalContext } from "../../Providers/ModalProvider";

function AddOwnCar() {
  const { CreateModal } = useContext(ModalContext);
  var API = CONFIG.API;
  const brandRef = useRef();
  const modelRef = useRef();
  const yearRef = useRef();
  const licenseplateRef = useRef();
  const vinRef = useRef();
  const registrationRef = useRef();

  const HandleCarAdd = () => {
    var userid = Cookie.get("userid");
    var brand = brandRef.current.value;
    var model = modelRef.current.value;
    var year = yearRef.current.value;
    var licenseplate = licenseplateRef.current.value;
    var vin = vinRef.current.value;
    if (
      brand == "" ||
      model == "" ||
      year == "" ||
      licenseplate == "" ||
      vin == ""
    ) {
      CreateModal(
        <p className="fs-3">A jármű hozzáadása sikertelen!</p>,
        <p>Kérjük elenőrizze adatait, hogy mindent jól adott meg!</p>,
        true
      );
      return;
    }
    var registration = ""; //registrationRef.current.value;
    $.ajax({
      url: `${API}/car/add`,
      data: {
        userid: userid,
        brand: brand,
        model: model,
        year: year,
        licenseplate: licenseplate,
        vin: vin,
        registration: registration,
      },
      type: "post",
      success: function (resp) {
        CreateModal(
          <p className="fs-3">Sikeres jármű hozzadás</p>,
          <p>
            Kérjük várjon, míg egy adminisztrátor átnézi jármű adatait és
            jováhagyja!
          </p>,
          true
        );
      },
    });
  };

  //CreateModal("asd", <h1>BANDI</h1>, true)

  const AddCarModal = () => {
    return (
      <div className="text-center">
        <p>
          Járművét feltöltése után egyik adminisztrátorunknak jóva kell hagynia,
          ez egy napig is eltarthat!
        </p>
        <div className="row my-2">
          <div className="col-1"></div>
          <div className="col-10 mx-auto d-flex justify-content-center">
            <div className="row d-flex justify-content-center">
              <div className="col-3 d-flex flex-column">
                <label htmlFor="brand">Gyártó</label>
                <input
                  type="text"
                  name="brand"
                  id="brand"
                  className="form-control"
                  ref={brandRef}
                  required
                />
              </div>
              <div className="col-3 d-flex flex-column">
                <label htmlFor="model">Gyártmány</label>
                <input
                  type="text"
                  name="model"
                  id="model"
                  className="form-control"
                  ref={modelRef}
                  required
                />
              </div>
              <div className="col-3 d-flex flex-column">
                <label htmlFor="year">Évjárat</label>
                <input
                  type="text"
                  name="year"
                  id="year"
                  className="form-control"
                  ref={yearRef}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
        <div className="row my-2">
          <div className="col-1"></div>
          <div className="col-10 mx-auto d-flex justify-content-center">
            <div className="row">
              <div className="col-6 d-flex flex-column">
                <label htmlFor="licenseplate">Rendszám</label>
                <input
                  type="text"
                  name="licenseplate"
                  id="licenseplate"
                  className="form-control"
                  ref={licenseplateRef}
                  required
                />
              </div>
              <div className="col-6 d-flex flex-column">
                <label htmlFor="vin">Alvázszám</label>
                <input
                  type="text"
                  name="vin"
                  id="vin"
                  className="form-control"
                  ref={vinRef}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
        <div className="row">
          <div className="row">
            <div className="col-6 mx-auto my-3 d-flex flex-column">
              <label htmlFor="images">Forgalmi eleje, hátúlja, A.SZ</label>
              <input
                type="file"
                name="images"
                id="images"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-3 mx-auto d-flex justify-content-center">
            <input
              type="button"
              value="Feltöltés"
              className="form-control"
              onClick={HandleCarAdd}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="row d-flex justify-content-end">
        <div className="col-5"></div>
        <div className="col-2">
          <input
            type="button"
            value="Jármű Hozzáadása"
            onClick={() =>
              CreateModal(
                <p className="border-bottom fs-3 fw-bold">Jármű Hozzáadása</p>,
                AddCarModal,
                true
              )
            }
            className="form-control my-3 postcolor hoverbutton"
          />
        </div>
        <div className="col-5"></div>
      </div>
    </>
  );
}

export default AddOwnCar;
