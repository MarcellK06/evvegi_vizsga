import { useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { CiClock2 } from "react-icons/ci";
function LoadOwnPosts() {
  var API = CONFIG.API;
  var posts = [];
  const [i, setI] = useState(1);
  const [activePosts, setActivePosts] = useState([]);

  class CommunityPost {
    constructor(
      id,
      username,
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
      this.title = title;
      this.description = description;
      this.postedat = postedat;
      this.liked = liked;
      this.likes = likes;
      this.comments = comments;
      this.avatar = avatar;
      if (images.includes(",")) this.images = images.split(",");
      else this.images = [];
    }
  }

  const Get = () => {
    const userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/community/load-posts/${i}`,
      type: "post",
      data: {
        userid: userid,
        profilepage: 1,
      },
      success: (resp) => {
        if (i < posts.length) setActivePosts((activePosts = posts[i - 1]));
        else {
          posts.push([]);
          resp.forEach((el) => {
            posts[posts.length - 1].push(
              new CommunityPost(
                el.id,
                el.name,
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

  const OwnPostEntry = (el) => {
    var avatar = el.avatar;
    var postedat = el.postedat;
    var postedat_text = "";
    var psplit = postedat.split("-");
    var now = new Date();
    if (psplit[1][0] == "0") psplit[1] = psplit[1][1];

    if (parseInt(psplit[2].split(" ")[0]) != now.getDate())
      postedat_text = `${now.getDate() - parseInt(psplit[2])} n`;
    if (parseInt(psplit[1]) != now.getMonth() + 1)
      postedat_text = `${now.getMonth() - parseInt(psplit[1])} h`;
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
        <div className="post w-100 my-4">
          <div className="row">
            <div className="col-sm-1">
              <div
                className="avatar"
                style={{ backgroundImage: `url(${avatar})` }}
              ></div>
            </div>
            <div className="col-sm-3" style={{ marginTop: "1.1%" }}>
              {el.username}
            </div>
            <div className="col-sm ">
              <div className="d-flex justify-content-end">
                <CiClock2 size={20} style={{ marginTop: "0.5%" }} />
                <div className="ms-2">{postedat_text}</div>
              </div>
            </div>
          </div>
          <div className="row">
            <p className="mt-3 mb-4 fw-bold">{el.title}</p>
          </div>
          <div className="row">
            <p>{el.description}</p>
          </div>
          <div className="row d-flex justify-content-end p-3 ">
            <div className="btn-close-red" onClick={() => DeletePost(el)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="red"
              >
                <path d="M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
        <hr />
      </>
    );
  };

  const DeletePost = (i) => {
    var userid = Cookie.get("userid");
    var postid = i.id;
    $.ajax({
      url: `${API}/community/posts/delete`,
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

  useEffect(() => {
    Get();
  }, []);
  const NoPosts = () => {
    return (
      <>
        <p className="fs-4 text-center">Nincs bejegyzésed!</p>
      </>
    );
  };
  return (
    <>
      <div className="container my-2">
        <div className="row">
          <div className="col-sm-6 mx-auto text-center">
            <p className="fs-3">Saját Bejegyzések</p>
            <p>Saját bejegyzéseidet itt találhatod!</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 mx-auto">
            {" "}
            {activePosts.length == 0 ? (
              <NoPosts />
            ) : (
              activePosts.map((i) => OwnPostEntry(i))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LoadOwnPosts;
