import { useContext, useRef } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { FaFile } from "react-icons/fa";
import { ModalContext } from "../../Providers/ModalProvider";

function AddOwnCar() {
  const { CreateModal } = useContext(ModalContext);
  var API = CONFIG.API;
  const nicknameRef = useRef();
  const brandRef = useRef();
  const modelRef = useRef();
  const yearRef = useRef();
  const licenseplateRef = useRef();
  const vinRef = useRef();
  const requiredImagesRef = useRef();

  const HandleCarAdd = () => {
    var userid = Cookie.get("userid");
    var nickname = nicknameRef.current.value;
    var brand = brandRef.current.value;
    var model = modelRef.current.value;
    var year = yearRef.current.value;
    var licenseplate = licenseplateRef.current.value;
    var vin = vinRef.current.value;
    if (
      nickname == "" ||
      brand == "" ||
      model == "" ||
      year == "" || year.length < 4 ||
      licenseplate == "" || licenseplate.length < 6 ||
      vin == "" || vin.length != 17
    ) {
      CreateModal(
        <p className="fs-3">A jármű hozzáadása sikertelen!</p>,
        <p>Kérjük elenőrizze adatait, hogy mindent jól adott meg!</p>,
        true
      );
      return;
    }
    var requiredImages = requiredImagesRef.current.files;
    if (!requiredImages) {
      CreateModal(<div><p className="fs-3">Hibás adatbevitel</p><hr /></div>, <><p className="fs-4">Kérem, adja meg a kötelező képeket.</p></>, true);
      return;
    }
    if (requiredImages.length != 3)
    {
      CreateModal(<div><p className="fs-3">Hibás adatbevitel</p><hr /></div>, <><p className="fs-4">Kérem, adja meg az összes szükséges képet! Ez maximum 3 fájl lehet.</p></>, true);
      return;
    }
    var data = new FormData();
    data.append("userid", userid);
    data.append("nickname", nickname);
    data.append("brand", brand);
    data.append("model", model);
    data.append("year", year);
    data.append("licenseplate", licenseplate);
    data.append("vin", vin);
    data.append("registration_file_1", requiredImages[0]);
    data.append("registration_file_2", requiredImages[1]);
    data.append("registration_file_3", requiredImages[2]);
    $.ajax({
      url: `${API}/car/add`,
      data: data,
      processData: false,
      contentType: false,
      type: "post",
      success: function (resp) {
        CreateModal(
          <p className="fs-3">Sikeres jármű hozzadás</p>,
          <p>
            Kérjük várjon, míg egy adminisztrátor átnézi jármű adatait és
            jováhagyja azt!
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
          <div className="col-12 mx-auto d-flex justify-content-center">
            <div className="row d-flex justify-content-center">
              <div className="col-12 d-flex flex-column">
                <label htmlFor="nickname">Jármű azonositója</label>
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  className="form-control"
                  ref={nicknameRef}
                  required
                />
              </div>
            </div>
          </div>
        </div>
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
                ref={requiredImagesRef}
                required
                accept="image/png, image/jpeg"
                multiple
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
