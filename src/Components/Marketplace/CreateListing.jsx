import CONFIG from "../../config.json";

function CreateListing() {
    var API = CONFIG.API;
    
    
    return (<>
    <p>Mielőtt hírdetése életbe lép, azelőtt egyik adminisztrátorunknak jóva kell hagynia.</p>
        <form method="POST" action={`${API}/marketplace/createlisting`}>
        <label htmlFor="itemname">Tárgy neve</label>
        <input type="text" name="itemname" id="itemname" required/>
        <label htmlFor="itemdescription">Tárgy leírása</label>
        <input type="text" name="itemdescription" id="itemdescription" required/>
        <label htmlFor="itemprice">Tárgy ára</label>
        <input type="number" name="itemprice" id="itemprice" required/>
        <label htmlFor="owncars">Jármű, amelyből kijött a tárgy(OPCIONÁLIS)</label>
        <select name="owncars" id="owncars">
            <option value="owncar1">owncar1</option>
            <option value="owncar2">owncar2</option>
            <option value="owncar3">owncar3</option>
        </select>
        <input type="submit" value="Közzététel" />
        </form>    
    </>)
}

export default CreateListing;