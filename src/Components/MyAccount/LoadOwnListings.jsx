import { useEffect, useState } from "react";
import $ from "jquery";
import CONFIG from "../../config.json";
import Cookie from "js-cookie";
function LoadOwnListings() {
  var API = CONFIG.API;
  const [i, setI] = useState(1);
  const [activeListings, setActiveListings] = useState([]);

  var listings = [];

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

  const Get = () => {
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/marketplace/listings/load/${i}`,
      type: "post",
      data: {
        userid: userid,
      },
      success: (resp) => {
        if (i < listings.length) setActiveListings(listings[i - 1]);
        else {
          listings.push([]);
          if (!Array.isArray(resp)) var respJson = JSON.parse(resp)[0];
          else var respJson = resp[0];

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
          });
          setActiveListings(listings[i - 1]);
        }
      },
    });
  };

  const DeleteListing = (el) => {
    var listingid = el.id;
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/marketplace/listings/delete`,
      type: "post",
      data: {
        userid: userid,
        listingid: listingid,
      },
      success: (resp) => {
        window.location.reload();
      },
    });
  };

  const OwnListingEntry = (el) => {
    if (!el.itemname) return;
    var vehicle_data = "";

    var car = el.data;
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
                style={{ backgroundImage: `url(${el.images[0]})` }}
                className="marketplace-listing-image m-2"
              ></div>
            </div>
          </div>
          <div className="col-8 g-3">
            <div className="d-flex flex-column my-2">
              <p className="fs-4 fw-bold">{el.itemname}</p>
              <p className="fs-7 mt-3">{el.itemdescription}</p>
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
            <div
              className="btn-close-red ms-auto d-flex justify-content-end m-3"
              style={{ width: "1.5rem" }}
              onClick={() => DeleteListing(el)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="red"
              >
                <path d="M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    Get();
  }, []);
  return (
    <div className="text-center">
      <div className="row">
        <p className="fs-3">Saját Hírdetések</p>
        <p>Saját hírdetéseit itt megtalálhatja.</p>
      </div>
      <div className="row">
        <div className="container col-sm-7 my-2">
          {activeListings.map((i) => OwnListingEntry(i))}
        </div>
      </div>
    </div>
  );
}

export default LoadOwnListings;
