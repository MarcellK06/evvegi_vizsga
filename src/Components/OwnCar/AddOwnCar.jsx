import CONFIG from "../../config.json";

function AddOwnCar() {
    var API = CONFIG.API;

    return (<>
    <p>Járművét feltöltése után egyik adminisztrátorunknak jóva kell hagynia, ez egy napig is eltarthat!</p>
    <form action={`${API}/car/add`} method="POST">
        <label htmlFor="licenseplate">Gyártó</label>
        <input type="text" name="brand" id="brand" />
        <label htmlFor="licenseplate">Gyártmány</label>
        <input type="text" name="model" id="model" />
        <label htmlFor="licenseplate">Évjárat</label>
        <input type="text" name="year" id="year" />
        <label htmlFor="licenseplate">Rendszám</label>
        <input type="text" name="licenseplate" id="licenseplate" />
        <label htmlFor="licenseplate">Alvázszám</label>
        <input type="text" name="vin" id="vin" />
        <label htmlFor="licenseplate">Alvázszám kép</label>
        <input type="file" name="vin_image" id="vin_image" />
        <input type="submit" value="Feltöltés" />
    </form>
</>);
}

export default AddOwnCar;