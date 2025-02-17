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
  const navigate = useNavigate();
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
   
  
    if (!el.itemname) return null
  
    let desc = el.itemdescription
    if (desc.length > 575) desc = `${desc.substr(0, 575)}...`
  
    let vehicle_data = []
    if (el.data !== undefined) {
      const car = el.data
      if (car.year) vehicle_data.push(car.year)
      if (car.brand) vehicle_data.push(car.brand)
      if (car.model) vehicle_data.push(car.model)
      if (car.engineCode) vehicle_data.push(car.engineCode)
      if (car.km) vehicle_data.push(`${car.km}km`)
      vehicle_data = vehicle_data.join(", ")
    }
  
    let images = el.images
    if (images !== "NINCS") {
      if (images.includes(",")) images = images.split(",")
      else if (images.length > 0) images = [images]
      else images = []
    }
  
    const imageUrl = Array.isArray(images) && images.length > 0 ? `/marketplace/images/${el.id}/0` : ""
  
    return (
      <article className="listing-entry">
        <div className="listing-image" style={{ backgroundImage: `url(${API+imageUrl})` }}></div>
        <div className="listing-content">
          <h2 className="listing-title">{el.itemname}</h2>
          <p className="listing-description">{desc}</p>
          <div className="listing-details">
            <div className="listing-price">{Number.parseInt(el.itemprice).toLocaleString()} Ft</div>
            <div className="listing-tags">
              <span className="listing-label">Címkék</span>
              <span className="listing-value">{vehicle_data}</span>
            </div>
            <div className="listing-date">
              <span className="listing-label">Közzétéve</span>
              <span className="listing-value">{el.listed_at}</span>
            </div>
          </div>
          <button className="listing-button" onClick={() => navigate(`/marketplace-item/${el.id}`)}>
            Megtekintés
          </button>
        </div>
      </article>
    )
  }
  

  useEffect(() => {
    LoadListings();
  }, []);
  return (
    <>
  <div className="row">
    <div className="container col-sm-3 my-2">
      <div className="d-flex justify-content-center mt-5">
        <div className="col-2"></div>
        <div className="col-8 listing-entry d-flex justify-content-center flex-column text-center">
          <p className="fs-4 fw-bold mt-2 mb-4 ">Szűrők</p>
          <div className="m-2">
            <label htmlFor="brand" className="form-label fw-bold">Gyártó</label>
            <select ref={brandFilterRef} className="form-select ">
              <option value="-">-</option>
            </select>
          </div>
          <div className="m-2">
            <label htmlFor="model" className="form-label fw-bold">Gyártmány</label>
            <select ref={modelFilterRef} className="form-select ">
              <option value="-">-</option>
            </select>
          </div>
          <div className="m-2">
            <label htmlFor="engineCode" className="form-label fw-bold">Motorkód</label>
            <select ref={engineCodeFilterRef} className="form-select ">
              <option value="-">-</option>
            </select>
          </div>
         <div className="px-0 px-sm-4 py-2">
         <input
            type="button"
            value="Szűrés"
            className="filter-button btn w-100"
            onClick={LoadListings}
          />
         </div>
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
