import Cookie from "js-cookie";
import { useContext, useEffect, useState } from "react";
import $ from 'jquery';
import CONFIG from "../config.json";
import { ModalContext } from "../Providers/ModalProvider";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function CarsAdminPanel() {
    const API = CONFIG.API;
    const [cars, setCars] = useState([]);
    const {CreateModal} = useContext(ModalContext);
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
                userid: userid
            },
            success: (resp) => {var c = [];
                if (typeof resp == "string")
                    resp = JSON.parse(resp);
                resp.forEach((el) => {
                  var car = JSON.parse(el.data);
                  if (el.images != "NINCS") {
                  el.images = el.images.split(",");
                  for(var k = 0; k < el.images.length; k++)
                    el.images[k] = `${API}/car/images/${el.id}/${k}`;
                }
                  c.push(new Car(el.id, car, el.vin, el.images, el.status, el.nickname, el.approved));
                });
                setCars(c);
            }
        });
    }
    useEffect(() => {
      CheckUser();
      GetNotApprovedVehicles();
    }, []);
    
    const JsonEntry = (i, el) => {
        var data = el.data;
        return (
          <div className="d-flex flex-column">
            <p>{i}&emsp;</p>
            <input type="text" className="form-control" name={i} id={`${el.id}-${i}`} defaultValue={data[i]} />
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
        })
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
            }
        })
      }

    const CarEntry = (el) => {
        return (
          <div className="post my-3 text-center">
            <div className="d-flex">
            {Object.keys(el.data).map((i) => JsonEntry(i, el))}
            <div>
              <p>vin&emsp;</p>
              <input type="text" className="form-control" name="vin" id={`${el.id}-vin`} defaultValue={el.vin} />
            </div>
            <div>
              <p>status&emsp;</p>
              <input type="text" className="form-control" name="status" id={`${el.id}-status`} defaultValue={el.status} />
            </div>
            </div>
            <hr />
            <div>
            <div className="row justify-content-between d-flex" style={{width: "50vw"}}>
              <div className="col-4 mx-auto d-flex">
                <img src={el.images[0]} alt="" className="object-fit-contain mx-auto hoverbutton" style={{height: "30vh"}} onClick={() => window.open(el.images[0], "_blank")} />
            </div>
            <div className="col-4 mx-auto d-flex">
            <img src={el.images[1]} alt="" className="object-fit-contain mx-auto hoverbutton" style={{height: "30vh"}} onClick={() => window.open(el.images[1], "_blank")} />
            </div>
            <div className="col-4 mx-auto d-flex">
            <img src={el.images[2]} alt="" className="object-fit-contain mx-auto hoverbutton" style={{height: "30vh"}} onClick={() => window.open(el.images[2], "_blank")} />
            </div>
            </div>
            </div>
            <div className="row mt-5 ">
                <div className="col-4"></div>
                <div className="col-4">
                <input type="button" value="Jóváhagyás" className="form-control my-2" onClick={(e) => Approve(el)} />
                <input type="button" value="Törlés" className="form-control my-2" />
                </div>
                <div className="col-4"></div>
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
    return (<>
    <div className="row postcolor my-3 p-2 rounded">
      <div className="col-4">
        <p className="fs-3 m-0">{nickname}</p>
        <div className="d-flex my-1">
        <p className="fs-9 mx-2 fw-bold">{year}</p>
        <p className="fs-9 mx-2 fw-bold">{brand}</p>
        <p className="fs-9 mx-2 fw-bold">{model}</p>
        </div>
        </div>
        <div className="col-5"></div>
        <div className="col-3 d-flex align-items-center justify-content-end">
          <p className="fs-9 bold text-danger m-0 mx-2">{approved ? "" : "Ellenörzésre vár.." }</p>
        <FaPen size={25} className="mx-3 pointer" onClick={() => CreateModal(<div><p className="fs-3">{nickname}</p><hr /></div>, CarEntry(el), true)} />
        </div>
    </div>
    </>)
  }


    return (<div className="d-flex flex-column">
        <p className="fs-3 my-3 mx-auto">Jóváhagyandó Járművek</p>
        <div>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8">{cars.length > 0 ? cars.map((i) => carListEntry(i)) : <p className="fs-5">Jelenleg nincs jóváhagyandó jármű..</p>}</div>
            <div className="col-2"></div>
          </div>
        </div>
    </div>)
}

export default CarsAdminPanel;