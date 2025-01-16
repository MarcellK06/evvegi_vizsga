import CONFIG from "../../config.json";

function LoginForm() {
    var API = CONFIG.API;


    return (<>
    <form method="GET" action={`${API}/login`}>
        <input type="text" name="name" id="name" />
        <input type="password" name="password" id="password" />
        <input type="submit" value="Bejelentkezés" />
    </form>
    </>);
}

export default LoginForm;