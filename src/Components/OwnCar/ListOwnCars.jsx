import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../Providers/ModalProvider";

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
  const {CreateModal} = useContext(ModalContext);
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
          if (el.images != "NINCS") {
          el.images = el.images.split(",");
          for(var k = 0; k < el.images.length; k++)
            el.images[k] = `${API}/car/images/${el.id}/${k}`;
        }
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
        <div className="row justify-content-between d-flex" style={{width: "50vw"}}>
          <div className="col-4 mx-auto d-flex">
            <img src={el.images[0]} alt="" className="object-fit-contain mx-auto hoverbutton" style={{height: "30vh"}} onClick={() => CreateModal(<div><p className="fs-3">Fénykép Megtekintés</p><hr /></div>, <img src={el.images[0]} style={{height: "70vh"}}/>, true)} />
        </div>
        <div className="col-4 mx-auto d-flex">
        <img src={el.images[1]} alt="" className="object-fit-contain mx-auto hoverbutton" style={{height: "30vh"}} onClick={() => CreateModal(<div><p className="fs-3">Fénykép Megtekintés</p><hr /></div>, <img src={el.images[1]} style={{height: "70vh"}}/>, true)} />
        </div>
        <div className="col-4 mx-auto d-flex">
        <img src={el.images[2]} alt="" className="object-fit-contain mx-auto hoverbutton" style={{height: "30vh"}} onClick={() => CreateModal(<div><p className="fs-3">Fénykép Megtekintés</p><hr /></div>, <img src={el.images[2]} style={{height: "70vh"}}/>, true)} />
        </div>
        </div>
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
