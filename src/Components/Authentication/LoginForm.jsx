import { useRef } from "react";
import CONFIG from "../../config.json";
import $ from 'jquery';

function LoginForm() {
    var API = CONFIG.API;

    const nameRef = useRef();
    const passwordRef = useRef();

    const HandleLogin = () => {
        var name = nameRef.current.value;
        var password = passwordRef.current.value;
        $.ajax({
            url: `${API}/login`,
            data: {
                name: name,
                password: password
            },
            success: function (resp) {
                // TODO
            }
        })
    }

    return (<>
        <input type="text" name="name" id="name" ref={nameRef} required/>
        <input type="password" name="password" id="password" ref={passwordRef} required/>
        <input type="button" value="Bejelentkezés" onClick={HandleLogin} />
        {/* jelszó visszaállítási lehetőség */}
    </>);
}

export default LoginForm;