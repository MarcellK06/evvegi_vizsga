import { useRef } from "react";
import CONFIG from "../../config.json";
import $ from 'jquery';
import Cookie from 'js-cookie';

function AddOwnCar() {
    var API = CONFIG.API;

    const brandRef = useRef();
    const modelRef = useRef();
    const yearRef = useRef();
    const licenseplateRef = useRef();
    const vinRef = useRef();
    const registrationRef = useRef();

    const HandleCarAdd = () => {
        var userid = Cookie.get("userid");
        var brand = brandRef.current.value;
        var model = modelRef.current.value;
        var year = yearRef.current.value;
        var licenseplate = licenseplateRef.current.value;
        var vin = vinRef.current.value;
        var registration = registrationRef.current.value;
        $.ajax({
            url: `${API}/car/add`,
            data: {
                userid: userid,
                brand: brand,
                model: model,
                year: year,
                licenseplate: licenseplate,
                vin: vin,
                registration: registration
            },
            success: function (resp) {
                // TODO
            }
        });
    }

    return (<>
    <p>Járművét feltöltése után egyik adminisztrátorunknak jóva kell hagynia, ez egy napig is eltarthat!</p>
        <label htmlFor="brand">Gyártó</label>
        <input type="text" name="brand" id="brand" ref={brandRef} required/>
        <label htmlFor="model">Gyártmány</label>
        <input type="text" name="model" id="model" ref={modelRef} required/>
        <label htmlFor="year">Évjárat</label>
        <input type="text" name="year" id="year" ref={yearRef} required/>
        <label htmlFor="licenseplate">Rendszám</label>
        <input type="text" name="licenseplate" id="licenseplate" ref={licenseplateRef} required/>
        <label htmlFor="vin">Alvázszám</label>
        <input type="text" name="vin" id="vin" ref={vinRef} required/>
        <label htmlFor="vin_images">Alvázszám kép</label>
        <input type="file" name="vin_images" id="vin_images" ref={registrationRef} required/>
        <input type="button" value="Feltöltés" onClick={HandleCarAdd} />
</>);
}

export default AddOwnCar;