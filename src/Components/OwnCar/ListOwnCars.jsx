import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../Providers/ModalProvider";
import {
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaHourglassHalf,
  FaCar,
} from "react-icons/fa";

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
      <div className="car-detail-item">
        <p className="detail-label">{szotar[i]}</p>
        <p className="detail-value">{el[i]}</p>
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
      <div className="car-detail-modal p-3">
        <div className="car-specs d-flex flex-wrap mb-4">
          {Object.keys(el.data).map((i) => JsonEntry(i, el.data))}
          <div className="car-detail-item">
            <p className="detail-label">Alvázszám</p>
            <p className="detail-value">{el.vin}</p>
          </div>
          <div className="car-detail-item">
            <p className="detail-label">Jármű Állapota</p>
            <p className="detail-value">{el.status}</p>
          </div>
        </div>

        <hr className="divider" />

        <div className="car-images-container">
          <div className="row g-3">
            {el.images.map((img, index) => (
              <div className="col-md-4" key={index}>
                <div className="car-image-card">
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Car image ${index + 1}`}
                    className="img-fluid rounded car-thumbnail"
                    onClick={() =>
                      CreateModal(
                        <div>
                          <h4 className="modal-title">Fénykép Megtekintés</h4>
                          <hr className="divider" />
                        </div>,
                        <img
                          src={img || "/placeholder.svg"}
                          className="img-fluid modal-image"
                          alt={`Car image ${index + 1} full view`}
                        />,
                        true
                      )
                    }
                  />
                  <div className="image-overlay">
                    <FaEye className="view-icon" />
                  </div>
                </div>
              </div>
            ))}
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
      <div className="car-list-item" key={el.id}>
        <div className="car-card">
          <div className="car-info">
            <h3 className="car-nickname">{nickname}</h3>
            <div className="car-specs-summary">
              <span className="car-year">{year}</span>
              <span className="car-brand">{brand}</span>
              <span className="car-model">{model}</span>
              <span className="car-engine">{engineCode}</span>
            </div>
          </div>

          <div className="car-actions">
            <div
              className={`approval-status ${approved ? "approved" : "pending"}`}
            >
              {approved ? (
                <>
                  <FaCheckCircle className="status-icon" />
                  <span>Ellenőrizve!</span>
                </>
              ) : (
                <>
                  <FaHourglassHalf className="status-icon" />
                  <span>Ellenörzésre vár..</span>
                </>
              )}
            </div>

            <button
              className="action-button view-button"
              onClick={() =>
                CreateModal(
                  <div>
                    <h4 className="modal-title">
                      <FaCar className="me-2" />
                      {nickname}
                    </h4>
                    <hr className="divider" />
                  </div>,
                  OwnCarEntry(el),
                  true
                )
              }
            >
              <FaEye />
            </button>

            <button
              className="action-button delete-button"
              onClick={() => HandleDelete(el)}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="car-list-container">
      <div className="container py-4">
        <h2 className="section-title mb-4">
          <FaCar className="me-2" />
          Saját Járművek
        </h2>

        <div className="row">
          <div className="col-lg-10 col-md-12 mx-auto">
            {ownCars.length > 0 ? (
              ownCars.map((car) => carListEntry(car))
            ) : (
              <div className="no-cars-message">
                <p>Nincsenek járművek a listában</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListOwnCars;
