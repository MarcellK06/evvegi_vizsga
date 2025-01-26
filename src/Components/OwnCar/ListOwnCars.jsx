import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";

function ListOwnCars() {
  var API = CONFIG.API;

  var szotar = {
    km: "Kilóméteróra állás",
    brand: "Gyártó",
    model: "Gyártmány",
    engineCode: "Motorkód",
    licensePlate: "Rendszám",
    year: "Évjárat",
  };

  const [ownCars, setOwnCars] = useState([]);
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

  const JsonEntry = (i, el) => {
    return (
      <div className="d-flex">
        <p>{szotar[i]}:&emsp;</p>
        <p className="fw-bold">{el[i]}</p>
      </div>
    );
  };

  const HandleDelete = (el) => {
    var userid = Cookie.get("userid");
    var carid = el.id;
    $.ajax({
      url: `${API}/car/delete`,
      type: "post",
      data: {
        userid: userid,
        carid: carid,
      },
      success: function (resp) {
        window.location.reload();
      },
    });
  };

  const OwnCarEntry = (el) => {
    return (
      <div className="post my-3">
        {Object.keys(el.data).map((i) => JsonEntry(i, el.data))}
        <div className="d-flex">
          <p>Alvázszám:&emsp;</p>
          <p className="fw-bold">{el.vin}</p>
        </div>
        <div className="d-flex">
          <p>Jármű Állapota:&emsp;</p>
          <p className="fw-bold">{el.status}</p>
        </div>
        <img src={el.images[0]} alt="Forgalmi Kép 1. Oldal" />
        <img src={el.images[1]} alt="Forgalmi Kép 2. Oldal" />
        <img src={el.images[2]} alt="Jármű Alvázszám Kép" />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <input
              type="button"
              value="Törlés"
              className="form-control m-3"
              onClick={() => HandleDelete(el)}
            />
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    LoadOwnCars();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">{ownCars.map((i) => OwnCarEntry(i))}</div>
        <div className="col-2"></div>
      </div>
    </div>
  );
}

export default ListOwnCars;
