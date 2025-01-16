import CONFIG from "../../config.json";

function LoginForm() {
    var API = CONFIG.API;


    return (<>
    <form method="POST" action={`${API}/login`}>
        <input type="text" name="name" id="name" required/>
        <input type="password" name="password" id="password" required/>
        <input type="submit" value="Bejelentkezés" />
    </form>
    </>);
}

export default LoginForm;