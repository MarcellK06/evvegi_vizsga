import { useContext, useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import { NavigatorContext } from "../../Providers/NavigatorProvider";
import Cookie from 'js-cookie';

function Request() {
  var API = CONFIG.API;

  const subjectRef = useRef();
  const bodyRef = useRef();
  const ownCarsRef = useRef();
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

  const ownCarEntry = (i) => {
    var vin = i.vin;
    var carid = i.id;
    return (
      <>
        <option value={carid}>{vin}</option>
      </>
    );
  };

  const SendRequest = () => {
    var subject = subjectRef.current.value;
    var body = bodyRef.current.value;
    var carid = ownCarsRef.current.value;
    var userid = Cookie.get("userid");

    $.ajax({
      url: `${API}/requests/send`,
      method: "post",
      data: {
        title: subject,
        description: body,
        carid: carid,
        userid: userid
      },
      success: function (resp) {
        window.location.reload();
      },
    });
  };
  const { _Navigator } = useContext(NavigatorContext);
  useEffect(() => {
    _Navigator.footerFix();
    LoadOwnCars();
  }, []);

  return (
    <div className="my-3">
    <div className="row">
      <p className="fs-3 mx-auto text-center">Árajánlat Kérése</p>
    </div>
    <div className="row post my-3">
      <div className="col-2"></div>
      <div className="col-8">
        <div className="row my-3">
      <label htmlFor="subject">
        <p className="fs-3 fw-bold m-0">Cím</p>
        <p>Írja le röviden, mit tapasztal járműve!</p>
      </label>
      <input type="text" name="subject" id="subject" className="form-control" ref={subjectRef}/>
      </div>
      <div className="row my-3">
      <label htmlFor="body">
        <p className="fs-3 fw-bold m-0">Leírás</p>
        <p>Írja le részletesebben járműve problémáját!</p>
      </label>
      <input type="text" name="body" id="body" className="form-control" ref={bodyRef}/>
      </div>
      <div className="row my-3">
      <label htmlFor="owncars"><p className="fs-3 fw-bold m-0">Saját Járművek</p></label>
      <select name="owncars" id="owncars" className="form-control" ref={ownCarsRef}>
      {ownCars.map((i) => ownCarEntry(i))}
      </select>
      </div>
      <input type="button" value="Árajánlat Kérése" className="form-control my-3" onClick={SendRequest} />
      </div>
      <div className="col-2"></div>
      </div>
    </div>
  );
}

export default Request;
