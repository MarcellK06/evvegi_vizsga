import CONFIG from "../../config.json";

function ListOwnCars() {
    var API = CONFIG.API;

    
    class OwnCar {
        constructor(brand, model, year, licenseplate, vin, images) {
            this.brand = brand;
            this.model = model;
            this.year = year;
            this.licenseplate = licenseplate;
            this.vin = vin;
            this.images = images;
        }
    }

    const LoadOwnCars = () => {
        // TODO
    }

    const OwnCarEntry = (el) => {
        return(<>
        <p>{el.brand}</p>
        <p>{el.model}</p>
        <p>{el.year}</p>
        <p>{el.licenseplate}</p>
        <p>{el.vin}</p>
        <p>Jármű Állapota: <b>OK</b></p>
        <img src={el.images[0]} alt="Forgalmi Kép 1. Oldal" />
        <img src={el.images[1]} alt="Forgalmi Kép 2. Oldal" />
        <img src={el.images[2]} alt="Jármű Alvázszám Kép" />
        <input type="button" value="Törlés" />
        </>)
    } 


    var owncars = [new OwnCar("BMW", "E46 316i", "2004", "NFG162", "XXXXXXXXXXXXXXXXX", ["https://m.blog.hu/ug/ugyintezoskisokos/postimage/forgalmi-engedely_1462879533.jpg", "https://autos.culturamix.com/blog/wp-content/gallery/transferencia-de-veiculo-como-fazer2/transferencia-de-veiculo-como-fazer-5.jpg", "https://th.bing.com/th/id/OIP.lcbZb2_HAU6QPIqLeKUJEgHaFj?rs=1&pid=ImgDetMain"])]

    return (<>
    {owncars.map((i) => OwnCarEntry(i))}
    </>)
}

export default ListOwnCars;