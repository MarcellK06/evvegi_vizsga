import $ from 'jquery';
import Cookie from 'js-cookie';
import CONFIG from "../../config.json";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ListListings() {
    var API = CONFIG.API;
        const [i, setI] = useState(1);
        const [activeListings, setActiveListings]= useState([]);
        const brandFilterRef = useRef();
        const modelFilterRef = useRef();
        const engineCodeFilterRef = useRef();

    class ListingStruct {
        constructor(id, itemName, itemDescription, itemPrice, car, images) {
            this.id = id;
            this.itemname = itemName;
            this.itemdescription = itemDescription;
            this.itemprice = itemPrice;
            this.car = car;
            this.images = images;
        }
    }
    const navigator = useNavigate();
    var listings = [];

    const LoadListings = () => {
        var userid = Cookie.get("userid");
        $.ajax({
            url: `${API}/marketplace/listings/load/${i}`,
            success: function(resp) {
                
                if (i < listings.length)
                    setActiveListings(activeListings = listings[i - 1]);
                else {
                    listings.push([]);
                    resp.forEach((el) => {
                        listings[listings.length - 1].push(new ListingStruct(el[0].id, el[0].itemname, el[0].itemdescription, el[0].itemprice, el[0].car, el[0].images));
                    });
                    setActiveListings(listings[i - 1]);
                }
            }
        });
    }


    const ListingEntry = (el) => {
        if (!el.itemname)
            return;
        var vehicle_data = "";
        
        if (el.car != undefined)
            vehicle_data = `${el.car.year} ${el.car.brand} ${el.car.model} ${el.car.engineCode}`;

        const brand = brandFilterRef.current.value;
        const model = modelFilterRef.current.value;
        const engineCode = engineCodeFilterRef.current.value;

        if (brand != "" || model != "" || engineCode != "") {
            if (el.car != undefined)
                return;
            if (brand != "")
                if (el.car.brand != brand)
                    return;

            if (model != "")
                if (el.car.model != model)
                    return;

            if (engineCode != "")
                if (el.car.engineCode != engineCode)
                    return;
        }

        console.log(el);
        if (el.images.includes(","))
            el.images = el.images.split(',');
        else if(el.images.length > 0)
            el.images = [el.images];
        else
            el.images = [];
        return (
            <div className='post'>
        <div className="row">
            <div className="col-4">
<div className="row h-100"><div style={{backgroundImage: `url(${el.images[0]})`}} className='marketplace-listing-image'></div></div></div>
            <div className="col-8"><div className='d-flex flex-column my-2'>
            <p className='fs-4 fw-bold'>{el.itemname}</p>
            <p className='fs-7 mt-3'>{el.itemdescription}</p>
            <p className='fs-11 mt-1'><u>{`${el.itemprice}Ft`}</u></p>
    
            <p>{vehicle_data}</p>
        </div></div>
        </div>
        <div className="row">
            <div className="col-10"></div>
        <div className="col-2 mt-auto">
            <input type="button" value="Megtekintés" className="btn btn-primary" onClick={() => navigator(`/marketplace-item/${el.id}`)} />
            </div>
        </div>
        </div>);
    }

    useEffect(() => {
        LoadListings();
    }, []);

    return(<>
    <select ref={brandFilterRef}></select>
    <select ref={modelFilterRef}></select>
    <select ref={engineCodeFilterRef}></select>
    <div className="container col-sm-6 mx-auto my-2">
    {activeListings.map((i) => (ListingEntry(i)))}
    </div>
    </>);

}

export default ListListings;