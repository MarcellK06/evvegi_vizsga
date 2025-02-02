import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CONFIG from "../config.json";
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

  const dataEntry = (i) => {
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
        <div>
          <p className="fw-bold">{title}</p>
          <p>{description}</p>
        </div>
        <div className="d-flex justify-content-between">
          <div>
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
            <div className="col-3"></div>
            <div className="col-9">{listingData.map((i) => dataEntry(i))}</div>
          </div>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
}
export default Marketplaceitem;
