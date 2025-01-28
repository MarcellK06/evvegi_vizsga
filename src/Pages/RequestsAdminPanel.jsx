import Cookie from 'js-cookie';
import { useEffect } from "react";
import ActiveRequests from '../Components/RequestsAdminPanel/ActiveRequests';

function RequestsAdminPanel() {
  const CheckUser = () => {
    var rankid = Cookie.get("rank");
    if (rankid != 1) window.location.pathname = "/";
  };

  useEffect(() => {
    CheckUser();
  }, []);
    return(<>
    <ActiveRequests/>
    </>)
}

export default RequestsAdminPanel;