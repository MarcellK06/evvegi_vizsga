import { useContext, useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NavigatorContext } from "../../Providers/NavigatorProvider";

function LoginForm() {
  var API = CONFIG.API;

  var queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const emailRef = useRef();
  const passwordRef = useRef();

  const [loginError, setLoginError] = useState(null);
  const navigator = useNavigate();

  const HandleLogin = () => {
    var email = emailRef.current.value;
    var password = passwordRef.current.value;

    if (email.length == 0 || password.length == 0) {
      setLoginError(LoginError("Mezők kitöltése kötelező!"));
      return;
    }
    $.ajax({
      url: `${API}/user/login`,
      type: "post",
      data: {
        email: email,
        password: password,
      },
      success: function (resp) {
        Cookie.set("token", resp.token);
        Cookie.set("userid", resp.user.userid);
        Cookie.set("rank", resp.user.rankid);

        var r = urlParams.get("r");
        if (r != null) {
          window.location.href = r;
          return;
        }
        window.location.href = "/";
      },
      error: function (res) {
        setLoginError(LoginError(res.responseJSON.Message));
      },
    });
  };
  useEffect(() => {
    window.addEventListener("keypress", (e) => {
      if (window.location.pathname == "/auth/login")
        if (e.key == "Enter") HandleLogin();
    });
  }, []);

  const { _Navigator } = useContext(NavigatorContext);
  useEffect(() => {
    _Navigator.footerFix();
  }, []);
  const LoginError = (error) => {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="messagebox w-100 messagebox-error mt-3"
        >
          <div className="row">
            <div className="col-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="currentColor"
                class="bi bi-x"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
            </div>
            <div className="col fw-bold" style={{ marginTop: "3%" }}>
              {error}
            </div>
          </div>
        </motion.div>
      </>
    );
  };

  return (
    <>
      <div className="d-none d-sm-block">
        <br />
        <br />
        <br />
        <br />
        <br /> <br />
        <br />
      </div>
      <div className="container login-form">
        <div className="row">
          <div className="col-sm-4 mx-auto">
            <div>
              <h3 className="text-center mb-2">Bejelentkezés</h3>
            </div>
            <br />
            <br />

            {loginError}

            <div className="input-group mb-2 mt-2">
              <input
                type="email"
                className="form-control w-100"
                placeholder="Email: minta@mail.com"
                ref={emailRef}
                required
              />
            </div>

            <div className="input-group mb-2">
              <input
                type="password"
                className="form-control w-100"
                ref={passwordRef}
                placeholder="Jelszó"
                required
              />
            </div>
            <div className="d-flex justify-content-between mx-1">
              <p>
                <a href="/auth/register">Még nincs fiókom!</a>
              </p>
              <p>
                <a href="/auth/password-reset">Elfelejtettem a jelszavamat!</a>
              </p>
            </div>
            <div className="input-group mb-2">
              <input
                type="button"
                value="Bejelentkezés"
                className="login-button form-control w-100"
                onClick={HandleLogin}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
