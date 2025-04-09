import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import $ from "jquery";
import CONFIG from "../config.json";
function VerifyAccount() {
  const { token } = useParams();
  const navigator = useNavigate();

  const [Component, setComponent] = useState(
    <h4 className="text-center">Betöltés...</h4>
  );

  const SUCCESS = () => {
    return (
      <>
        <div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              fill="currentColor"
              className="bi bi-check-circle-fill text-success verify-account-success-icon"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
          </div>
          <div className="mt-2 text-center">Sikeres fiók megerősítés.</div>
          <button
            className="h-btn mt-4"
            onClick={() => navigator("/auth/login")}
          >
            Tovább a bejelentkezésre
          </button>
        </div>
      </>
    );
  };

  const ERROR = ({ message }) => {
    return (
      <>
        <div>
          <div className="d-flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              fill="currentColor"
              className="bi bi-x-circle-fill text-danger mx-auto"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
            </svg>
          </div>

          <div className="mt-2 text-center">{message}</div>
        </div>
      </>
    );
  };
  useEffect(() => {
    $.ajax({
      url: CONFIG.API + `/user/verify/${token}`,
      success: function (response) {
        setComponent(<SUCCESS />);
      },
      error: function (response) {
        setComponent(<ERROR message={response.responseJSON.Message} />);
      },
    });
  }, []);
  return (
    <>
      <div className="d-flex justify-content-center mt-5">{Component}</div>
    </>
  );
}
export default VerifyAccount;
