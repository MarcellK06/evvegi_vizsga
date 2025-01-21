import { useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $, { map } from 'jquery';
import LikeCommunityPost from "./LikeCommunityPost";
import CommentCommunityPost from "./CommentCommunityPost";
import Cookie from 'js-cookie';
import { FaRegCommentDots } from "react-icons/fa";
function CommunityPostComments(data) {
    var API = CONFIG.API;

    const [comments, setComments] = useState([]);
    var postid = data.data.id;
    var commentsCount = data.data.comments;


    const LoadComments = () => {
        var token = Cookie.get("token");
        $.ajax({
            url: `${API}/community/comments/${postid}`,
            headers: {
                token: token
            },
            success: function(resp) {
                setComments(resp);
            }
        });

    }

    const LikeComment = (commentid) => {
        var userid = Cookie.get("userid");
        $.ajax({
            url: `${API}/community/comment/like/${commentid}`,
            type: "post",
            data: {
                userid: userid
            },
            success: (resp) => {

            }
        })
    }

    const LoadImage = (url) => {
        return (<img src={url}/>);
    }
    const commentEntry = (i) => {
        var comment = i.comment;
        var username = i.username;
        var liked = i.liked == 1;
        var images = i.images.includes(',') ? i.images.split(',') : [];
        return (<>
        <p>{username}: {comment}</p>
        <input type="button" value="LIKE COMMENT" onClick={() => LikeComment(i.id)} className={liked ? "liked" : ""} />
        {images.map((i) => LoadImage(i))}</>)
    }

    const ShowComments = () => {
        LoadComments();
    }

    useEffect(() => {
        ShowComments()
    }, []);

return (<>
<div className="d-none w-100" id={`comments-${postid}`}>
{comments.map((i) => commentEntry(i))}
</div>
</>)
}

export default CommunityPostComments;