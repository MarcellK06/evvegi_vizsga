import { useState, useRef } from "react";
import { FaStar, FaRegStar, FaQuoteLeft } from "react-icons/fa";
import CONFIG from "../../config.json";
import Cookies from "js-cookie";
import $ from 'jquery';
function WriteRating() {
  const [current, setCurrent] = useState(5);
  const [length, setLength] = useState(0);
  const reviewText = useRef();
  const API = CONFIG.API;
  const RateStars = (c) => {
    var arr = [];
    for (let i = 0; i < c; i++) {
      arr.push(
        <FaStar
          size={35}
          style={{ color: "#ffbb00" }}
          onClick={() => setCurrent(i + 1)}
        />
      );
    }
    for (let i = c; i < 5; i++) {
      arr.push(<FaRegStar size={35} onClick={() => setCurrent(i + 1)} />);
    }

    return arr;
  };

  const sendReview = () => {
    var text = reviewText.current.value;
    var userid = Cookies.get("userid");
    $.ajax({
      "url": `${API}/ratings/new`,
      type: "POST",
      data: {
        userid: userid,
        stars: current,
        comment: text
      },
      success: (resp) => {
        window.location.reload();
      }
    })
  }

  return (
    <>
    <hr />
      <div className="d-flex justify-content-center mt-2">{RateStars(current)}</div>
      <hr />
      <div className="mt-3">
        <textarea
          maxLength={250}
          className="form-control"
          onInput={(e) => setLength(e.target.value.length)}
          cols={40}
          rows={3}
          ref={reviewText}
        ></textarea>
        <p>{length} / 250</p>
      </div>
      <div>
        <button className="h-btn w-100 p-3 mt-3" onClick={sendReview}>Küldés</button>
      </div>
    </>
  );
}
export default WriteRating;
