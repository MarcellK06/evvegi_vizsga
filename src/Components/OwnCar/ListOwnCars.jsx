import CONFIG from "../../config.json";
import $ from 'jquery';
import Cookie from 'js-cookie';
import { useEffect } from "react";
import AddOwnCar from "./AddOwnCar";

function ListOwnCars() {
    var API = CONFIG.API;

    
    class OwnCar {
        constructor(brand, model, year, licenseplate, vin, images) {
            this.brand = brand;
            this.model = model;
            this.year = year;
            this.licenseplate = licenseplate;
            this.vin = vin;
            this.images = images;
        }
    }
    var owncars = []

    const LoadOwnCars = () => {
        var userid = Cookie.get("userid");
        $.ajax({
            url: `${API}/car/load/all`,
            data: {
                userid: userid
            },
            success: function(resp) {
                resp.cars.forEach((el) => {
                    owncars.push(new OwnCar(el.brand, el.model, el.year, el.licenseplate, el.vin, el.images));
                });
            }
        });
    }

    const OwnCarEntry = (el) => {
        return(<>
        <p>{el.brand}</p>
        <p>{el.model}</p>
        <p>{el.year}</p>
        <p>{el.licenseplate}</p>
        <p>{el.vin}</p>
        <p>Jármű Állapota: <b>OK</b></p>
        <img src={el.images[0]} alt="Forgalmi Kép 1. Oldal" />
        <img src={el.images[1]} alt="Forgalmi Kép 2. Oldal" />
        <img src={el.images[2]} alt="Jármű Alvázszám Kép" />
        <input type="button" value="Törlés" />
        </>)
    } 

    useEffect(() => {
        LoadOwnCars();
    }, []);

    return (<>
    {owncars.map((i) => OwnCarEntry(i))}
    <AddOwnCar/>
    </>);
}

export default ListOwnCars;