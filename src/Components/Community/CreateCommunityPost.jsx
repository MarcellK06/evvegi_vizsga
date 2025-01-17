import { useRef } from "react";
import CONFIG from "../../config.json";
import $ from 'jquery';
import Cookie from 'js-cookie';


function CreateCommunityPost() {
    var API = CONFIG.API;

    const titleRef = useRef();
    const descriptionRef = useRef();
    const imagesRef = useRef();

    const CreatePost = () => {
        var title = titleRef.current.value;
        var description = descriptionRef.current.value;
        var images = imagesRef.current.value;
        var userid = Cookie.get("userid");
        $.ajax({
            url: `${API}/community/create-post`,
            data: {
                userid: userid,
                title: title,
                description: description,
                images: images
            },
            success: function(resp) {
                // TODO
            }
        });
    }

    return(<>
    <input type="text" name="title" id="title" ref={titleRef} required />
    <input type="text" name="description" id="description" ref={descriptionRef} required />
    <input type="file" name="images" id="images" ref={imagesRef} required />
    <input type="button" value="POST" onClick={CreatePost} />
    </>);

}

export default CreateCommunityPost;