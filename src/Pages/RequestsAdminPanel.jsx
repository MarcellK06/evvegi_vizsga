import Cookie from "js-cookie";
import { useEffect } from "react";
import ActiveRequests from "../Components/RequestsAdminPanel/ActiveRequests";
import { useNavigate } from "react-router-dom";

function RequestsAdminPanel() {
  const navi = useNavigate();
  const CheckUser = () => {
    var rankid = Cookie.get("rank");
    if (rankid != 1) navi("/");
  };

  useEffect(() => {
    CheckUser();
  }, []);
  return (
    <>
      <ActiveRequests />
    </>
  );
}

export default RequestsAdminPanel;
