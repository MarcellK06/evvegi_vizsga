import CONFIG from "../../config.json";

function RegisterForm() {
    var API = CONFIG.API;


    return (<>
    <form method="POST" action={`${API}/register`}>
    <label htmlFor="name">Teljes Név</label>
        <input type="text" name="name" id="name" required/>
    <label htmlFor="name">Jelszó</label>
    <input type="password" name="password" id="password" required/>
    <label htmlFor="email">E-Mail Cím</label>
    <input type="text" name="email" id="email" required/>
    <label htmlFor="phione">Telefonszám</label>
    <input type="tel" name="phone" id="phone" pattern="[0-9]*" inputmode="numeric" required/>
        <input type="submit" value="Regisztráció" />
    </form>
    </>);
}

export default RegisterForm;