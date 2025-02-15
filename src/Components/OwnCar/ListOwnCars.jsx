import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../Providers/ModalProvider";
import { FaEye, FaTrash } from "react-icons/fa";

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
  const { CreateModal } = useContext(ModalContext);
  class OwnCar {
    constructor(id, data, vin, images, status, nickname, approved) {
      this.id = id;
      this.data = data;
      this.vin = vin;
      this.images = images;
      this.status = status;
      this.nickname = nickname;
      this.approved = approved;
    }
  }

  const LoadOwnCars = () => {
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/car/load/all/${userid}`,
      success: function (resp) {
        var c = [];
        if (typeof resp == "string") resp = JSON.parse(resp);
        resp.forEach((el) => {
          var car = JSON.parse(el.data);
          if (el.images != "NINCS") {
            el.images = el.images.split(",");
            for (var k = 0; k < el.images.length; k++)
              el.images[k] = `${API}/car/images/${el.id}/${k}`;
          }
          c.push(
            new OwnCar(
              el.id,
              car,
              el.vin,
              el.images,
              el.status,
              el.nickname,
              el.approved
            )
          );
        });
        setOwnCars(c);
      },
    });
  };

  const JsonEntry = (i, el) => {
    return (
      <div className="d-flex flex-column">
        <p>{szotar[i]}&emsp;</p>
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
      <div className="post my-3 text-center">
        <div className="d-flex">
          {Object.keys(el.data).map((i) => JsonEntry(i, el.data))}
          <div>
            <p>Alvázszám&emsp;</p>
            <p className="fw-bold">{el.vin}</p>
          </div>
          <div>
            <p>Jármű Állapota:&emsp;</p>
            <p className="fw-bold">{el.status}</p>
          </div>
        </div>
        <hr />
        <div>
          <div
            className="row justify-content-between d-flex"
            style={{ width: "50vw" }}
          >
            <div className="col-4 mx-auto d-flex">
              <img
                src={el.images[0]}
                alt=""
                className="object-fit-contain mx-auto hoverbutton"
                style={{ height: "30vh" }}
                onClick={() =>
                  CreateModal(
                    <div>
                      <p className="fs-3">Fénykép Megtekintés</p>
                      <hr />
                    </div>,
                    <img src={el.images[0]} style={{ height: "70vh" }} />,
                    true
                  )
                }
              />
            </div>
            <div className="col-4 mx-auto d-flex">
              <img
                src={el.images[1]}
                alt=""
                className="object-fit-contain mx-auto hoverbutton"
                style={{ height: "30vh" }}
                onClick={() =>
                  CreateModal(
                    <div>
                      <p className="fs-3">Fénykép Megtekintés</p>
                      <hr />
                    </div>,
                    <img src={el.images[1]} style={{ height: "70vh" }} />,
                    true
                  )
                }
              />
            </div>
            <div className="col-4 mx-auto d-flex">
              <img
                src={el.images[2]}
                alt=""
                className="object-fit-contain mx-auto hoverbutton"
                style={{ height: "30vh" }}
                onClick={() =>
                  CreateModal(
                    <div>
                      <p className="fs-3">Fénykép Megtekintés</p>
                      <hr />
                    </div>,
                    <img src={el.images[2]} style={{ height: "70vh" }} />,
                    true
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    LoadOwnCars();
  }, []);

  const carListEntry = (el) => {
    var nickname = el.nickname;
    var brand = el.data.brand;
    var model = el.data.model;
    var year = el.data.year;
    var approved = el.approved;
    var engineCode = el.data.engineCode;
    return (
      <>
        <div className="row postcolor my-3 p-2 rounded">
          <div className="col-4">
            <p className="fs-3 m-0">{nickname}</p>
            <div className="d-flex my-1">
              <p className="fs-9 mx-2 fw-bold">{year}</p>
              <p className="fs-9 mx-2 fw-bold">{brand}</p>
              <p className="fs-9 mx-2 fw-bold">{model}</p>
              <p className="fs-9 mx-2 fw-bold">{engineCode}</p>
            </div>
          </div>
          <div className="col-5"></div>
          <div className="col-3 d-flex align-items-center justify-content-end">
            <p
              className={`fs-9 bold ${
                approved ? "text-success" : "text-danger"
              } m-0 mx-2`}
            >
              {approved ? "Ellenőrizve!" : "Ellenörzésre vár.."}
            </p>
            <FaEye
              size={25}
              className="mx-3 pointer"
              onClick={() =>
                CreateModal(
                  <div>
                    <p className="fs-3">{nickname}</p>
                    <hr />
                  </div>,
                  OwnCarEntry(el),
                  true
                )
              }
            />
            <FaTrash
              size={25}
              className="mx-3 pointer"
              onClick={() => HandleDelete(el)}
            />
          </div>
        </div>
      </>
    );
  };
  //{ownCars.map((i) => OwnCarEntry(i))}
  return (
    <div>
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">{ownCars.map((i) => carListEntry(i))}</div>
        <div className="col-2"></div>
      </div>
    </div>
  );
}

export default ListOwnCars;
