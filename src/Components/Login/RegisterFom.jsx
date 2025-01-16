import CONFIG from "../../config.json";

function RegisterForm() {
    var API = CONFIG.API;


    return (<>
    <form method="GET" action={`${API}/register`}>
    <label htmlFor="name">Teljes Név</label>
        <input type="text" name="name" id="name" />
    <label htmlFor="name">Jelszó</label>
    <input type="password" name="password" id="password" />
    <label htmlFor="name">E-Mail Cím</label>
    <input type="text" name="email" id="email" />
    <label htmlFor="name">Telefonszám</label>
    <input type="tel" name="password" id="password" pattern="[0-9]*" inputmode="numeric" />
        <input type="submit" value="Regisztráció" />
    </form>
    </>);
}

export default RegisterForm;