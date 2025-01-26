import { useEffect } from "react";
import Cookies from "js-cookie";
function AuthCheck() {
  useEffect(() => {
    if (Cookies.get("userid") != null) return;
    var wl = window.location.pathname;
    if (wl != "/auth/login" && wl != "/auth/register") {
      window.location.href = `/auth/login?r=${wl}`;
    }
  }, []);
  return <></>;
}
export default AuthCheck;
