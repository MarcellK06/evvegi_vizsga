import { useContext, useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import Cookie from "js-cookie";
import $ from "jquery";
import { ModalContext } from "../../Providers/ModalProvider";

function ActiveRequests() {
  var API = CONFIG.API;
  const {CreateModal} = useContext(ModalContext);

  class RequestStruct {
    constructor(id, title, description, data, vin, answered) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.data = data;
      this.vin = vin;
      this.answered = answered;
    }
  }

  const [requests, setRequests] = useState([]);

  const LoadRequests = () => {
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/requests/all`,
      type: "post",
      data: {
        userid: userid,
      },
      success: function (resp) {
        var rs = [];
        resp.forEach((el) => {
          var id = el.id;
          var title = el.title;
          var description = el.description;
          var jsondata = JSON.parse(el.data);
          var vin = el.vin;
          var replied = el.replied;
          rs.push(new RequestStruct(id, title, description, jsondata, vin, replied));
        });
        setRequests(rs);
      },
    });
  };

  const responseRef = useRef();

  const SendResponse = (el) => {
    var response = responseRef.current.value;
    if (response == "")
      return;
    var userid = Cookie.get("userid");
    var requestid = el.id;
    $.ajax({
      url: `${API}/requests/answer`,
      type: "post",
      data: {
        userid: userid,
        requestid: requestid,
        response: response
        },   
    success: (resp) => {
      window.location.reload();
    }
    });
  }

  const AnswerRequest = (el) => {
    var title = el.title;
    var description = el.description;
    return (<>
    <div className="row">
      <div className="col-1"></div>
      <div className="col-10">
        <div className="row my-2">
    <label htmlFor="title">Panasz</label>
    <textarea name="title" id="title" className="form-control" value={title} disabled /></div>
    <div className="row my-2">
    <label htmlFor="title">Leírás</label>
    <textarea name="description" id="description" className="form-control" value={description} disabled />
      </div>

      <div className="row my-2">
        <label htmlFor="response">Válasz</label>
      <textarea name="response" id="response" className="form-control" rows={5} ref={responseRef}/>
      </div>
      <input type="button" value="Elküldés" className="form-control" onClick={() => SendResponse(el)}/></div>
      <div className="col-1"></div>
      </div>
    </>)
  }

  const RequestEntry = (el) => {
    console.log(el.data);
    return (
      <div className="row my-3">
        <div className="col-2"></div>
        <div className="col-8">
      <div className="post">
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
            <div className="row my-2">
          <label htmlFor="title">Fej</label>
        <textarea rows={2} value={el.title} name="title" id="title" className="form-control" disabled/>
        </div>
        <div className="row my-2">
          <label htmlFor="description">Törzs</label>
          <textarea rows={5} value={el.description} name="description" id="description" className="form-control" disabled/></div>
          </div>
          </div>
          <div className="row my-2 text-center">
            <p className="fs-3 mx-auto">Adatok</p>
          </div>
          <div className="row my-2">
            <div className="col-1">
            </div>

            <div className="col-10">
            <div className="row d-flex justify-content-between text-center my-2">
              <div className="col-3  d-flex flex-column justify-content-between text-center">
                <p className="fw-bold m-0 mx-auto">Gyártó</p>
        <p className="mx-auto">{el.data.brand}</p>
        </div>
        <div className="col-3  d-flex flex-column justify-content-between text-center">
          <p className="fw-bold m-0 mx-auto">Gyártmány</p>
        <p className="mx-auto">{el.data.model}</p>
        </div>
        <div className="col-3  d-flex flex-column justify-content-between text-center">
          <p className="fw-bold m-0 mx-auto">Évjárat</p>
        <p className="mx-auto">{el.data.year}</p>
        </div>
            </div>
        <div className="row d-flex justiy-content-between text-center my-2">
          <div className="col-3 d-flex flex-column justify-content-between text-center">
            <p className="fw-bold m-0 mx-auto">Motorkód</p>
        <p className="mx-auto">{el.data.engineCode}</p>
        </div>
        <div className="col-3  d-flex flex-column justify-content-between text-center">
          <p className="fw-bold m-0 mx-auto">Rendszám</p>
        <p className="mx-auto">{el.data.licensePlate}</p>
        </div>
        <div className="col-3  d-flex flex-column justify-content-between text-center">
          <p className="fw-bold m-0 mx-auto">Alvázszám</p>
        <p className="mx-auto">{el.vin}</p>
        </div>
        </div>
            </div>
            <div className="col-1"></div>
        </div>
        <div className="row d-flex text-center">
        <p className="fw-bold mx-auto">{el.answered ? "Válaszolva" : "Válaszra Vár"}</p>
        </div>
        <input
          type="button"
          value="Válaszolás"
          className="form-control hoverbutton"
          onClick={() => CreateModal(<p className="mx-auto">Árajánlás válaszolás</p>, AnswerRequest(el), true)}
        />
      </div></div>
      <div className="col-2"></div></div>
    );
  };

  useEffect(() => {
    LoadRequests();
  }, []);

  return (
    <div className="my-3">
    <div className="row d-flex">
      <div className="col-5"></div>
      <div className="col-2">
      <p className="fs-3 mx-auto text-center">Árajánlatok</p>
      </div>
      <div className="col-5"></div>
    </div>
      {requests.map((i) => RequestEntry(i))}
    </div>
  );
}

export default ActiveRequests;
