import { useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import LikeCommunityPost from "./LikeCommunityPost";
import CommentCommunityPost from "./CommentCommunityPost";
import Cookie from "js-cookie";
import CommunityPostComments from "./CommunityPostComments";
import { CiClock2 } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa";
function LoadCommunityPosts() {
  const [i, setI] = useState(1);
  var API = CONFIG.API;

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

  var posts = [];
  var [activeposts, setActivePosts] = useState([]);
  const LoadImage = (url) => {
    return <img src={url} />;
  };
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

  const PostEntry = (el) => {
    var avatar = el.avatar;
    var postedat = el.postedat;
    var postedat_text = "";
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
          <p className="mt-3 mb-4 fw-bold">{el.title}</p>
          <p>{el.description}</p>
        </div>
        <hr />
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <LikeCommunityPost data={el} />
          </div>
          <div onClick={() => ShowComments(el.id)} className="d-flex pointer">
            <FaRegCommentDots />
            <div className="ms-2 noselect">{el.comments}</div>
          </div>
        </div>
        <div className="container" id={`commentbox-${el.id}`}>
          <CommunityPostComments data={el} />
          <CommentCommunityPost data={el.id} />
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
      },
      success: function (resp) {
        if (i < posts.length) setActivePosts((activeposts = posts[i - 1]));
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

  useEffect(() => {
    LoadPosts();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-6 mx-auto">
            {" "}
            {activeposts.map((i) => PostEntry(i))}
          </div>
        </div>
      </div>

      {/*    <input type="button" value="Previous" onClick={(e) => {setI(i-1)}} disabled={i <= 1}/>
    <div>
        
    </div>
    
    <input type="button" value="Next" onClick={(e) => {setI(i+1)}}/>*/}
    </>
  );
}

export default LoadCommunityPosts;
