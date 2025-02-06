import { useRef, useState } from "react";
import API from "../../config.json";
import $ from "jquery";
import { motion } from "framer-motion";

function PasswordResetForm() {
  const emailRef = useRef();
  const tokenRef = useRef();
  const newPasswordRef = useRef();
  const confirmNewPasswordRef = useRef();
  const [_email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [_token, setToken] = useState("");

  const ErrorBox = (message) => (
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
            className="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        </div>
        <div className="col fw-bold" style={{ marginTop: "3%" }}>
          {message}
        </div>
      </div>
    </motion.div>
  );

  const sendRecoveryEmail = () => {
    const email = emailRef.current.value.trim();
    if (!email) {
      setError("Az email mező nem lehet üres.");
      return;
    }

    setEmail(email);
    setError(null);

    $.ajax({
      url: `${API.API}/user/get-password-recovery`,
      type: "POST",
      data: { email },
      success: function (response) {
        setStep(2);
      },
      error: function () {
        setError("Hiba történt! Ellenőrizd az email címet.");
      },
    });
  };

  const verifyToken = () => {
    const token = tokenRef.current.value.trim();
    if (!token) {
      setError("A visszaállító kód nem lehet üres.");
      return;
    }
    setToken(token);

    setError(null);

    $.ajax({
      url: `${API.API}/user/get-password-recovery/verify`,
      type: "POST",
      data: { email: _email, token: token },
      success: function (response) {
        setStep(3);
      },
      error: function (err) {
        console.log(err);
        setError("Helytelen visszaállító kód.");
      },
    });
  };

  const resetPassword = () => {
    const newPassword = newPasswordRef.current.value.trim();
    const confirmNewPassword = confirmNewPasswordRef.current.value.trim();

    if (!newPassword || !confirmNewPassword) {
      setError("A jelszó mezők nem lehetnek üresek.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("A jelszavak nem egyeznek.");
      return;
    }

    setError(null);

    $.ajax({
      url: `${API.API}/user/reset-password`,
      type: "POST",
      data: { email: _email, password: newPassword, token: _token },
      success: () => {
        setStep(4);
      },
      error: () => {
        setError("Hiba történt a jelszó visszaállítása közben.");
      },
    });
  };

  return (
    <div className="container register-form mt-5">
      <div className="row">
        <div className="col-sm-4 mx-auto">
          {error && ErrorBox(error)}
          <h3 className="text-center mb-2">
            Elfelejtett jelszó visszaállítása
          </h3>
          <br />

          {step === 1 && (
            <>
              <div className="input-group mb-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  ref={emailRef}
                />
              </div>
              <div className="input-group">
                <input
                  type="button"
                  value="Visszaállító kód küldése"
                  className="form-control register-button"
                  onClick={sendRecoveryEmail}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Emailben kapott kód"
                  ref={tokenRef}
                />
              </div>
              <div className="input-group">
                <input
                  type="button"
                  value="Ellenőrzés"
                  className="form-control register-button"
                  onClick={verifyToken}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="input-group mb-2">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Új jelszó"
                  ref={newPasswordRef}
                />
              </div>
              <div className="input-group mb-2">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Jelszó megismétlése"
                  ref={confirmNewPasswordRef}
                />
              </div>
              <div className="input-group">
                <input
                  type="button"
                  value="Jelszó visszaállítása"
                  className="form-control register-button"
                  onClick={resetPassword}
                />
              </div>
            </>
          )}

          {step === 4 && (
            <div className="text-center">
              <h4>Sikeres jelszó visszaállítás!</h4>
              <p>Most már bejelentkezhetsz az új jelszóval.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PasswordResetForm;
