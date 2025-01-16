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

    }

    const RequestEntry = (el) => {
        return (<>
        <p>{el.title}</p>
        <p>{el.description}</p>
        <p>{el.vin}</p>
        <p>{el.answered}</p>
        </>)
    }

    var templateList = [new RequestStruct("Ez egy cím.", "Ez egy leírás.", "XXXXXXXXXXXXXXXX", "false")];

    return (<>
    {templateList.map((i) => RequestEntry(i))}
</>)
}

export default ActiveRequests;