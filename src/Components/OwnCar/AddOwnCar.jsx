import CONFIG from "../../config.json";

function AddOwnCar() {
    var API = CONFIG.API;


    return (<>
    <p>Járművét feltöltése után egyik adminisztrátorunknak jóva kell hagynia, ez egy napig is eltarthat!</p>
    <form action={`${API}/car/add`} method="POST">
        <label htmlFor="brand">Gyártó</label>
        <input type="text" name="brand" id="brand" required/>
        <label htmlFor="model">Gyártmány</label>
        <input type="text" name="model" id="model" required/>
        <label htmlFor="year">Évjárat</label>
        <input type="text" name="year" id="year" required/>
        <label htmlFor="licenseplate">Rendszám</label>
        <input type="text" name="licenseplate" id="licenseplate" required/>
        <label htmlFor="vin">Alvázszám</label>
        <input type="text" name="vin" id="vin" required/>
        <label htmlFor="vin_images">Alvázszám kép</label>
        <input type="file" name="vin_images" id="vin_images" required/>
        <input type="submit" value="Feltöltés" />
    </form>
</>);
}

export default AddOwnCar;