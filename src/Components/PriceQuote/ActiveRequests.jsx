import CONFIG from "../../config.json";

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

    const LoadRequests = () => {
        //TODO
    }

    const RequestEntry = (el) => {
        return (<div style={{backgroundColor: el.answered ? "green":"red"}}>
        <p>{el.title}</p>
        <p>{el.description}</p>
        <p>{el.vin}</p>
        <p>Válaszolva: {el.answered ? "Igen" : "Nem"}</p>
        <input type="button" value="Válasz Mutatása" style={{display: el.answered ? "block" : "none"}} />
        </div>)
    }

    var templateList = [new RequestStruct("Ez egy cím.", "Ez egy leírás.", "XXXXXXXXXXXXXXXX", false),new RequestStruct("Ez egy másik cím.", "Ez egy másik leírás.", "YYYYYYYYYYYYYYYYY", true)];

    return (<>
    {templateList.map((i) => RequestEntry(i))}
</>)
}

export default ActiveRequests;