import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaRegStar, FaQuoteLeft } from "react-icons/fa";
import $ from "jquery";
import API from "../../config.json";
import { ModalContext } from "../../Providers/ModalProvider";
import { Star } from "lucide-react";
import WriteRating from "./WriteRating";

function Ratings() {
  const [ratings, setRatings] = useState({
    avg: 0,
    all_ratings: 0,
    countperstars: [],
    ratings: [],
  });

  const { CreateModal } = useContext(ModalContext);
  useEffect(() => {
    $.ajax({
      url: `${API.API}/ratings/get`,
      type: "get",
      success: function (res) {
        setRatings(res);
      },
    });
  }, []);

  const StarBuilder = ({ a, b = 5, s = 25 }) => {
    const star = <FaRegStar size={s} />;
    const starFilled = <FaStar size={s} style={{ color: "#ffbb00" }} />;

    return (
      <>
        {[...Array(b)].map((_, index) => (
          <span key={index}>{index < a ? starFilled : star}</span>
        ))}
      </>
    );
  };

  const CountPerStars = () => {
    return (
      <div className="star-distribution">
        {[5, 4, 3, 2, 1].map((star) => {
          const count =
            ratings.countperstars.find((s) => s.star === star)?.amount || 0;
          const percentage = (count / ratings.all_ratings) * 100 || 0;
          return (
            <div key={star} className="star-row">
              <span className="star-label">
                {star} <FaStar />
              </span>
              <div className="progress">
                <motion.div
                  className="progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="star-count">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ratings-container">
      <motion.h2
        className="ratings-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Ügyfeleink véleménye
      </motion.h2>
      <motion.div
        className="ratings-summary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="average-rating">
          <h3>{ratings.avg == null ? 0 : ratings.avg.toString().substring(0, 3)}</h3>
          <StarBuilder a={Math.round(ratings.avg == null ? 0 : ratings.avg)} s={30} />
          <p>{ratings.all_ratings} értékelés alapján</p>
        </div>
        <div className="rating-distribution">
          <CountPerStars />
        </div>
      </motion.div>
      <div className="d-flex justify-content-center my-4">
        <div
          className="h-btn fs-5 p-3"
          style={{ cursor: "pointer" }}
          onClick={() => {
            CreateModal("Értékelés", <WriteRating />, true);
          }}
        >
          <div className="d-flex justify-content-between">
            <div className="me-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-pencil"
                viewBox="0 0 16 16"
              >
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
              </svg>
            </div>
            <div> Véleményt írok</div>
          </div>
        </div>
      </div>
      <div className="ratings-grid">
        {ratings.ratings.map((rating, index) => (
          <motion.div
            key={index}
            className="rating-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="rating-header">
              <img
                src={`${API.API}/cdn/get/${btoa(rating.avatar)}`}
                alt={rating.name}
                className="avatar"
              />
              <h4>{rating.name}</h4>
            </div>
            <div className="rating-stars">
              <StarBuilder a={rating.count} s={20} />
            </div>
            <div className="rating-comment">
              <FaQuoteLeft className="quote-icon" />
              <p>{rating.comment}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Ratings;
