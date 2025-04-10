import { useContext, useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { CiClock2 } from "react-icons/ci";
import { FaRegCommentDots, FaTrash } from "react-icons/fa";
import { ModalContext } from "../../Providers/ModalProvider";
import Cookies from "js-cookie";

const LoadOwnPosts = function () {
  const [i, setI] = useState(1);
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

  const deletePost = (el) => {
    var postid = el.id;
    var userid = Cookies.get("userid");
    $.ajax({
      url: `${API}/community/posts/delete`,
      type: "POST",
      data: {
        userid: userid,
        postid: postid,
      },
      success: (resp) => {
        LoadPosts();
      },
    });
  };

  var posts = [];
  var [activeposts, setActivePosts] = useState([]);

  const loadImage = (idx, el) => {
    if (el.images[0] == "") return;
    var postid = el.id;
    return (
      <>
        <div className={`carousel-item ${idx == 0 ? "active" : ""}`}>
          <div className="d-flex p-3">
            <img
              src={`${API}/community/postimages/${postid}/${idx}`}
              className="img-fluid rounded mx-auto"
              style={{ maxHeight: "500px", objectFit: "contain" }}
            />
          </div>
        </div>
      </>
    );
  };

  const showAllImages = (el) => {
    return (
      <>
        <div
          id={`carousel-${el.id}`}
          className="carousel slide bg-light rounded-3 shadow"
        >
          <div className="carousel-inner">
            {el.images.map((i, idx) => loadImage(idx, el))}
          </div>
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
        </div>
      </>
    );
  };

  const PostEntry = (el) => {
    var avatar = el.avatar;
    var postedat = el.postedat;
    var postedat_text = "";
    var userid = el.userid;
    var psplit = postedat.split("-");
    var now = new Date();
    if (psplit[1][0] == "0") psplit[1] = psplit[1][1];
    var then = new Date(
      parseInt(psplit[0].split(" ")[0]),
      parseInt(psplit[1].split(" ")[0]),
      parseInt(psplit[2].split(" ")[0]),
      postedat.split(" ")[1].split(":"[0]),
      postedat.split(" ")[1].split(":"[1]),
      postedat.split(" ")[1].split(":"[2])
    );

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
    return (
      <>
        <div className="post-card bg-white rounded-3 shadow-sm p-4 mb-4">
          <div className="d-flex align-items-center mb-3">
            <div
              className="avatar rounded-circle me-3"
              style={{
                backgroundImage: `url(${API}/user/avatar/${userid})`,
                width: "48px",
                height: "48px",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="flex-grow-1">
              <p className="fw-bold mb-0">{el.username}</p>
              <div className="d-flex align-items-center text-muted small">
                <CiClock2 size={16} className="me-1" />
                <span>{postedat_text}</span>
              </div>
            </div>
          </div>

          <h5 className="fw-bold mb-2">{el.title}</h5>
          <p className="mb-3">{el.description}</p>

          {el.images[0] != "" && (
            <div className="mb-3">
              <img
                src={`${API}/community/postimages/${el.id}/0`}
                className="img-fluid rounded-3 w-100"
                style={{
                  maxHeight: "300px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() =>
                  CreateModal(
                    <>
                      <h4 className="text-center mb-3">Images</h4>
                    </>,
                    showAllImages(el),
                    true
                  )
                }
              />
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

          <hr className="my-3" />

          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center"></div>
            <div
              onClick={() => deletePost(el)}
              className="d-flex align-items-center text-muted"
              style={{ cursor: "pointer" }}
            >
              <FaTrash className="me-2" />
            </div>
          </div>
        </div>
      </>
    );
  };

  const LoadPosts = () => {
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
        profilepage: 1,
      },
      success: function (resp) {
        if (i < posts.length) setActivePosts((activeposts = posts[i - 1]));
        else {
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
      },
    });
  };

  useEffect(() => {
    LoadPosts();

    setInterval(() => {
      if (document.getElementById("postsloader") != null) {
        document.getElementById("postsloader").innerHTML =
          "Jelenleg nincs közösségi bejegyzésed..";
        document.getElementById("loaderspinner").classList = [];
      }
    }, 3000);
  }, []);

  return (
    <>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            {activeposts.length > 0 ? (
              activeposts.map((post) => PostEntry(post))
            ) : (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary"
                  id="loaderspinner"
                  role="status"
                >
                  <span className="visually-hidden">Betöltés...</span>
                </div>
                <p className="mt-3" id="postsloader">
                  Posztok betöltése...
                </p>
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-outline-primary px-4"
                onClick={(e) => {
                  setI(i - 1);
                }}
                disabled={i <= 1}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={(e) => {
                  setI(i + 1);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadOwnPosts;
