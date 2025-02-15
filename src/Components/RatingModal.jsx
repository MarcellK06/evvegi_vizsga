import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import API from "../config.json";
function RatingModal() {
  const [stars, setStars] = useState(5);
  const [error, setError] = useState("");

  const Handle = () => {};

  const StartSelector = ({ stars, s = 35 }) => {
    var st = [];

    for (let i = 0; i < stars; i++) {
      st.push(
        <FaStar
          size={s}
          style={{ color: "#ffbb00" }}
          onClick={() => setStars(i + 1)}
        />
      );
    }
    for (let i = st.length; i < 5; i++) {
      st.push(<FaRegStar size={s} onClick={() => setStars(i + 1)} />);
    }

    return (
      <>
        <div className="d-flex justify-content-center mt-3">
          {st.map((i) => i)}
        </div>

        <textarea
          rows="5"
          cols="40"
          className="form-control mt-3"
          placeholder="Megjegyzés (Nem kötelező)"
        ></textarea>
        <div className="my-2">
          <p className="text-danger text-center">{error}</p>
        </div>
        <div className="mt-3">
          <button className="rate-btn p-3 w-100" onClick={Handle}>
            Küldés
          </button>
        </div>
      </>
    );
  };
  return (
    <>
      <StartSelector stars={stars} />
    </>
  );
}
export default RatingModal;
