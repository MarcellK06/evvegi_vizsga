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
           default: return <>404</>;{/* ide ki kell találni valamit*/}
        }
    }
    const [form, setForm] = useState(null);
    useEffect(() => {
        setForm(setState());
    }, []) 
    
    return (
        <>{form == null ? null : form}</>
    )
}
export default Authentication