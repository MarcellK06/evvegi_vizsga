import CONFIG from "../../config.json";

function Request() {
    var API = CONFIG.API;

    return (<>
    <form action={`${API}/pricerequest`} method="POST">
        <label htmlFor="subject">
            <h4>Cím</h4>
            <p>Írja le röviden, mit tapasztal járműve!</p>
            </label>
        <input type="text" name="subject" id="subject" />
        <label htmlFor="subject">
            <h4>Leírás</h4>
            <p>Írja le részletesebben járműve problémáját!</p>
        </label>
        <input type="text" name="body" id="body" />
        <select name="owncars" id="owncars">
            <option value="owncar1">owncar1</option>
            <option value="owncar2">owncar2</option>
            <option value="owncar3">owncar3</option>
        </select>

        <input type="submit" value="Árajánlat Kérése" />
    </form>
    </>);
}

export default Request;