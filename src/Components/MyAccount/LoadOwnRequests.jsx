import { useContext, useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import Cookie from "js-cookie";
import $ from "jquery";
import { ModalContext } from "../../Providers/ModalProvider";
import Cookies from "js-cookie";
import { Ribbon } from "lucide-react";

function LoadOwnRequests() {
  var API = CONFIG.API;
  const { CreateModal } = useContext(ModalContext);

  class RequestStruct {
    constructor(id, title, description, data, vin, answered) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.data = data;
      this.vin = vin;
      this.answered = answered;
      this.email = "USER";
    }
  }
  class AnonRequestStruct {
    constructor(id, title, description, answered, email) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.answered = answered;
      this.email = email;
    }
  }

  const [requests, setRequests] = useState([]);

  const LoadRequests = () => {
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/requests/load`,
      type: "post",
      data: {
        userid: userid,
      },
      success: function (resp) {
        var rs = [];
        resp.forEach((el) => {
          if (el.email == "USER") {
            var id = el.id;
            var title = el.title;
            var description = el.description;
            var jsondata = JSON.parse(el.data);
            var vin = el.vin;
            var replied = el.replied;
            rs.push(
              new RequestStruct(id, title, description, jsondata, vin, replied)
            );
          } else {
            var id = el.id;
            var title = el.title;
            var description = el.description;
            var email = el.email;
            var replied = el.replied;
            rs.push(
              new AnonRequestStruct(id, title, description, replied, email)
            );
          }
        });
        setRequests(rs);
      },
    });
  };

  const responseRef = useRef();

  const SendResponse = (el) => {
    var response = responseRef.current.value;
    if (response == "") return;
    var userid = Cookie.get("userid");
    var requestid = el.id;
    $.ajax({
      url: `${API}/requests/answer`,
      type: "post",
      data: {
        userid: userid,
        requestid: requestid,
        response: response,
      },
      success: (resp) => {
        window.location.reload();
      },
    });
  };

  const AnswerRequest = (el) => {
    var title = el.title;
    var description = el.description;
    console.log(el.answered);
    if (!el.answered)
      return (
        <>
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
              <div className="row my-2">
                <label htmlFor="title">Panasz</label>
                <textarea
                  name="title"
                  id="title"
                  className="form-control"
                  value={title}
                  disabled
                />
              </div>
              <div className="row my-2">
                <label htmlFor="title">Leírás</label>
                <textarea
                  name="description"
                  id="description"
                  className="form-control"
                  value={description}
                  disabled
                />
              </div>

              <div className="row my-2">
                <label htmlFor="response">Válasz</label>
                <textarea
                  name="response"
                  id="response"
                  className="form-control"
                  rows={5}
                  ref={responseRef}
                />
              </div>
              <input
                type="button"
                value="Elküldés"
                className="form-control"
                onClick={() => SendResponse(el)}
              />
            </div>
            <div className="col-1"></div>
          </div>
        </>
      );
    else
      return (
        <>
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
              <div className="row my-2">
                <label htmlFor="title">Panasz</label>
                <textarea
                  name="title"
                  id="title"
                  className="form-control"
                  value={title}
                  disabled
                />
              </div>
              <div className="row my-2">
                <label htmlFor="title">Leírás</label>
                <textarea
                  name="description"
                  id="description"
                  className="form-control"
                  value={description}
                  disabled
                />
              </div>
            </div>
            <div className="col-1"></div>
          </div>
        </>
      );
  };

  const DeleteRequest = (el) => {
    var userid = Cookies.get("userid");
    $.ajax({
      url: `${API}/requests/admin/delete`,
      type: "post",
      data: {
        userid: userid,
        requestid: el.id,
      },
      success: (resp) => {
        window.location.reload();
      },
    });
  };

  const RequestEntry = (el) => {
    if (el.email == "USER") {
      return <></>;
    } else {
      return (
        <div className="row my-3">
          <div className="col-2"></div>
          <div className="col-8">
            <div className="post">
              <div className="row">
                <div className="col-1"></div>
                <div className="col-10">
                  <div className="row my-2">
                    <label htmlFor="title">Email cím</label>
                    <textarea
                      rows={2}
                      value={el.email}
                      name="email"
                      id="email"
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="row my-2">
                    <label htmlFor="title">Fej</label>
                    <textarea
                      rows={2}
                      value={el.title}
                      name="title"
                      id="title"
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="row my-2">
                    <label htmlFor="description">Törzs</label>
                    <textarea
                      rows={5}
                      value={el.description}
                      name="description"
                      id="description"
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="row d-flex text-center">
                <p className="fw-bold mx-auto">
                  {el.answered ? "Válaszolva" : "Válaszra Vár"}
                </p>
              </div>
              {el.answered == 0 ? (
                <input
                  type="button"
                  value="Válaszolás"
                  className="form-control hoverbutton"
                  onClick={() =>
                    CreateModal(
                      <p className="mx-auto">Árajánlás válaszolás</p>,
                      AnswerRequest(el),
                      true
                    )
                  }
                />
              ) : (
                <input
                  type="button"
                  value="Törlés"
                  className="form-control hoverbutton"
                  onClick={() => DeleteRequest(el)}
                />
              )}
            </div>
          </div>
          <div className="col-2"></div>
        </div>
      );
    }
  };

  useEffect(() => {
    LoadRequests();
  }, []);
  const [activeRequest, setActiveRequest] = useState(null);

  const getActiveRequestComponent = (r) => {
    if (r.data != null)
    return (
      <>
        <div className="row mt-3">
          <div className="col-sm-2 mx-auto ms-2">
            <div className="fw-bold">Gyártmány</div>
            <div className=" ms-3">{r.data.brand}</div>
          </div>
          <div className="col-sm-2 mx-auto">
            <div className="fw-bold">Model</div>
            <div className=" ms-3">{r.data.model}</div>
          </div>
          <div className="col-sm-2 mx-auto">
            <div className="fw-bold">Motorkód</div>
            <div className="ms-3">{r.data.engineCode}</div>
          </div>
          <div className="col-sm-2 mx-auto">
            <div className="fw-bold">Rendszám</div>
            <div className="ms-3">{r.data.licensePlate}</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-sm-2 ms-2">
            <div className="fw-bold">Kilóméter</div>
            <div className=" ms-3">{r.data.km}</div>
          </div>
          <div className="col-sm-2">
            <div className="fw-bold">Alvázszám</div>
            <div className=" ms-3">{r.vin}</div>
          </div>
          <div className="col-sm-2">
            <div className="fw-bold">Válaszolva</div>
            <div className=" ms-3">{r.replied == 0 ? <b>Nem</b> : <b>Igen</b>}</div>
          </div>
          <div className="col-sm-2">
              <button className="btn btn-danger" onClick={() => DeleteRequest(r)}>Törlés</button>
          </div>
        </div>
        <div>
        <hr />
        <div className="container p-2 m-2 mx-auto rounded request-text-color">
          <p className="mt-2 ms-3 fs-4">
          <b>Cím</b>
          </p>
          <p className="ms-4">{r.title}</p></div>
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
              <hr />
            </div>
            <div className="col-1"></div>
          </div>
          <div className="container p-2 m-2 mx-auto rounded request-text-color">
          <p className="mb-3 ms-3 fs-4">
            <b>Leírás</b>
          </p>
          <p className="ms-4"> {r.description}</p></div>
          <div className="ms-2 row d-flex">
          </div>
        
        </div>
      </>
    );
    else {
      return (
        <>
          <div className="row mt-3 d-flex">
            <div className="col-sm-2 mx-auto">
              <div className="fw-bold">Email cím</div>
              <div className=" ms-3">{r.email}</div>
            </div>
            <div className="col-sm-2 mx-auto">
              <div className="fw-bold">Válaszolva</div>
              <div className=" ms-3">{r.replied == 0 ? <b>Nem</b> : <b>Igen</b>}</div>
            </div>
            <div className="col-sm-2 mx-auto">
                <button className="btn btn-danger" onClick={() => DeleteRequest(r)}>Törlés</button>
            </div>
          </div>
          <div>
          <hr />
          <div className="container p-2 m-2 mx-auto rounded request-text-color">
            <p className="mt-2 ms-3 fs-4">
            <b>Cím</b>
            </p>
            <p className="ms-4">{r.title}</p></div>
            <div className="row">
              <div className="col-1"></div>
              <div className="col-10">
                <hr />
              </div>
              <div className="col-1"></div>
            </div>
            <div className="container p-2 m-2 mx-auto rounded request-text-color">
            <p className="mb-3 ms-3 fs-4">
              <b>Leírás</b>
            </p>
            <p className="ms-4"> {r.description}</p></div>
          
          </div>
        </>
      );
    }
  };
  const UserEntry = (u) => {
    return (
      <>
        <div
          className=" ms-2 request-user mb-2"
          style={{ cursor: "pointer" }}
          onClick={() => setActiveRequest(u)}
        >
          <div className="ms-3">
            {u.email == "USER" ? "Regsztrált felhasználó" : u.email}
          </div>
          <div className="ms-5" style={{ fontSize: "15px" }}>
            {u.title.split("").slice(0, 25).join("")}...
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="row g-0">
        <div className="col-sm-2 request-userlist h-100">
          {requests.map((i) => UserEntry(i))}
        </div>
        <div className="col-sm request-data">
          {activeRequest == null ? (
            <div className="text-center mt-5 fw-bold ">
              Nincs kiválasztva ajánlatkérés.
            </div>
          ) : (
            getActiveRequestComponent(activeRequest)
          )}
          <div className="d-flex justify-content-center"></div>
        </div>
      </div>
    </>
  );
}

export default LoadOwnRequests;
