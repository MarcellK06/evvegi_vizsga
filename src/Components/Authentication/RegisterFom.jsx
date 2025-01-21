import { useRef } from "react";
import CONFIG from "../../config.json";
import $ from 'jquery';
import { useNavigate } from "react-router-dom";

function RegisterForm() {
    var API = CONFIG.API;
    const navigator = useNavigate();

    const emailRef = useRef();
    const nameRef = useRef();
    const passwordRef = useRef();
    const telRef = useRef();

    const HandleRegister = () => {
        var name = nameRef.current.value;
        var password = passwordRef.current.value;
        var email = emailRef.current.value;
        var tel = telRef.current.value;
        $.ajax({
            url: `${API}/user/register`,
            type: "post",
            data: {
                name: name,
                email: email,
                tel: tel,
                password: password
            },
            success: function (resp) {
                navigator("/auth/login");
            },
            error: function(resp){
                
            }
        })
    }

    return (<>
    <label htmlFor="name">Teljes Név</label>
        <input type="text" name="name" id="name" ref={nameRef} required/>
    <label htmlFor="password">Jelszó</label>
    <input type="password" name="password" id="password" ref={passwordRef} required/>
    <label htmlFor="email">E-Mail Cím</label>
    <input type="email" name="email" id="email" useRef={emailRef} required/>
    <label htmlFor="phone">Telefonszám</label>
    <input type="tel" name="phone" id="phone" pattern="[0-9]*" inputmode="numeric" ref={telRef} required/>
        <input type="button" value="Regisztráció" onClick={HandleRegister} />
    </>);
}

export default RegisterForm;