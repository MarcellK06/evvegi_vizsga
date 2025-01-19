import { useEffect } from "react";
import CONFIG from "../../config.json";
import Cookie from 'js-cookie';
import Request from "./Request";
import $ from 'jquery';

function ActiveRequests() {
    var API = CONFIG.API;

    
    class RequestStruct {
constructor(title, description, vin, answered) {
    this.title = title;
    this.description = description;
    this.vin = vin;
    this.answered = answered;
}
    }

    var requests = [];

    const LoadRequests = () => {
        var userid = Cookie.get("userid");
        $.ajax({
            url: `${API}/pricerequests/get-all`,
            data: {
                userid: userid
            },
            success: function(resp) {
                resp.requests.forEach((el) => {
                    requests.push(new RequestStruct(el.title, el.description, el.vin, el.answered));
                });
            }
        });
    }

    const RequestEntry = (el) => {
        return (<div style={{backgroundColor: el.answered ? "green":"red"}}>
        <p>{el.title}</p>
        <p>{el.description}</p>
        <p>{el.vin}</p>
        <p>Válaszolva: {el.answered ? "Igen" : "Nem"}</p>
        <input type="button" value="Válasz Mutatása" style={{display: el.answered ? "block" : "none"}} />
        </div>);
    }

    useEffect(() => {
        LoadRequests();
    }, []);

    return (<>
    {requests.map((i) => RequestEntry(i))}
    <Request/>
</>);
}

export default ActiveRequests;