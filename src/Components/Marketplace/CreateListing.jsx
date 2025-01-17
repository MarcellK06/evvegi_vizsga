import { useRef } from "react";
import CONFIG from "../../config.json";
import $ from 'jquery';
import Cookie from 'js-cookie';

function CreateListing() {
    var API = CONFIG.API;
    
    const itemNameRef = useRef();
    const itemDescriptionRef = useRef();
    const itemPriceRef = useRef();
    const carRef = useRef();
    
    const HandleCreateListing = () => {
        var itemName = itemNameRef.current.value;
        var itemDescription = itemDescriptionRef.current.value;
        var itemPrice = itemPriceRef.current.value;
        var car = carRef.current.value;
        var userid = Cookie.get("userid");
        $.ajax({
            url: `${API}/marketplace/createlisting`,
            data: {
                userid: userid,
                itemName: itemName,
                itemDescription: itemDescription,
                itemPrice: itemPrice,
                car: car
            },
            success: function(resp) {
                // TODO
            }
        });
    }

    return (<>
    <p>Mielőtt hírdetése életbe lép, azelőtt egyik adminisztrátorunknak jóva kell hagynia.</p>
        <label htmlFor="itemname">Tárgy neve</label>
        <input type="text" name="itemname" id="itemname" ref={itemNameRef} required/>
        <label htmlFor="itemdescription">Tárgy leírása</label>
        <input type="text" name="itemdescription" id="itemdescription" ref={itemDescriptionRef} required/>
        <label htmlFor="itemprice">Tárgy ára</label>
        <input type="number" name="itemprice" id="itemprice" ref={itemPriceRef} required/>
        <label htmlFor="owncars">Jármű, amelyből kijött a tárgy(OPCIONÁLIS)</label>
        <select name="owncars" id="owncars" ref={carRef}>
            <option value="owncar1">owncar1</option>
            <option value="owncar2">owncar2</option>
            <option value="owncar3">owncar3</option>
        </select>
        <input type="button" value="Közzététel" onClick={HandleCreateListing} />
    </>);
}

export default CreateListing;