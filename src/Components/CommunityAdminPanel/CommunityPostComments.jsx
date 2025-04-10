import { useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $, { map } from "jquery";
import Cookie from "js-cookie";
import { FaTrash, FaClock, FaImage } from "react-icons/fa";
import Cookies from "js-cookie";

function CommunityPostCommentsAdmin(data) {
  var API = CONFIG.API;

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  var postid = data.data.id;
  var commentsCount = data.data.comments;

  const formatTimeAgo = (postedat) => {
    const psplit = postedat.split("-");
    const now = new Date();
    let postedat_text = "";

    if (psplit[1][0] == "0") psplit[1] = psplit[1][1];

    if (parseInt(psplit[2].split(" ")[0]) != now.getDate())
      postedat_text = `${now.getDate() - parseInt(psplit[2])} n`;
    if (parseInt(psplit[1]) != now.getMonth() + 1)
      postedat_text = `${now.getMonth() + 1 - parseInt(psplit[1])} h`;
    if (parseInt(psplit[0]) != now.getFullYear())
      postedat_text = `${now.getFullYear() - parseInt(psplit[0])} é`;
    let psplit2 = postedat.split(" ")[1].split(":");
    if (postedat_text == "") {
      if (parseInt(psplit2[2]) != now.getSeconds())
        postedat_text = `${now.getSeconds() - parseInt(psplit2[2])} mp`;
      if (parseInt(psplit[1]) != now.getMinutes())
        postedat_text = `${now.getMinutes() - parseInt(psplit[1])} p`;
      if (parseInt(psplit[0]) != now.getHours())
        postedat_text = `${now.getHours() - parseInt(psplit[0])} ó`;
    }

    return postedat_text;
  };

  const LoadComments = () => {
    setLoading(true);
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
        setLoading(false);
      },
      error: function () {
        setLoading(false);
      },
    });
  };

  const DeleteComment = (commentId) => {
    var userid = Cookies.get("userid");
    if (!window.confirm("Biztosan törölni szeretné ezt a bejegyzést?")) {
      return;
    }

    $.ajax({
      url: `${API}/community/admin/comments/delete`,
      type: "post",
      data: {
        userid: userid,
        postid: commentId,
      },
      success: (resp) => {
        window.location.reload();
      },
    });
  };

  const LoadImage = (url, index) => {
    return (
      <div className="comment-image-container" key={index}>
        <img
          src={url || "/placeholder.svg"}
          alt="Comment attachment"
          className="comment-image img-fluid rounded"
        />
      </div>
    );
  };

  const commentEntry = (comment) => {
    var commentText = comment.comment;
    var username = comment.username;
    var avatar = comment.avatar;
    var userid = comment.userid;
    var liked = comment.liked == 1;
    var postedat = comment.postedat;
    var postedat_text = formatTimeAgo(postedat);
    var images = comment.images.includes(",") ? comment.images.split(",") : [];

    return (
      <div className="comment-item" key={comment.id}>
        <div className="comment-content">
          <div className="comment-header">
            <div className="comment-user">
              <div
                className="comment-avatar"
                style={{
                  backgroundImage: `url(${API}/user/avatar/${userid})`,
                }}
              ></div>
              <div className="comment-user-info">
                <h6 className="comment-username">{username}</h6>
                <div className="comment-time">
                  <FaClock className="time-icon" />
                  <span>{postedat_text}</span>
                </div>
              </div>
            </div>

            <div className="comment-actions">
              <button
                className="delete-button"
                onClick={() => DeleteComment(comment.id)}
                title="Hozzászólás törlése"
              >
                <FaTrash />
              </button>
            </div>
          </div>

          <div className="comment-text">{commentText}</div>

          {images.length > 0 && (
            <div className="comment-images">
              {images.map((url, index) => LoadImage(url, index))}
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    ShowComments();
  }, []);

  const ShowComments = () => {
    LoadComments();
  };

  return (
    <div className="admin-comments-container" id={`comments-${postid}`}>
      {loading ? (
        <div className="comments-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Hozzászólások betöltése...</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="comments-list">
          {comments.map((comment) => commentEntry(comment))}
        </div>
      ) : (
        <div className="no-comments">
          <p>Nincsenek hozzászólások ehhez a bejegyzéshez.</p>
        </div>
      )}
    </div>
  );
}

export default CommunityPostCommentsAdmin;
