import { useEffect, useState } from "react";
import { FaHandLizard, FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import $ from "jquery";
import API from "../../config.json";
import { use } from "react";
function Ratings() {
  const [ratings, setRatings] = useState([]);

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
    //a rate
    //b max length pl max 5 csillag
    const star = <FaRegStar size={s} />;
    const starFilled = <FaStar size={s} style={{ color: "#ffbb00" }} />;

    var stars = [];

    for (let i = 0; i < a; i++) {
      stars.push(starFilled);
    }
    for (let i = stars.length; i < b; i++) {
      stars.push(star);
    }

    return <>{stars.map((Stars) => Stars)}</>;
  };

  const CountPerStars = () => {
    var lst = [];
    for (let i = 1; i < 6; i++) {
      var stars = ratings.countperstars.find((l) => l.star == i);
      if (stars == null) lst.push({ k: <StarBuilder a={i} s={15} />, j: 0 });
      else lst.push({ k: <StarBuilder a={i} s={15} />, j: stars.amount });
    }
    console.log(lst);

    return (
      <>
        {lst.map((i) => (
          <div className="d-flex justify-content-between">
            <p>{i.k}</p>
            <hr />
            <p>{i.j}</p>
          </div>
        ))}
      </>
    );
  };

 

  return (
    <>
      <br />
      <br />
      <h5 className="mt-4 mb-5">
        Szervizünk <b>{ratings.avg}</b> csillagos értékelést kapott, több mint
        <b>{ratings.all_ratings}</b> elégedett ügyfél visszajelzése alapján.
        Gyors, megbízható és profi autójavítás – mert számunkra az Ön biztonsága
        az első!
      </h5>
      <div className="row">
        <div className="col-sm-3 mx-auto mx-2">
          <br /><br /><br />
          <div className="mt-4 rt">
            {ratings.length == 0 ? null : CountPerStars()}
          </div>
        </div>
        <div className="col-sm-9 mt-5">
          <div className="row rating-container mt-5">
            {ratings.length == 0
              ? null
              : ratings.ratings.map((i) => (
                  <div className="col-lg-3 rating-card me-2">
                    <div className="d-flex justify-content-center">
                    <div
                      className="profile-avatar m-0 p-0 d-flex justify-content-end"
                      style={{
                        backgroundImage: `url(${API.API}/cdn/get/${btoa(
                          i.avatar
                        )})`,
                      }}
                    ></div>
                    </div>
                   
                    <div className="w-100 p-2">
                      <h5 className="text-center mb-2">{i.name}</h5>
                      <div className="d-flex justify-content-center">
                        <StarBuilder a={i.count} />
                      </div>
                      <p className="mt-1 text-brake">{i.comment}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default Ratings;
