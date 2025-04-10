import { useContext, useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import CommunityPostComments from "./CommunityPostComments";
import { CiClock2 } from "react-icons/ci";
import {
  FaRegCommentDots,
  FaTrash,
  FaImages,
  FaEye,
  FaExclamationTriangle,
} from "react-icons/fa";
import { json } from "react-router-dom";
import { ModalContext } from "../../Providers/ModalProvider";
import Cookies from "js-cookie";

function LoadCommunityPostsAdmin() {
  const [i, setI] = useState(1);
  const [loading, setLoading] = useState(true);
  const { CreateModal } = useContext(ModalContext);
  var API = CONFIG.API;

  class CommunityPost {
    constructor(
      id,
      username,
      userid,
      title,
      description,
      images,
      postedat,
      liked,
      likes,
      comments,
      avatar
    ) {
      this.id = id;
      this.username = username;
      this.userid = userid;
      this.title = title;
      this.description = description;
      this.postedat = postedat;
      this.liked = liked;
      this.likes = likes;
      this.comments = comments;
      this.avatar = avatar;
      if (images.includes(",")) this.images = images.split(",");
      else this.images = [images];
    }
  }

  var posts = [];
  var [activeposts, setActivePosts] = useState([]);

  const ShowComments = (id) => {
    var el = document.getElementById(`comments-${id}`);
    if (el.classList.contains("d-block")) {
      el.classList.remove("d-block");
      el.classList.add("d-none");
    } else {
      el.classList.add("d-block");
      el.classList.remove("d-none");
    }
  };

  const loadImage = (idx, el) => {
    if (el.images[0] == "") return;
    var postid = el.id;
    return (
      <div className={`carousel-item ${idx == 0 ? "active" : ""}`} key={idx}>
        <div className="d-flex p-3">
          <img
            src={`${API}/community/postimages/${postid}/${idx}`}
            className="carousel-image img-fluid rounded mx-auto"
            alt={`Post image ${idx + 1}`}
          />
        </div>
      </div>
    );
  };

  const showAllImages = (el) => {
    return (
      <div className="image-carousel-container">
        <div id={`carousel-${el.id}`} className="carousel slide">
          <div className="carousel-inner rounded-3 overflow-hidden">
            {el.images.map((i, idx) => loadImage(idx, el))}
          </div>
          {el.images.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carousel-${el.id}`}
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carousel-${el.id}`}
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const DeletePost = (postid) => {
    var userid = Cookies.get("userid");

    if (!window.confirm("Biztosan törölni szeretné ezt a bejegyzést?")) {
      return;
    }

    $.ajax({
      url: `${API}/community/admin/posts/delete`,
      type: "post",
      data: {
        userid: userid,
        postid: postid,
      },
      success: (resp) => {
        window.location.reload();
      },
    });
  };

  const formatTimeAgo = (postedat) => {
    var postedat_text = "";
    var psplit = postedat.split("-");
    var now = new Date();
    if (psplit[1][0] == "0") psplit[1] = psplit[1][1];

    if (parseInt(psplit[2].split(" ")[0]) != now.getDate())
      postedat_text = `${now.getDate() - parseInt(psplit[2])} n`;
    if (parseInt(psplit[1]) != now.getMonth() + 1)
      postedat_text = `${now.getMonth() + 1 - parseInt(psplit[1])} h`;
    if (parseInt(psplit[0]) != now.getFullYear())
      postedat_text = `${now.getFullYear() - parseInt(psplit[0])} é`;
    psplit = postedat.split(" ")[1].split(":");
    if (postedat_text == "") {
      if (parseInt(psplit[2]) != now.getSeconds())
        postedat_text = `${now.getSeconds() - parseInt(psplit[2])} mp`;
      if (parseInt(psplit[1]) != now.getMinutes())
        postedat_text = `${now.getMinutes() - parseInt(psplit[1])} p`;
      if (parseInt(psplit[0]) != now.getHours())
        postedat_text = `${now.getHours() - parseInt(psplit[0])} ó`;
    }

    return postedat_text;
  };

  const PostEntry = (el) => {
    var postedat_text = formatTimeAgo(el.postedat);
    var userid = el.userid;

    return (
      <div className="admin-post-card" key={el.id}>
        <div className="post-header">
          <div className="user-info">
            <div
              className="user-avatar"
              style={{ backgroundImage: `url(${API}/user/avatar/${userid})` }}
            ></div>
            <div className="user-name">{el.username}</div>
          </div>
          <div className="post-time">
            <CiClock2 className="time-icon" />
            <span>{postedat_text}</span>
          </div>
        </div>

        <div className="post-content">
          <h3 className="post-title">{el.title}</h3>
          <p className="post-description">{el.description}</p>

          {el.images[0] != "" && (
            <div className="post-images">
              <div className="image-preview">
                <img
                  src={`${API}/community/postimages/${el.id}/0`}
                  className="preview-image"
                  alt="Post preview"
                  onClick={() =>
                    CreateModal(
                      <div className="modal-header">
                        <h4 className="modal-title">
                          <FaImages className="me-2" />
                          Képek megtekintése
                        </h4>
                      </div>,
                      showAllImages(el),
                      true
                    )
                  }
                />
                {el.images.length > 1 && (
                  <div className="image-count">
                    <FaImages className="me-1" />
                    <span>{el.images.length}</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary d-block mx-auto mt-2"
                onClick={() =>
                  CreateModal(
                    <>
                      <h4 className="text-center mb-3">Images</h4>
                    </>,
                    showAllImages(el),
                    true
                  )
                }
              >
                View All Images
              </button>
            </div>
          )}
        </div>

        <div className="post-actions">
          <button
            className="action-button comments-button"
            onClick={() => ShowComments(el.id)}
          >
            <FaRegCommentDots className="action-icon" />
            <span>{el.comments}</span>
          </button>

          <button
            className="action-button delete-button"
            onClick={() => DeletePost(el.id)}
            title="Bejegyzés törlése"
          >
            <FaTrash className="action-icon" />
            <span>Törlés</span>
          </button>
        </div>

        <div className="comments-container d-none" id={`comments-${el.id}`}>
          <CommunityPostComments data={el} />
        </div>
      </div>
    );
  };

  const LoadPosts = () => {
    setLoading(true);
    var token = Cookie.get("token");
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/community/load-posts/${i}`,
      type: "post",
      headers: {
        token: token,
      },
      data: {
        userid: userid,
      },
      success: function (resp) {
        if (i < posts.length) {
          setActivePosts(posts[i - 1]);
        } else {
          posts.push([]);
          if (typeof resp == "string") {
            resp = JSON.parse(resp);
          }
          resp.forEach((el) => {
            posts[posts.length - 1].push(
              new CommunityPost(
                el.id,
                el.name,
                el.userid,
                el.title,
                el.description,
                el.images,
                el.postedat,
                el.liked,
                el.likes,
                el.comments,
                el.avatar
              )
            );
          });
          setActivePosts(posts[i - 1]);
        }
        setLoading(false);
      },
      error: function () {
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    LoadPosts();
  }, [i]);

  return (
    <div className="admin-posts-container">
      <div className="container py-4">
        <h2 className="admin-section-title mb-4">
          <FaExclamationTriangle className="me-2" />
          Közösségi Bejegyzések Kezelése
        </h2>

        <div className="row">
          <div className="col-lg-8 col-md-10 mx-auto">
            {loading ? (
              <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Bejegyzések betöltése...</p>
              </div>
            ) : activeposts.length > 0 ? (
              <>
                {activeposts.map((post) => PostEntry(post))}

                <div className="pagination-controls">
                  <button
                    className="pagination-button prev-button"
                    onClick={() => setI(i - 1)}
                    disabled={i <= 1}
                  >
                    Előző
                  </button>
                  <span className="page-indicator">Oldal: {i}</span>
                  <button
                    className="pagination-button next-button"
                    onClick={() => setI(i + 1)}
                  >
                    Következő
                  </button>
                </div>
              </>
            ) : (
              <div className="no-posts-message">
                <p>Nincsenek megjeleníthető bejegyzések</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadCommunityPostsAdmin;
