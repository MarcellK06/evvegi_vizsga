import { useParams } from "react-router-dom"
import LoginForm from "../Components/Authentication/LoginForm";
import RegisterForm from "../Components/Authentication/RegisterFom";
import PasswordResetForm from "../Components/Authentication/PasswordResetForm";
import { useEffect, useState } from "react";

function Authentication(){
    const {type} = useParams();
    const setState = () => {
        switch(type){
            case "register": return <RegisterForm/>;
            case "login": return <LoginForm/>;
            case "password-reset": return <PasswordResetForm/>;
           default: return <>
           <div style={{width: "512px", height: "512px"}}>
           <h1 style={{position: "absolute", marginLeft: "200px", marginTop: "190px"}}>404</h1>
            <img src="/png/checkengine.png" className="blur-5" alt="checkengine" style={{width: "512px"}} />
           </div>
           </>;
        }
    }
    const [form, setForm] = useState(null);
    useEffect(() => {
        setForm(setState());
    }, []);
    
    return (
        <>{form == null ? null : form}</>
    );
}
export default Authentication