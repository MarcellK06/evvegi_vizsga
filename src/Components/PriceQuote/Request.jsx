import { useContext, useEffect, useRef } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import { NavigatorContext } from "../../Providers/NavigatorProvider";

function Request() {
  var API = CONFIG.API;

  const subjectRef = useRef();
  const bodyRef = useRef();
  const ownCarsRef = useRef();

  const SendRequest = () => {
    var subject = subjectRef.current.value;
    var body = bodyRef.current.value;
    var owncars = ownCarsRef.current.value;

    $.ajax({
      url: `${API}/request/send`,
      method: "post",
      data: {
        subject: subject,
        body: body,
        owncars: owncars,
      },
      success: function (resp) {
        window.location.reload();
      },
    });
  };
  const { _Navigator } = useContext(NavigatorContext);
  useEffect(() => {
    _Navigator.footerFix();
  }, []);

  return (
    <>
      <label htmlFor="subject">
        <h4>Cím</h4>
        <p>Írja le röviden, mit tapasztal járműve!</p>
      </label>
      <input type="text" name="subject" id="subject" />
      <label htmlFor="body">
        <h4>Leírás</h4>
        <p>Írja le részletesebben járműve problémáját!</p>
      </label>
      <input type="text" name="body" id="body" />
      <label htmlFor="owncars">Saját Jármű</label>
      <select name="owncars" id="owncars">
        <option value="owncar1">owncar1</option>
        <option value="owncar2">owncar2</option>
        <option value="owncar3">owncar3</option>
      </select>

      <input type="button" value="Árajánlat Kérése" onClick={SendRequest} />
    </>
  );
}

export default Request;
