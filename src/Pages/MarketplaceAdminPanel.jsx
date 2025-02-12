import Cookie from "js-cookie";
import { useEffect } from "react";
import ListListings from "../Components/MarketplaceAdminPanel/ListListings";
import { useNavigate } from "react-router-dom";

function MarketplaceAdminPanel() {
  const navi = useNavigate();
  const CheckUser = () => {
    var rankid = Cookie.get("rank");
    if (rankid != 1) 
      navi("/");
  };

  useEffect(() => {
    CheckUser();
  }, []);
  return (
    <>
      <ListListings />
    </>
  );
}

export default MarketplaceAdminPanel;
