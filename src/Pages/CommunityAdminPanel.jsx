import Cookie from "js-cookie";
import { useEffect } from "react";

function CommunityAdminPanel() {
  const CheckUser = () => {
    var rankid = Cookie.get("rank");
    if (rankid != 1) window.location.pathname = "/";
  };

  useEffect(() => {
    CheckUser();
  }, []);
  return <></>;
}

export default CommunityAdminPanel;
