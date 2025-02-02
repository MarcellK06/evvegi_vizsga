import { useContext, useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { ModalContext } from "../../Providers/ModalProvider";

function CreateListing() {
  var API = CONFIG.API;

  const { CreateModal } = useContext(ModalContext);
  const itemNameRef = useRef();
  const itemDescriptionRef = useRef();
  const itemPriceRef = useRef();
  const carRef = useRef();

  const [ownCars, setOwnCars] = useState([]);

  const HandleCreateListing = () => {
    var itemName = itemNameRef.current.value;
    var itemDescription = itemDescriptionRef.current.value;
    var itemPrice = itemPriceRef.current.value;
    var userid = Cookie.get("userid");
    var car = carRef.current.value;
    if (itemName == "" || itemDescription == "" || itemPrice == "" || car == "SELECT") {
      CreateModal(<><p className="fs-3 fw-bold">Hibás Hírdetés!</p><hr/></>, <p className="fs-4">Kérem Töltsön ki minden mezőt!</p>, true);

    }
    $.ajax({
      url: `${API}/marketplace/listings/create`,
      type: "post",
      data: {
        userid: userid,
        itemname: itemName,
        itemdescription: itemDescription,
        itemprice: itemPrice,
        car: car,
      },
      success: function (resp) {
        CreateModal(<><p className="fs-3 fw-bold">Sikeres Hírdetés Létrehozás!</p><hr/></>, <p className="fs-4">Kérem várjon türelemmel, míg adminisztrátoraink feldolgozzák hírdetését.</p>, true);
      },
    });
  };

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

  useEffect(() => {
    LoadOwnCars();
  }, []);

  const CreateListingModal = () => {
    return (
      <>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
            <p className="fw-bold">
              Mielőtt hírdetése életbe lép, azelőtt egyik adminisztrátorunknak
              jóva kell hagynia.
            </p>
          </div>
          <div className="col-1"></div>
        </div>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
            <label htmlFor="itemname">Tárgy neve</label>
            <input
              type="text"
              name="itemname"
              id="itemname"
              className="form-control"
              ref={itemNameRef}
              required
            />
          </div>
          <div className="col-1"></div>
        </div>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
            <label htmlFor="itemdescription">Tárgy leírása</label>
            <textarea
              rows={3}
              maxLength={500}
              name="itemdescription"
              id="itemdescription"
              className="form-control"
              ref={itemDescriptionRef}
              required
            />
          </div>
          <div className="col-1"></div>
        </div>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
            <div className="row">
              <div className="col-3">
                <label htmlFor="itemprice">Tárgy ára</label>
                <input
                  type="number"
                  name="itemprice"
                  id="itemprice"
                  className="form-control"
                  ref={itemPriceRef}
                  required
                />
              </div>
              <div className="col-9">
                <div className="d-flex flex-column">
                  <label htmlFor="owncars">
                    Jármű, amelyből kijött a tárgy(OPCIONÁLIS)
                  </label>
                  <select
                    name="owncars"
                    id="owncars"
                    className="form-control"
                    ref={carRef}
                  >
        <option value={"SELECT"}>Válasszon járművet</option>
                    {ownCars.map((i) => ownCarEntry(i))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>

        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            <input
              type="button"
              value="Közzététel"
              onClick={HandleCreateListing}
              className="form-control mx-auto hoverbutton my-3"
            />
          </div>
          <div className="col-2"></div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="row d-flex">
        <div className="col-5"></div>
        <div className="col-2 mx-5">
          <input
            type="button"
            value="Hírdetés létrehozása"
            onClick={() =>
              CreateModal(
                <p className="border-bottom fs-3 fw-bold">Hírdetés</p>,
                CreateListingModal,
                true
              )
            }
            className="form-control my-3 hoverbutton postcolor"
          />
        </div>
        <div className="col-5"></div>
      </div>
    </>
  );
}

export default CreateListing;
