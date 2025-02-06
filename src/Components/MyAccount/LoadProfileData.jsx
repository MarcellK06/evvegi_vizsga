import { useEffect, useState } from "react";
import CONFIG from "../../config.json";
import Cookie from "js-cookie";
import $ from "jquery";

function LoadProfileData() {
  var API = CONFIG.API;
  var [profile, setProfile] = useState([]);
  class profileData {
    constructor(name, email, phone, rank, avatar) {
      this.name = name;
      this.email = email;
      this.phone = phone;
      this.rank = rank;
      this.avatar = avatar;
    }
  }

  const Get = () => {
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/user/profile-data/${userid}`,
      success: (resp) => {
        var data = resp[0];
        setProfile([
          new profileData(
            data.name,
            data.email,
            data.phone,
            data.type,
            data.avatar
          ),
        ]);
      },
    });
  };

  useEffect(() => {
    Get();
  }, []);

  const AdminPanel = () => {
    if (profile[0].rank == "admin")
      return (
        <>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
              <div className="row text-center border-bottom">
                <p className="fs-3">Admin Panel</p>
              </div>
              <div className="row my-2">
                <div className="col-3"></div>
                <div className="col-6">
                  <input
                    type="button"
                    value="Bejegyzések"
                    onClick={() => (window.location.href = "/posts/admin")}
                    className="form-control my-3 hoverbutton"
                  />
                  <input
                    type="button"
                    value="Időpont foglalások"
                    onClick={() =>
                      (window.location.href = "/appointments/admin")
                    }
                    className="form-control my-3 hoverbutton"
                  />
                  <input
                    type="button"
                    value="Hírdetések"
                    onClick={() =>
                      (window.location.href = "/marketplace/admin")
                    }
                    className="form-control my-3 hoverbutton"
                  />
                  <input
                    type="button"
                    value="Árajánlat kérések"
                    onClick={() => (window.location.href = "/requests/admin")}
                    className="form-control my-3 hoverbutton"
                  />
                </div>
                <div className="col-3"></div>
              </div>
            </div>
            <div className="col-2"></div>
          </div>
        </>
      );
    else return <></>;
  };

  const profileEntry = (el) => {
    var name = el.name;
    var email = el.email;
    var phone = el.phone;
    var rank = el.rank;
    var avatar = el.avatar;

    const HandleLogout = () => {
      Cookie.remove("userid");
      Cookie.remove("token");
      Cookie.remove("rank");
      window.location.href = "/";
    };

    return (
      <>
        <div className="row my-3">
          <div className="col-2"></div>
          <div className="col-8">
            <div className="row">
              <div className="col-2 d-flex justify-content-end">
                <div
                  className="profile-avatar m-0 p-0"
                  style={{ backgroundImage: `url(${avatar})` }}
                ></div>
              </div>
              <div className="col-8">
                <div className="d-flex">
                  <div>
                    <p className="fs-3 mb-0">{name}</p>
                    <p className="ms-3 fw-bold">{rank}</p>
                  </div>
                  <div>
                    <input
                      type="button"
                      value="Kijelentkezés"
                      onClick={HandleLogout}
                      className="form-control mx-5 w-75 hoverbutton"
                    />
                  </div>
                </div>
              </div>
              <div className="col-2"></div>
            </div>
            <div className="row my-2">
              <div className="col-3"></div>
              <div className="col-3 d-flex lh-lg">
                <span className="lh-lg">Email Cím</span>
              </div>
              <div className="col-3">
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={email}
                  className="form-control"
                  disabled
                />
              </div>
              <div className="col-3"></div>
            </div>
            <div className="row border-bottom pb-3 my-2">
              <div className="col-3"></div>
              <div className="col-3 d-flex lh-lg">
                <span className="lh-lg">Telefonszám</span>
              </div>
              <div className="col-3">
                <input
                  type="text"
                  name="phonenumber"
                  id="phonenumber"
                  value={phone}
                  className="form-control"
                  disabled
                />
              </div>
              <div className="col-3"></div>
            </div>
          </div>
          <div className="col-2"></div>
        </div>
        <AdminPanel />
      </>
    );
  };

  return (
    <>
      <div className="row text-center">
        <p className="fs-3">Profilod</p>
      </div>
      {profile.map((i) => profileEntry(i))}
    </>
  );
}

export default LoadProfileData;
