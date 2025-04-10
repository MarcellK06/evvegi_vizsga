import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CONFIG from "../config.json";
import { MdEmail } from "react-icons/md";
import $ from "jquery";
function Marketplaceitem() {
  var API = CONFIG.API;
  const { id } = useParams();
  const [listingData, setListingData] = useState([]);
  const LoadItemData = () => {
    $.ajax({
      url: `${API}/marketplace/item/${id}`,
      success: (resp) => {
        setListingData(resp);
      },
    });
  };

  const dataEntry = (i, idx) => {
    if (idx > 0) return;
    var images = [];
    if (i.images.includes(",")) images = i.images.split(",");
    else images.push(i.images);

    const data = JSON.parse(i.data);

    var title = i.itemname;
    var description = i.itemdescription;
    var brand = data.brand;
    var model = data.model;
    var year = data.year;
    var engineCode = data.engineCode;
    var kilometers = data.km;
    return (
      <>
        <div className="col-3">
          <div id="carousel" class="carousel slide">
            <div class="carousel-inner">
              {images.map((e, idx) => imagesEntry(e, i.id, idx))}
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carousel"
              data-bs-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carousel"
              data-bs-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <div className="col-9">
          <div>
            <p className="fs-3 fw-bold">{title}</p>
            <p>{description}</p>
            <hr />
          </div>
          <div className="d-flex justify-content-between">
            <div className="text-center">
              <p className="fw-bold">Gyártó</p>
              <p>{brand}</p>
            </div>
            <div>
              <p className="fw-bold">Gyártmány</p>
              <p>{model}</p>
            </div>
            <div>
              <p className="fw-bold">Évjárat</p>
              <p>{year}</p>
            </div>
            <div>
              <p className="fw-bold">Motorkód</p>
              <p>{engineCode}</p>
            </div>
            <div>
              <p className="fw-bold">Kilóméter állás</p>
              <p>{kilometers}km</p>
            </div>
          </div>{" "}
          {listingData[1] == "N/A" ? (
            <></>
          ) : (
            <>
              <hr />{" "}
              <div className="col-9">
                <p className="fs-4">Kapcsolatfelvétel</p>
                <MdEmail size={25} /> {listingData[1]}
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  const imagesEntry = (e, id, el) => {
    return (
      <>
        <div class={`carousel-item ${el == 0 ? "active" : ""}`}>
          <img
            src={`${API}/marketplace/images/${id}/${el}`}
            alt=""
            className="d-block w-100"
          />
        </div>
      </>
    );
  };

  useEffect(() => {
    LoadItemData();
  }, []);
  return (
    <div className="my-3">
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8 mx-auto">
          <div className="row">
            {listingData.map((i, idx) => dataEntry(i, idx))}
          </div>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
}
export default Marketplaceitem;
