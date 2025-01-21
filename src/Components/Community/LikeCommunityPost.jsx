import { useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import Cookie from 'js-cookie';
import $ from 'jquery';

function LikeCommunityPost(data) {
    var API = CONFIG.API;
    var postid = data.data.id;
    var liked = data.data.liked == 1;
    console.log(data);
    const LikePost = () => {
        var userid = Cookie.get("userid");
        var el = document.getElementById(`like-${postid}`);
        $.ajax({
            url: `${API}/community/like`,
            type: "post",
            data: {
                postid: postid,
                userid: userid
            },
            success: (resp) => {
                el.classList.add("liked");
            },
            error: (resp) => {
                el.classList.remove("liked");
            }
        });
    }

    return (<>
    <input type="button" value="LIKE" id={`like-${postid}`} className={liked ? "liked" : ""} onClick={LikePost}/>
    </>);

}

export default LikeCommunityPost;