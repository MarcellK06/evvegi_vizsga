import { useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $ from 'jquery';
import LikeCommunityPost from "./LikeCommunityPost";
import CommentCommunityPost from "./CommentCommunityPost";


function LoadCommunityPosts() {
    
    const [i, setI] = useState(1);
    var API = CONFIG.API;

    class CommunityPost {
       constructor(title, description, images) {
            this.title = title;
            this.description = description;
            this.images = images;
        }
    }

    var posts = [];
    var activeposts = [];
    const LoadImage = (url) => {
        return (<img src={url}/>);
    }

    const PostEntry = (el) => {
        return (<>
        <p>{el.title}</p>
        <p>{el.description}</p>
        {el.images.map((i) => LoadImage(i))}
        <LikeCommunityPost postid={el.id}/>
        <CommentCommunityPost postid={el.id}/>
        </>);
    }

    const LoadPosts = () => {
        $.ajax({
            url: `${API}/community/load-posts`,
            data: {
                page: i
            },
            success: function(resp) {
                if (i < posts.length)
                    activeposts = posts[i-1];
                else {
                    posts.push([]);
                    resp.posts.forEach((el) => {
                    posts[posts.length-1].push(new CommunityPost(el.title, el.description, el.images));
                });
                activeposts = posts[i-1];
            }
        }});
    }

    useEffect(() => {
        LoadPosts();
    }, [i]);


    return(<>
    <input type="button" value="Previous" onClick={(e) => {setI(i-1)}} disabled={i <= 1}/>
    <div>
        {activeposts.map((i) => PostEntry(i))}
    </div>
    <input type="button" value="Next" onClick={(e) => {setI(i+1)}}/>
    </>);

}

export default LoadCommunityPosts;