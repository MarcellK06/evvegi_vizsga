import { useRef } from "react";
import CONFIG from "../../config.json";
import $ from 'jquery';
import Cookie from 'js-cookie';

function CommentCommunityPost(postid) {
    var API = CONFIG.API;
    const descriptionRef = useRef();
    const imagesRef = useRef();

    const SendComment = () => {
        var description = descriptionRef.current.value;
        var images = imagesRef.current.value;
        var userid = Cookie.get("userid");
        $.ajax({
            url: `${API}/community/comment`,
            data: {
                postid: postid,
                userid: userid,
                description: description,
                images: images
            },
            success: function(resp) {
                // TODO
            }
        })
    }

    return (<>
    <input type="text" name="description" id="description" />
    <input type="file" name="images" id="images" />
    <input type="button" value="Comment" onClick={SendComment} />
    </>);

}

export default CommentCommunityPost;