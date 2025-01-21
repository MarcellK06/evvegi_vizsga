import { useEffect, useRef, useState } from "react";
import CONFIG from "../../config.json";
import $ from 'jquery';
import LikeCommunityPost from "./LikeCommunityPost";
import CommentCommunityPost from "./CommentCommunityPost";
import Cookie from 'js-cookie';
import CommunityPostComments from "./CommunityPostComments";
import { CiClock2 } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa";
function LoadCommunityPosts() {

    const [i, setI] = useState(1);
    var API = CONFIG.API;

    class CommunityPost {
        constructor(id, username, title, description, images, liked, likes, comments) {
            this.id = id;
            this.username = username;
            this.title = title;
            this.description = description;
            this.liked = liked;
            this.likes = likes;
            this.comments = comments
            if (images.includes(","))
                this.images = images.split(',');
            else
                this.images = []
        }
    }

    var posts = [];
    var [activeposts, setActivePosts] = useState([]);
    const LoadImage = (url) => {
        return (<img src={url} />);
    }
    const ShowComments = (id) => {
        console.log(id);
        var el = document.getElementById(`comments-${id}`);
        if (el.classList.contains("d-block")) {
            el.classList.remove("d-block");
            el.classList.add("d-none");
        }
        else {
            el.classList.add("d-block");
            el.classList.remove("d-none");
        }
    }

    const PostEntry = (el) => {
        return (<>


            <div className="post w-100 my-4">
                <div className="row">
                    <div className="col-sm-1">
                        <div className="avatar"></div>
                    </div>
                    <div className="col-sm-3" style={{ marginTop: "1.1%" }}>
                        {el.username}
                    </div>
                    <div className="col-sm ">
                        <div className="d-flex justify-content-end">
                            <CiClock2 size={20} style={{ marginTop: '0.5%' }} />
                            <div className="ms-2">3 órája</div>
                        </div>

                    </div>

                </div>
                <p className="mt-3 mb-4 fw-bold">{el.title}</p>
                <p>{el.description}</p>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
                <div className="d-flex"> 
                    <LikeCommunityPost data={el} />
                    <div className="ms-2">{el.likes}</div>
                    
                </div>
                <div onClick={() => ShowComments(el.id)} className="d-flex" ><FaRegCommentDots />
                                <div className="ms-2">{el.comments}</div></div>
            </div>
            <div className="container" id={`commentbox-${el.id}`}>
                
                <CommunityPostComments data={el} />
                <CommentCommunityPost data={el.id}/>
            </div>

           

            {/*      <p></p>
            <p>{el.description}</p>
            {el.images.map((i) => LoadImage(i))}
           
          
            <CommentCommunityPost data={el.id} />*/}


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
            success: function (resp) {
                if (i < posts.length)
                    setActivePosts(activeposts = posts[i - 1]);
                else {
                    posts.push([]);
                    resp.forEach((el) => {
                        posts[posts.length - 1].push(new CommunityPost(el.id, el.name, el.title, el.description, el.images, el.liked, el.likes, el.comments));
                    });
                    setActivePosts(posts[i - 1]);
                }
            }
        });
    }

    useEffect(() => {
        LoadPosts();
    }, [i]);


    return (<>
        <div className="container">
            <div className="row">
                <div className="col-sm-6 mx-auto"> {activeposts.map((i) => (PostEntry(i)))}</div>
            </div>

        </div>


        {  /*    <input type="button" value="Previous" onClick={(e) => {setI(i-1)}} disabled={i <= 1}/>
    <div>
        
    </div>
    
    <input type="button" value="Next" onClick={(e) => {setI(i+1)}}/>*/}

    </>);

}

export default LoadCommunityPosts;