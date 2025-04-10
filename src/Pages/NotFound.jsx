import { Link } from "react-router-dom";
import CheckEngine from "../Media/checkengine.png";
function NotFound() {
  return (
    <>
      <div className="not-found-container d-flex align-items-center justify-content-center vh-100">
        <div className="text-center">
          <img src={CheckEngine} alt="" style={{ width: "10%" }} />
          <h1 className="display-1 fw-bold">404</h1>
          <p className="fs-3">
            <span className="text-danger">Hoppá!</span> Az oldal nem található.
          </p>
          <p className="lead">
            Sajnáljuk, de a keresett oldal nem létezik, eltávolították vagy
            átmenetileg nem elérhető.
          </p>
          <Link to="/" className="btn btn-primary">
            Vissza a főoldalra
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotFound;
