import { useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import Cookie from "js-cookie";
import { ModalContext } from "../../Providers/ModalProvider";
import $ from "jquery";
import { useContext } from "react";
import Cookies from "js-cookie";
import {
  FaPencilAlt,
  FaThList,
  FaCar,
  FaNewspaper,
  FaCalendar,
} from "react-icons/fa";
import { IoIosPricetags } from "react-icons/io";
function LoadProfileData() {
  var API = CONFIG.API;
  const { CreateModal } = useContext(ModalContext);
  var avatarRef = useRef();
  var [profile, setProfile] = useState([]);
  const phonenumberRef = useRef();
  const emailRef = useRef();
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
  const getAvatar = () => {
    var userid = Cookies.get("userid");
    $.ajax({
      url: `${API}/user/avatar/${userid}`,
      success: (resp) => {
        profile.avatar = resp;
      },
    });
  };

  useEffect(() => {
    Get();
    getAvatar();
  }, []);

  const AdminPanel = () => {
    if (profile[0].rank == "admin")
      return (
        <>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
              <div className="row text-center border-bottom">
              <p className="fs-3">Admin Panel
              </p>
              </div>
            </div>
            <div className="col-2"></div>
            
            <div className="row p-0 mx-auto">
              <div className="col-2"></div>
              <div className="col-8">

              <div className="row justify-content-center">
                <div className="col-12 col-md-4 col-lg-3 mb-3">
                  <div
                    className="form-control my-3 hoverbutton d-flex flex-column text-center container px-3"
                    onClick={() => (window.location.href = "/posts/admin")}
                  >
                    <FaThList size={20} className="mx-auto" />
                    <p className="mb-0 pt-2">Bejegyzések</p>
                  </div>
                </div>
                <div className="col-12 col-md-4 col-lg-3 mb-3">
                  <div
                    className="form-control my-3 hoverbutton d-flex flex-column text-center container px-3"
                    onClick={() => (window.location.href = "/appointments/admin")}
                  >
                    <FaCalendar size={20} className="mx-auto" />
                    <p className="mb-0 pt-2">Foglalt Időpontok</p>
                  </div>
                </div>
                <div className="col-12 col-md-4 col-lg-3 mb-3">
                  <div
                    className="form-control my-3 hoverbutton d-flex flex-column text-center container px-3"
                    onClick={() => (window.location.href = "/marketplace/admin")}
                  >
                    <FaNewspaper size={20} className="mx-auto" />
                    <p className="mb-0 pt-2">Hirdetések</p>
                  </div>
                </div>
                <div className="col-12 col-md-4 col-lg-3 mb-3">
                  <div
                    className="form-control my-3 hoverbutton d-flex flex-column text-center container px-3"
                    onClick={() => (window.location.href = "/requests/admin")}
                  >
                    <IoIosPricetags size={20} className="mx-auto" />
                    <p className="mb-0 pt-2">Árajánlat kérések</p>
                  </div>
                </div>
                <div className="col-12 col-md-4 col-lg-3 mb-3">
                  <div
                    className="form-control my-3 hoverbutton d-flex flex-column text-center container px-3"
                    onClick={() => (window.location.href = "/cars/admin")}
                  >
                    <FaCar size={20} className="mx-auto" />
                    <p className="mb-0 pt-2">Jármű Ellenőrzés</p>
                  </div>
                </div>
            </div>
          </div>
              </div>
              <div className="col-2">

              </div>
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

    const uploadAvatar = () => {
      var avatar = avatarRef.current.files[0];
      var userid = Cookies.get("userid");
      if (!avatar) return;

      var data = new FormData();
      data.append("userid", userid);
      data.append("avatar", avatar);
      $.ajax({
        url: `${API}/user/upload_avatar`,
        type: "post",
        data: data,
        processData: false,
        contentType: false,
        success: (resp) => {
          window.location.reload();
        },
        error: (err) => {
          console.log(err);
        },
      });
    };

    const openAvatarUpload = () => {
      return (
        <>
          <div className="row my-3">
            <div className="col-2"></div>
            <div className="col-8">
              <label htmlFor="avatar" className="fs-4 my-1">
                Profilkép
              </label>
              <input
                type="file"
                name="avatar"
                id="avatar"
                ref={avatarRef}
                className="form-control my-1"
                required
                accept="image/png, image/jpeg"
              />
            </div>
            <div className="col-2"></div>
          </div>
          <div className="row my-3">
            <div className="col-2"></div>
            <div className="col-8">
              <input
                type="button"
                value="Feltöltés"
                onClick={uploadAvatar}
                className="form-control my-1 hoverbutton"
              />
            </div>
            <div className="col-2"></div>
          </div>
        </>
      );
    };

    const changeEditMode = () => {
      if (document.getElementById("email").disabled == false)
        document.getElementById("email").disabled = true;
      else document.getElementById("email").disabled = false;
      if (document.getElementById("phonenumber").disabled == false)
        document.getElementById("phonenumber").disabled = true;
      else document.getElementById("phonenumber").disabled = false;

      if (document.getElementById("savebutton").classList.contains("d-none"))
        document.getElementById("savebutton").classList = ["form-control my-3"];
      else document.getElementById("savebutton").classList = ["d-none"];
    };

    const saveData = () => {
      var userid = Cookies.get("userid");
      var email = emailRef.current.value;
      var phonenumber = phonenumberRef.current.value;
      $.ajax({
        url: `${API}/user/update`,
        type: "post",
        data: {
          userid: userid,
          email: email,
          phonenumber: phonenumber,
        },
        success: (resp) => {
          window.location.reload();
        },
      });
    };
    return (
      <>
        <div className="container my-5">
          <div className="row">
            <div className="col-sm-6 mb-3">
              <div className="row">
                <div className="col-sm-7">
                  <div className="d-flex">
                    <div
                      className="profile-avatar m-0 p-0 d-flex justify-content-end"
                      style={{
                        backgroundImage: `url(https://code2-api.paraghtibor.hu/user/avatar/${Cookies.get(
                          "userid"
                        )})`,
                      }}
                    >
                      <div className="postcolor mt-auto rounded-circle hoverbutton">
                        <FaPencilAlt
                          className="m-2"
                          onClick={() =>
                            CreateModal(
                              <div>
                                <p className="fs-3">Profilkép szerkesztése</p>
                                <hr />
                              </div>,
                              openAvatarUpload,
                              true
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="d-flex mt-3 ms-3">
                      <div>
                        <p className="fs-3 mb-0">{name}</p>
                        <p className="ms-3 fw-bold text-uppercase">{rank}</p>
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 mx-auto mt-5 mt-sm-0">
                  <input
                    type="button"
                    value="Kijelentkezés"
                    onClick={HandleLogout}
                    className="hoverbutton h-btn w-100"
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="row g-0">
                <div className="col-sm-2 mx-auto d-none d-xl-grid">
                  <div className="mb-5 mt-1">Email cím:</div>
                  <div>Telefonszám:</div>
                </div>
                <div className="col-sm-5 mx-auto">
                  <div className="d-block d-xl-none">
                    <label>Email cím:</label>
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="email"
                      id="email"
                      defaultValue={email}
                      className="form-control"
                      disabled
                      ref={emailRef}
                    />
                  </div>
                  <div className="d-block d-xl-none">
                    <label>Telefonszám:</label>
                  </div>

                  <div className="mb-2">
                    <input
                      type="text"
                      name="phonenumber"
                      id="phonenumber"
                      defaultValue={phone}
                      className="form-control"
                      disabled
                      ref={phonenumberRef}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6 mx-auto">
                    <input
                      type="button"
                      value="Mentés"
                      className="d-none h-btn"
                      id="savebutton"
                      onClick={saveData}
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <FaPencilAlt
                  size={30}
                  className="hoverbutton h-btn"
                  onClick={changeEditMode}
                />
              </div>
            </div>
          </div>
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
