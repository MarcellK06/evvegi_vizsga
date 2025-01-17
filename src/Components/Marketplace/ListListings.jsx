import $ from 'jquery';
import Cookie from 'js-cookie';
import CONFIG from "../../config.json";
import { useEffect } from 'react';

function ListListings() {
    var API = CONFIG.API;

    class ListingStruct {
        constructor(itemName, itemDescription, itemPrice, car) {
            this.itemName = itemName;
            this.itemDescription = itemDescription;
            this.itemPrice = itemPrice;
            this.car = car;
        }
    }

    var listings = [];

    const LoadListings = () => {
        var userid = Cookie.get("userid");
        $.ajax({
            url: `${API}/listings/load`,
            data: {
                userid: userid
            },
            success: function(resp) {
                resp.listings.forEach((el) => {
                    listings.push(new ListingStruct(el.itemName, el.itemDescription, el.itemPrice, el.car));
                })
            }
        })
    }

    const ListingEntry = (el) => {
        return (<div>
            <p>{el.itemName}</p>
            <p>{el.itemDescription}</p>
            <p>{el.itemPrice}</p>
            <p>{el.car.year} {el.car.brand} {el.car.model} {el.car.engineCode}</p>
        </div>)
    }

    useEffect(() => {
        LoadListings();
    }, [])

    return(<>
    {listings.map((i) => ListingEntry(i))}
    </>)

}

export default ListListings;