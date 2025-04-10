import Cookie from "js-cookie";
import { useContext, useEffect, useState } from "react";
import $ from "jquery";
import CONFIG from "../config.json";
import { ModalContext } from "../Providers/ModalProvider";
import {
  FaPen,
  FaEye,
  FaCar,
  FaXing,
  FaCheck,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { RxCheck, RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
function CarsAdminPanel() {
  const API = CONFIG.API;
  const [cars, setCars] = useState([]);
  const { CreateModal } = useContext(ModalContext);
  const [hasPermissions, setHasPermissions] = useState(0);
  const navi = useNavigate();
  const CheckUser = () => {
    var rankid = Cookie.get("rank");
    if (rankid != 1) {
      navi("/");
    }
  };

  class Car {
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
  const GetNotApprovedVehicles = () => {
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/cars/admin/get`,
      type: "post",
      data: {
        userid: userid,
      },
      success: (resp) => {
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
            new Car(
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
        setCars(c);
      },
    });
  };
  useEffect(() => {
    CheckUser();
    GetNotApprovedVehicles();
  }, []);

  const JsonEntry = (i, el, id) => {
    var data = el;
    return (
      <div className="d-flex flex-column">
        <p>{i}&emsp;</p>
        <input
          type="text"
          className="form-control"
          name={i}
          id={`${id}-${i}`}
          defaultValue={data[i]}
        />
      </div>
    );
  };

  const Approve = (el) => {
    var data = new FormData();
    var userid = Cookie.get("userid");
    var vin = document.getElementById(`${el.id}-vin`).value;
    var status = document.getElementById(`${el.id}-status`).value;
    Object.keys(el.data).forEach((i) => {
      var val = document.getElementById(`${el.id}-${i}`).value;
      data.append(i, val);
    });
    data.append("vin", vin);
    data.append("status", status);
    data.append("carid", el.id);
    data.append("userid", userid);
    $.ajax({
      url: `${API}/cars/admin/approve`,
      type: "post",
      data: data,
      processData: false,
      contentType: false,
      success: (resp) => {
        window.location.reload();
      },
    });
  };
  const Decline = (el) => {
    var data = new FormData();
    var userid = Cookie.get("userid");
    var vin = document.getElementById(`${el.id}-vin`).value;
    var status = document.getElementById(`${el.id}-status`).value;
    Object.keys(el.data).forEach((i) => {
      var val = document.getElementById(`${el.id}-${i}`).value;
      data.append(i, val);
    });
    data.append("vin", vin);
    data.append("status", status);
    data.append("carid", el.id);
    data.append("userid", userid);
    $.ajax({
      url: `${API}/cars/admin/decline`,
      type: "post",
      data: data,
      processData: false,
      contentType: false,
      success: (resp) => {
        window.location.reload();
      },
    });
  };

  const CarEntry = (el) => {
    return (
      <div className="car-detail-modal p-3 my-3">
        <div className="car-specs d-flex flex-wrap mb-4">
          {Object.keys(el.data).map((i) => JsonEntry(i, el.data, el.id))}
          <div className="car-detail-item">
            <p className="detail-label">Alvázszám</p>
            <input
              type="text"
              className="form-control detail-value"
              id={`${el.id}-vin`}
              defaultValue={el.vin}
            />
          </div>
          <div className="car-detail-item">
            <p className="detail-label">Jármű Állapota</p>
            <input
              type="text"
              className="form-control detail-value"
              id={`${el.id}-status`}
              defaultValue={el.status}
            />
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
                  />
                  <div
                    className="image-overlay"
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
                  >
                    <FaEye className="view-icon" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-9"></div>
          <div className="col-3 d-flex">
            <button
              className="action-buttonad acceptad"
              style={{ color: "white" }}
              onClick={() => Approve(el)}
            >
              <RxCheck size={25} />
            </button>

            <button
              className="action-buttonad declinead"
              style={{ color: "white" }}
              onClick={() => Decline(el)}
            >
              <RxCross1 size={25} />
            </button>
          </div>
        </div>
      </div>
    );
  };

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
                  CarEntry(el),
                  true
                )
              }
            >
              <FaEye />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="d-flex flex-column">
      <p className="fs-3 my-3 mx-auto">Jóváhagyandó Járművek</p>
      <div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            {cars.length > 0 ? (
              cars.map((i) => carListEntry(i))
            ) : (
              <p className="fs-5">Jelenleg nincs jóváhagyandó jármű..</p>
            )}
          </div>
          <div className="col-2"></div>
        </div>
      </div>
    </div>
  );
}

export default CarsAdminPanel;
