import { useContext, useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { NavigatorContext } from "../../Providers/NavigatorProvider";

function RegisterForm() {
  var API = CONFIG.API;
  const navigator = useNavigate();

  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();
  const telRef = useRef();
  const passwordAginRef = useRef();

  const [registerError, setRegisterError] = useState();

  const HandleRegister = () => {
    var name = nameRef.current.value;
    var password = passwordRef.current.value;
    var email = emailRef.current.value;
    var tel = telRef.current.value;
    var pswag = passwordAginRef.current.value;

    if (password != pswag) {
      setRegisterError(RegisterError("A két jelszó nem egyezik meg!"));
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setRegisterError(
        RegisterError("Az email cím nem megfelelő! (minta@gmail.com)")
      );
      return;
    }
    const Phoneregex = /^(0|\+36)30?\d{8}$/;
    const Phoneregex2 = /^06\d{2}?\d{7}$/;

    if (!Phoneregex.test(tel) && !Phoneregex2.test(tel)) {
      setRegisterError(
        RegisterError("A telefonszám nem megfelelő! (+36301234567)")
      );
      return;
    }

    $.ajax({
      url: `${API}/user/register`,
      type: "post",
      data: {
        fullName: name,
        email: email,
        phone: tel,
        password: password,
      },
      success: function (resp) {
        navigator("/auth/login");
      },
      error: function (resp) {
        setRegisterError(RegisterError(resp.responseJSON.Message));
      },
    });
  };
  const { _Navigator } = useContext(NavigatorContext);
  useEffect(() => {
    _Navigator.footerFix();
  }, []);
  useEffect(() => {
    window.addEventListener("keypress", (e) => {
      if (window.location.pathname == "/auth/register")
        if (e.key == "Enter") HandleRegister();
    });
  }, []);
  const RegisterError = (error) => {
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
      <div className="container register-form mt-5">
        <div className="row">
          <div className="col-sm-4 mx-auto">
            <div>
              <h3 className="text-center mb-2">Regisztráció</h3>
            </div>
            <br />
            <br />
            {registerError}
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Tejles név"
                ref={nameRef}
              />
            </div>
            <div className="input-group mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Email: minta@mail.com"
                ref={emailRef}
              />
            </div>
            <div className="input-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Jelszó"
                ref={passwordRef}
              />
            </div>
            <div className="input-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Jelszó megerősítése"
                ref={passwordAginRef}
              />
            </div>
            <div className="input-group mb-2">
              <input
                type="tel"
                pattern="[0-9]*"
                inputmode="numeric"
                placeholder="Telefonszám"
                className="form-control"
                ref={telRef}
              />
            </div>
            <p className="text-center">
              {" "}
              <a href="/auth/login">Már van fiókom!</a>
            </p>
            <div className="input-group">
              <input
                type="button"
                value="Regisztráció"
                className="form-control register-button"
                onClick={HandleRegister}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default RegisterForm;
