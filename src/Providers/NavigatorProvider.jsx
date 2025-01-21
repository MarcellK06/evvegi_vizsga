import { createContext, useEffect, useState } from "react";
import Navbar from "../Components/Navigator/Navbar";
import Footer from "../Components/Navigator/Footer";
import React from "react";
import ReactDOM from "react-dom/client";
export const NavigatorContext = createContext();

export const NavigatorProvider = ({children}) => {

    const [_Navbar, _setNavbar] = useState(<Navbar/>)
    const [_Footer, _setFooter] = useState(<Footer/>)
    class Navigator {
        type = "" //navbar / footer
        Navbar(){
            this.type = "NAVBAR";
            return this;
        }
        Footer(){
            this.type = "FOOTER";
            return this;
        }
        disable(){
            this.#set(false);
            console.info(this.type+" => disabled")
        }
        enable(){
            this.#set(true);
            console.info(this.type+" => enabled")
        }
        #set(eD){ //private method
            if(eD){
                if(this.type == "NAVBAR"){
                    _setNavbar(<Navbar/>)
                }
                else if(this.type == "FOOTER"){
                    _setFooter(<Footer/>)
                }
            } else {
                if(this.type == "NAVBAR"){
                    _setNavbar(null)
                }
                else if(this.type == "FOOTER"){
                    _setFooter(null)
                }
            }
        }    
    }
    const _Navigator = new Navigator();
    useEffect(() => {
        const header = ReactDOM.createRoot(document.getElementById("header"));
        const footer = ReactDOM.createRoot(document.getElementById("footer"));
       // header.render(_Navbar)
       // footer.render(_Footer)   
    }, [_Navbar, _Footer])
    
    return (
        <NavigatorContext.Provider value={{_Navigator}}>{children}</NavigatorContext.Provider>
    )
}
//ötlet: ha lenne telefonra más navbar akkor pl : _Navigator.phone();

/* 
HASZNÁLAT:
import { NavigatorContext } from "../Providers/NavigatorProvider";
const {_Navigator} = useContext(NavigatorContext);
_Navigator.Navbar().disable(); 
  

*/