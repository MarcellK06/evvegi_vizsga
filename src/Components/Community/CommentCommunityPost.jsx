import { useRef } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { FaFile } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

function CommentCommunityPost(data) {
  var API = CONFIG.API;
  const commentRef = useRef();
  const imagesRef = useRef();

  const SendComment = () => {
    var comment = commentRef.current.value;
    if (comment == "") return;
    var userid = Cookie.get("userid");
    var postid = data.data;
    $.ajax({
      url: `${API}/community/comment`,
      type: "post",
      data: {
        postid: postid,
        userid: userid,
        comment: comment,
      },
      success: function (resp) {
        window.location.reload();
      },
    });
  };

  return (
    <div className="container d-flex my-1">
      <div className="container w-80">
        <input
          type="text"
          name="comment"
          id="comment"
          className="rounded border-0 commentext w-100 p-1"
          ref={commentRef}
        />
      </div>
      <div className="container w-10">
        <FaFile className="comment-svgs hoverbutton" size={30} />
      </div>
      <div className="container w-10">
        <IoMdSend
          onClick={SendComment}
          size={30}
          className="comment-svgs hoverbutton"
        />
      </div>
    </div>
  );
}

export default CommentCommunityPost;
