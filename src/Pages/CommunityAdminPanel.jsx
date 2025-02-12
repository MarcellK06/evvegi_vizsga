import Cookie from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CommunityAdminPanel() {
  const navi = useNavigate();
  const CheckUser = () => {
    var rankid = Cookie.get("rank");
    if (rankid != 1) 
      navi("/");
  };

  useEffect(() => {
    CheckUser();
  }, []);
  return <></>;
}

export default CommunityAdminPanel;
