import { useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import Cookie from 'js-cookie';
import $ from 'jquery';

function LikeCommunityPost(postid) {
    var API = CONFIG.API;

    const LikePost = () => {
        var userid = Cookie.get("userid");
        var el = document.getElementById(`like-${postid}`);
        $.ajax({
            url: `${API}/community/like`,
            data: {
                userid: userid,
                postid: postid
            },
            success: (resp) => {
                el.classList.add("liked");
            },
            error: (resp) => { // Adjon vissza errort, ha már likolt a post, és adatbázisból törölje a likeot.
                if (el.classList.contains("liked"))
                    el.classList.remove("liked");
            }
        });
    }

    return (<>
    <button value="LIKE" id={`like-${postid}`} onClick={LikePost}/>
    </>);

}

export default LikeCommunityPost;