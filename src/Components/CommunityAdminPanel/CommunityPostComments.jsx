import { useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $, { map } from "jquery";
import Cookie from "js-cookie";
import { FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";
function CommunityPostCommentsAdmin(data) {
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

  const DeleteComment = (postid) => {
    var userid = Cookies.get("userid");
    $.ajax({
      url: `${API}/community/admin/comments/delete`,
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

  const LoadImage = (url) => {
    return <img src={url} />;
  };
  const commentEntry = (i) => {
    var comment = i.comment;
    var username = i.username;
    var avatar = i.avatar;
    var userid = i.userid;
    var liked = i.liked == 1;
    var postedat = i.postedat;
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
    var images = i.images.includes(",") ? i.images.split(",") : [];
    return (
      <>
        <div className="d-flex p-3 comment">
          <div className="container">
            <div className="row">
              <div className="col-1 d-flex p-0">
                <div
                  className="comment-avatar p-0"
                  style={{
                    backgroundImage: `url(${API}/user/avatar/${userid})`,
                  }}
                ></div>
              </div>
              <div className="col-10">
                <div className="row mb-0">
                  <p className="fs-7 mb-0">{username}</p>
                </div>
                <div className="row mb-0">
                  <p className="fs-9 mb-0">{comment}</p>
                </div>
              </div>
              <div className="col-1 ms-auto d-flex flex-column p-0">
                <div className="row d-flex ms-auto justify-content-end">
                  <p className="fs-9 ms-auto">{postedat_text}</p>
                </div>
                <div className="row d-flex justify-content-end ms-auto p-0">
                  <div
                    className="d-flex align-items-center mx-auto pointer"
                    id={`comment-${i.id}`}
                    onClick={() => DeleteComment(i.id)}
                  >
                    <FaTrash size={20} />
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

export default CommunityPostCommentsAdmin;
