import $ from "jquery";
import Cookie from "js-cookie";
import CONFIG from "../../config.json";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function ListListings() {
  var API = CONFIG.API;
  const [i, setI] = useState(1);
  const [activeListings, setActiveListings] = useState([]);
  const brandFilterRef = useRef();
  const modelFilterRef = useRef();
  const engineCodeFilterRef = useRef();

  class ListingStruct {
    constructor(
      id,
      itemName,
      itemDescription,
      itemPrice,
      car,
      images,
      listed_at
    ) {
      this.id = id;
      this.itemname = itemName;
      this.itemdescription = itemDescription;
      this.itemprice = itemPrice;
      if (typeof car != "undefined") this.data = JSON.parse(car);
      this.images = images;
      this.listed_at = listed_at;
    }
  }
  const navigator = useNavigate();
  var listings = [];

  const LoadListings = () => {
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/marketplace/listings/load/${i}`,
      type: "post",
      data: {
        filters: [
          brandFilterRef.current.value,
          modelFilterRef.current.value,
          engineCodeFilterRef.current.value,
        ],
      },
      success: function (resp) {
        if (i < listings.length) setActiveListings(listings[i - 1]);
        else {
          listings.push([]);
          if (typeof resp == "string") var respJson = resp;
          else var respJson = JSON.stringify(resp);
          respJson = JSON.parse(respJson)[0];
          respJson.forEach((el) => {
            listings[listings.length - 1].push(
              new ListingStruct(
                el.id,
                el.itemname,
                el.itemdescription,
                el.itemprice,
                el.data,
                el.images,
                el.listed_at
              )
            );
            if (typeof el.data != "undefined") {
              var car = JSON.parse(el.data);
              if (!brandFilterRef.current.innerHTML.includes(car.brand))
                brandFilterRef.current.innerHTML += `<option value="${car.brand}">${car.brand}</option>`;
              if (!modelFilterRef.current.innerHTML.includes(car.model))
                modelFilterRef.current.innerHTML += `<option value="${car.model.replace(
                  " ",
                  "-"
                )}">${car.model}</option>`;
              if (
                !engineCodeFilterRef.current.innerHTML.includes(car.engineCode)
              )
                engineCodeFilterRef.current.innerHTML += `<option value="${car.engineCode}">${car.engineCode}</option>`;
            }
          });
          setActiveListings(listings[i - 1]);
        }
      },
    });
  };

  const ListingEntry = (el) => {
    if (!el.itemname) return;
    var vehicle_data = "";

    var car = el.data;
    var desc = el.itemdescription;
    if (desc.length > 575) desc = `${desc.substr(0, 575)}...`;
    var vehicle_data = [];
    if (el.data != undefined) {
      if (car.year) vehicle_data.push(car.year);
      if (car.brand) vehicle_data.push(car.brand);
      if (car.model) vehicle_data.push(car.model);
      if (car.engineCode) vehicle_data.push(car.engineCode);
      if (car.km) vehicle_data.push(`${car.km}km`);
      vehicle_data = vehicle_data.join(", ");
    }

    if (el.images != "NINCS") {
      if (el.images.includes(",")) el.images = el.images.split(",");
      else if (el.images.length > 0) el.images = [el.images];
      else el.images = [];
    }
    return (
      <div className="post my-3 w-100">
        <div className="row">
          <div className="col-4 g-5">
            <div className="row h-100">
              <div
                style={{ backgroundImage: `url(${API}/marketplace/images/${el.id}/0)` }}
                className="marketplace-listing-image m-2"
              ></div>
            </div>
          </div>
          <div className="col-8 g-3">
            <div className="d-flex flex-column my-2">
              <p className="fs-4 fw-bold">{el.itemname}</p>
              <p className="fs-7 mt-3">{desc}</p>
              <p className="fs-11 mt-1">
                <u className="fw-bold">{`${el.itemprice}`}</u>Ft
              </p>
              <div className="d-flex justify-content-between">
                <p className="fw-bold">{vehicle_data}</p>
                <p className="fw-bold">{el.listed_at}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-10"></div>
          <div className="col-2 mt-auto">
            <input
              type="button"
              value="Megtekintés"
              className="btn btn-primary mb-2"
              onClick={() => navigator(`/marketplace-item/${el.id}`)}
            />
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    LoadListings();
  }, []);
  return (
    <>
      <div className="row">
        <div className="container col-sm-3 my-2">
          <div className="d-flex justify-content-center mt-5">
            <div className="col-2"></div>
            <div className="col-8 post d-flex justify-content-center flex-column text-center">
              <p className="fs-4 fw-bold mt-2 mb-2">Szűrők</p>
              <div className="m-2">
                <label htmlFor="">Gyártó</label>
                <select ref={brandFilterRef} className="form-control">
                  <option value="-">-</option>
                </select>
              </div>
              <div className="m-2">
                <label htmlFor="">Gyártmány</label>
                <select ref={modelFilterRef} className="form-control">
                  <option value="-">-</option>
                </select>
              </div>
              <div className="m-2">
                <label htmlFor="">Motorkód</label>
                <select ref={engineCodeFilterRef} className="form-control">
                  <option value="-">-</option>
                </select>
              </div>
              <input
                type="button"
                value="Szűrés"
                className="form-control mt-2 mb-4 hoverbutton"
                onClick={LoadListings}
              />
            </div>
            <div className="col-2"></div>
          </div>
        </div>
        <div className="container col-sm-7 my-2">
          {activeListings.map((i) => ListingEntry(i))}
        </div>
        <div className="col-sm-2 p-0"></div>
      </div>
    </>
  );
}

export default ListListings;
