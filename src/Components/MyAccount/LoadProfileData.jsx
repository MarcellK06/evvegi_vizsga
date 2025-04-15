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
import { MdEmail } from "react-icons/md";
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
        <div className="admin-panel">
          <div className="admin-header">
            <h2 className="admin-title">Admin Panel</h2>
          </div>

          <div className="admin-grid">
            <div
              className="admin-card"
              onClick={() => (window.location.href = "/community/admin")}
            >
              <div className="card-icon">
                <FaThList />
              </div>
              <p className="card-label">Bejegyzések</p>
            </div>

            <div
              className="admin-card"
              onClick={() => (window.location.href = "/appointments/admin")}
            >
              <div className="card-icon">
                <FaCalendar />
              </div>
              <p className="card-label">Foglalt Időpontok</p>
            </div>

            <div
              className="admin-card"
              onClick={() => (window.location.href = "/marketplace/admin")}
            >
              <div className="card-icon">
                <FaNewspaper />
              </div>
              <p className="card-label">Hirdetések</p>
            </div>

            <div
              className="admin-card"
              onClick={() => (window.location.href = "/requests/admin")}
            >
              <div className="card-icon">
                <IoIosPricetags />
              </div>
              <p className="card-label">Árajánlat kérések</p>
            </div>

            <div
              className="admin-card"
              onClick={() => (window.location.href = "/cars/admin")}
            >
              <div className="card-icon">
                <FaCar />
              </div>
              <p className="card-label">Jármű Ellenőrzés</p>
            </div>
            <div
              className="admin-card"
              onClick={() => (window.location.href = "/admin/mailer")}
            >
              <div className="card-icon">
                <MdEmail />
              </div>
              <p className="card-label">Levelek</p>
            </div>
          </div>
        </div>
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
        <div className="profile-container">
          <div className="profile-grid">
            <div className="profile-info-section">
              <div className="profile-header">
                <div
                  className="profile-avatar"
                  style={{
                    backgroundImage: `url(https://code2-api.paraghtibor.hu/user/avatar/${Cookies.get(
                      "userid"
                    )})`,
                  }}
                >
                  <div className="avatar-edit-button">
                    <FaPencilAlt
                      className="edit-icon"
                      onClick={() =>
                        CreateModal(
                          <div>
                            <p className="modal-title">
                              Profilkép szerkesztése
                            </p>
                            <hr />
                          </div>,
                          openAvatarUpload,
                          true
                        )
                      }
                    />
                  </div>
                </div>
                <div className="user-details">
                  <h2 className="user-name">{name}</h2>
                  <p className="user-rank">{rank}</p>
                </div>
              </div>
              <div className="logout-container">
                <button
                  type="button"
                  onClick={HandleLogout}
                  className="logout-button"
                >
                  Kijelentkezés
                </button>
              </div>
            </div>

            <div className="user-data-section ">
              <div className="form-grid">
                <div className="form-labels">
                  <div className="form-label">Email cím</div>
                  <div className="form-label">Telefonszám</div>
                </div>
                <div className="form-fields">
                  <div className="field-container">
                    <label className="mobile-label">Email cím</label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      defaultValue={email}
                      className="text-field mt-2"
                      disabled
                      ref={emailRef}
                    />
                  </div>
                  <div className="field-container">
                    <label className="mobile-label">Telefonszám</label>
                    <input
                      type="text"
                      name="phonenumber"
                      id="phonenumber"
                      defaultValue={phone}
                      className="text-field mt-2"
                      disabled
                      ref={phonenumberRef}
                    />
                  </div>
                </div>
              </div>
              <div className="actions-container">
                <button
                  type="button"
                  id="savebutton"
                  className="h-btn hidden"
                  onClick={saveData}
                >
                  Mentés
                </button>
                <button
                  className="edit-button h-btn p-2"
                  onClick={changeEditMode}
                >
                  <FaPencilAlt className="edit-icon" />
                </button>
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
