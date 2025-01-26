import { useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $, { map } from "jquery";
import LikeCommunityPost from "./LikeCommunityPost";
import CommentCommunityPost from "./CommentCommunityPost";
import Cookie from "js-cookie";
import { FaRegCommentDots } from "react-icons/fa";
function CommunityPostComments(data) {
  var API = CONFIG.API;

  const [comments, setComments] = useState([]);
  var postid = data.data.id;
  var commentsCount = data.data.comments;

  const LoadComments = () => {
    var token = Cookie.get("token");
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/community/comments`,
      type: "post",
      headers: {
        token: token,
      },
      data: {
        postid: postid,
        userid: userid,
      },
      success: function (resp) {
        setComments(resp);
      },
    });
  };

  const LikeComment = (commentid) => {
    var userid = Cookie.get("userid");
    var el = document.getElementById(`comment-${commentid}`);
    $.ajax({
      url: `${API}/community/comment/like/${commentid}`,
      type: "post",
      data: {
        userid: userid,
      },
      success: (resp) => {
        el.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-heart-fill liked" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />';
      },
      error: (resp) => {
        el.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16"><path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" /></svg>';
      },
    });
  };

  const LoadImage = (url) => {
    return <img src={url} />;
  };
  const commentEntry = (i) => {
    var comment = i.comment;
    var username = i.username;
    var avatar = i.avatar;
    var liked = i.liked == 1;
    var postedat = i.postedat;
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
    var images = i.images.includes(",") ? i.images.split(",") : [];
    return (
      <>
        <div className="d-flex p-3 comment">
          <div className="container">
            <div className="row">
              <div className="col-1 d-flex p-0">
                <div
                  className="comment-avatar p-0"
                  style={{ backgroundImage: `url(${avatar})` }}
                ></div>
              </div>
              <div className="col-10">
                <div className="row">
                  <p className="fs-7">{username}</p>
                </div>
                <div className="row">
                  <p className="fs-9">{comment}</p>
                </div>
              </div>
              <div className="col-1 ms-auto d-flex flex-column p-0">
                <div className="row d-flex ms-auto justify-content-end">
                  <p className="fs-9 ms-auto">{postedat_text}</p>
                </div>
                <div className="row d-flex justify-content-end ms-auto p-0">
                  <div
                    className="d-flex align-items-center mx-auto"
                    id={`comment-${i.id}`}
                    onClick={() => LikeComment(i.id)}
                  >
                    {liked ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-heart-fill liked"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          className=""
                          d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-heart"
                        viewBox="0 0 16 16"
                      >
                        <path
                          className=""
                          d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {images.map((i) => LoadImage(i))}
      </>
    );
  };

  const ShowComments = () => {
    LoadComments();
  };

  useEffect(() => {
    ShowComments();
  }, []);

  return (
    <>
      <div className="d-none w-100" id={`comments-${postid}`}>
        {comments.map((i) => commentEntry(i))}
      </div>
    </>
  );
}

export default CommunityPostComments;
