import { useRef } from "react";
import CONFIG from "../../config.json";
import $ from 'jquery';
import Cookie from 'js-cookie';

function CommentCommunityPost(data) {
    var API = CONFIG.API;
    const commentRef = useRef();
    const imagesRef = useRef();

    const SendComment = () => {
        var comment = commentRef.current.value;
        var images = imagesRef.current.value;
        var userid = Cookie.get("userid");
        var postid = data.data;
        $.ajax({
            url: `${API}/community/comment`,
            type: 'post',
            data: {
                postid: postid,
                userid: userid,
                comment: comment
            },
            success: function(resp) {
                // TODO
            }
        })
    }

    return (<>
    <input type="text" name="comment" id="comment" ref={commentRef} />
    <input type="file" name="images" id="images" ref={imagesRef} />
    <input type="button" value="Comment" onClick={SendComment} />
    </>);

}

export default CommentCommunityPost;