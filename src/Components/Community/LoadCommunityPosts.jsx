import { useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $ from 'jquery';
import LikeCommunityPost from "./LikeCommunityPost";
import CommentCommunityPost from "./CommentCommunityPost";
import Cookie from 'js-cookie';
import CommunityPostComments from "./CommunityPostComments";


function LoadCommunityPosts() {
    
    const [i, setI] = useState(1);
    var API = CONFIG.API;

    class CommunityPost {
       constructor(id, username, title, description, images, liked) {
            this.id = id;
            this.username = username;
            this.title = title;
            this.description = description;
            this.liked = liked;
            if (images.includes(","))
                this.images = images.split(',');
            else
                this.images = []
        }
    }

    var posts = [];
    var [activeposts, setActivePosts] = useState([]);
    const LoadImage = (url) => {
        return (<img src={url}/>);
    }

    const PostEntry = (el) => {
        return (<>
        <p>{el.username}</p>
        <p>{el.title}</p>
        <p>{el.description}</p>
        {el.images.map((i) => LoadImage(i))}
        <LikeCommunityPost data={el}/>
        <CommunityPostComments data={el.id}/>
        <CommentCommunityPost data={el.id}/>
        </>);
    }

    const LoadPosts = () => {
        var token = Cookie.get("token");
        var userid = Cookie.get("userid");
        $.ajax({
            url: `${API}/community/load-posts/${i}`,
            type: 'post',
            headers: {
                token: token
            },
            data: {
                userid: userid
            },
            success: function(resp) {
                if (i < posts.length)
                    setActivePosts(activeposts = posts[i-1]);
                else {
                    posts.push([]);
                    resp.forEach((el) => {
                    posts[posts.length-1].push(new CommunityPost(el.id, el.name, el.title, el.description, el.images, el.liked));
                });
                setActivePosts(posts[i-1]);
            }
        }});
    }

    useEffect(() => {
        LoadPosts();
    }, [i]);


    return(<>
    <input type="button" value="Previous" onClick={(e) => {setI(i-1)}} disabled={i <= 1}/>
    <div>
        {activeposts.map((i) => (PostEntry(i)))}
    </div>
    <input type="button" value="Next" onClick={(e) => {setI(i+1)}}/>
    </>);

}

export default LoadCommunityPosts;