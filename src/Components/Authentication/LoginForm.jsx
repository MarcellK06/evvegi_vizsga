import { useRef } from "react";
import CONFIG from "../../config.json";
import $ from 'jquery';

function LoginForm() {
    var API = CONFIG.API;

    const emailRef = useRef();
    const passwordRef = useRef();

    const HandleLogin = () => {
        var email = emailRef.current.value;
        var password = passwordRef.current.value;
        $.ajax({
            url: `${API}/User/login`,
            type: "post",
            data: {
                email: email,
                password: password
            },
            success: function (resp) {
                // TODO
            }
        })
    }

    return (<>
        <input type="email" name="email" id="email" ref={emailRef} required/>
        <input type="password" name="password" id="password" ref={passwordRef} required/>
        <input type="button" value="Bejelentkezés" onClick={HandleLogin} />
        {/* jelszó visszaállítási lehetőség */}
    </>);
}

export default LoginForm;