import Cookie from "js-cookie";
import { useEffect } from "react";
import ListListings from "../Components/MarketplaceAdminPanel/ListListings";

function MarketplaceAdminPanel() {
  const CheckUser = () => {
    var rankid = Cookie.get("rank");
    if (rankid != 1) window.location.pathname = "/";
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
