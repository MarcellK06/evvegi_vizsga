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
    var images = el.images;
    if (el.data != undefined) {
      if (car.year) vehicle_data.push(car.year);
      if (car.brand) vehicle_data.push(car.brand);
      if (car.model) vehicle_data.push(car.model);
      if (car.engineCode) vehicle_data.push(car.engineCode);
      if (car.km) vehicle_data.push(`${car.km}km`);
      vehicle_data = vehicle_data.join(", ");
    }

    if (images !== "NINCS") {
      if (images.includes(",")) images = images.split(",");
      else if (images.length > 0) images = [images];
      else images = [];
    }

    const imageUrl =
      Array.isArray(images) && images.length > 0
        ? `/marketplace/images/${el.id}/0`
        : "";
    return (
      <article className="listing-entry">
        <div
          className="listing-image"
          style={{ backgroundImage: `url(${API + imageUrl})` }}
        ></div>
        <div className="listing-content">
          <h2 className="listing-title">{el.itemname}</h2>
          <p className="listing-description">{el.description}</p>
          <div className="listing-details">
            <div className="listing-price">
              {Number.parseInt(el.itemprice).toLocaleString()} Ft
            </div>
            <div className="listing-tags">
              <span className="listing-label">Címkék</span>
              <span className="listing-value">{vehicle_data}</span>
            </div>
            <div className="listing-date">
              <span className="listing-label">Közzétéve</span>
              <span className="listing-value">{el.listed_at}</span>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              className="h-btn w-25 mx-auto declinead"
              onClick={() => DeleteListing(el)}
            >
              Törlés
            </button>
          </div>
        </div>
      </article>
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
