import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import CONFIG from "../../config.json";
import Cookie from "js-cookie";

function LoadOwnRequests() {
    const API = CONFIG.API;
    const [requests, setRequests] = useState([]);
    const responseRef = useRef();
    class Request {
        constructor(title, description, vin, answered, data, date, response) {
            this.title = title;
            this.description = description;
            this.vin = vin;
            this.answered = answered;
            this.data = data;
            this.date = date;
            this.response = response;
        }
    }

    const LoadAnswers = (el) => {
        var title = el.title;
        var description = el.description;
        var vin = el.vin;
        var data = el.data;
        var date = el.date;
        var brand = data.brand;
        var model = data.model;
        var year = data.year;
        var licensePlate = data.licensePlate;
        var engineCode = data.engineCode;
        return (<div className="postcolor my-3">
        <div className="row py-3">
          <div className="col-1"></div>
          <div className="col-10">
            <div className="row my-2 d-flex justify-content-center text-center">
                <div className="col-2 d-flex flex-column">
                    <div className="row  fw-bold mx-auto">Gyártó</div>
                    <div className="row text-center mx-auto">{brand}</div>
                </div>
                <div className="col-2 d-flex flex-column">
                    <div className="row  fw-bold  mx-auto">Gyártmány</div>
                    <div className="row  mx-auto">{model}</div>
                </div>
                <div className="col-2 d-flex flex-column">
                    <div className="row  fw-bold  mx-auto">Évjárat</div>
                    <div className="row  mx-auto">{year}</div>
                    </div>
                <div className="col-2 d-flex flex-column">
                    <div className="row fw-bold  mx-auto">Alvázszám</div>
                    <div className="row  mx-auto">{vin}</div>
                    </div>
                <div className="col-2 d-flex flex-column">
                    <div className="row  fw-bold  mx-auto">Rendszám</div>
                    <div className="row  mx-auto">{licensePlate}</div>
                    </div>
                <div className="col-2 d-flex flex-column">
                    <div className="row  fw-bold  mx-auto">Motorkód</div>
                    <div className="row  mx-auto">{engineCode}</div>
                    </div>
            </div>
            <div className="row my-2">
        <label htmlFor="title">Panasz</label>
        <textarea name="title" id="title" className="form-control" value={title} disabled /></div>
        <div className="row my-2">
        <label htmlFor="title">Leírás</label>
        <textarea name="description" id="description" className="form-control" value={description} disabled />
          </div>
    
          <div className="row my-2">
            <label htmlFor="response">Válasz</label>
          <textarea name="response" id="response" className="form-control" rows={5} ref={responseRef} value={el.response == null ? "VÁLASZRA VÁR" : el.response} disabled/>
          </div></div>
          </div>
          <div className="row">
          <div className="col-2 ms-auto text-end mx-3"><p className=" fw-bold">{date}</p></div>
          </div>
        </div>)
      }

    const LoadRequests = () => {
        var userid = Cookie.get("userid");
        $.ajax({
            url: `${API}/requests/load`,
            type: "post",
            data: {
                userid: userid
            },
            success: (resp) => {
                var rs = [];
                resp.forEach((i) => {
                    var title = i.title;
                    var description = i.description;
                    var vin = i.vin;
                    var answered = i.answered;
                    var data = JSON.parse(i.data);
                    var date = i.date;
                    var response = i.response;
                    rs.push(new Request(title, description, vin, answered, data, date, response));
                })
                setRequests(rs);
            }
        })
    }
    useEffect(() => {
        LoadRequests();
    }, [])
    return (<>
    <div className="row my-3">
        <div className="col-2"></div>
        <div className="col-8">
        {requests.map((i) => LoadAnswers(i))}
        </div>
        <div className="col-2"></div>
    </div></>);
}

export default LoadOwnRequests;