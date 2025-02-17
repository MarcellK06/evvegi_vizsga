import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaRegStar, FaQuoteLeft } from "react-icons/fa";
import $ from "jquery";
import API from "../../config.json";

function Ratings() {
  const [ratings, setRatings] = useState({
    avg: 0,
    all_ratings: 0,
    countperstars: [],
    ratings: [],
  });

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
          <h3>{ratings.avg.toString().substring(0, 3)}</h3>
          <StarBuilder a={Math.round(ratings.avg)} s={30} />
          <p>{ratings.all_ratings} értékelés alapján</p>
        </div>
        <div className="rating-distribution">
          <CountPerStars />
        </div>
      </motion.div>
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
