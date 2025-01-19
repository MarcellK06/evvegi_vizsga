import { useContext, useEffect } from "react";
import CreateListing from "../Components/Marketplace/CreateListing";
import ListListings from "../Components/Marketplace/ListListings";

function Marketplace(){
    return (
        <>
        <CreateListing/>
        <ListListings/>
        </>
    );
}
export default Marketplace;