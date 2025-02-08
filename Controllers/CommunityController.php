<?php
require_once "application/route/Route.php";
require_once "application/assets/Mysql/DB.php";
require_once "application/assets/Header/HttpHeadersManager.php";
require_once "application/assets/Header/HttpHeadersInterface.php";
require_once "APIAuth/Authentication.php";

use Application\Route\Route;
use Application\Database\DB;
use Application\Assets\Header\HttpHeadersInterface\HttpHeadersInterface;
use Application\Assets\Header\HttpHeadersManager\HttpHeadersManager;


Route::post("/community/load-posts/{page}", [], function ($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    try{
        $userid = intval($params['userid']);
        $profilepage = intval($params['profilepage']);
        $page = intval($params["page"]);
        $limit = 15;
        $offset = 0;
        if ($profilepage == 1)
        $posts = DB::runSql('SELECT community_posts.id AS "id", user.id as "userid", community_posts.title AS "title", community_posts.description AS "description", community_posts.images, community_posts.posted_at AS "postedat", COUNT(DISTINCT community_post_likes.id) AS "likes", (SELECT COUNT(*) FROM community_post_likes WHERE userid='.$userid.' AND postid=community_posts.id) AS "liked", COUNT(DISTINCT community_posts_comments.id) AS "comments", community_posts.images, user.name AS "name", user.avatar AS "avatar" FROM community_posts LEFT JOIN community_post_likes ON community_posts.id = community_post_likes.postid LEFT JOIN community_posts_comments ON community_posts.id = community_posts_comments.postid LEFT JOIN user ON community_posts.userid = user.id WHERE community_posts.userid = '.$userid.' GROUP BY community_posts.id, community_posts.title, community_posts.description, community_posts.images ORDER BY id desc;');
        else
        $posts = DB::runSql('SELECT community_posts.id AS "id", user.id as "userid", community_posts.title AS "title", community_posts.description AS "description", community_posts.images, community_posts.posted_at AS "postedat", COUNT(DISTINCT community_post_likes.id) AS "likes", (SELECT COUNT(*) FROM community_post_likes WHERE userid='.$userid.' AND postid=community_posts.id) AS "liked", COUNT(DISTINCT community_posts_comments.id) AS "comments", community_posts.images, user.name AS "name", user.avatar AS "avatar" FROM community_posts LEFT JOIN community_post_likes ON community_posts.id = community_post_likes.postid LEFT JOIN community_posts_comments ON community_posts.id = community_posts_comments.postid LEFT JOIN user ON community_posts.userid = user.id GROUP BY community_posts.id, community_posts.title, community_posts.description, community_posts.images ORDER BY id desc;');
        echo DB::arrayToJson($posts);
    }catch(\Exception $e){
        http_response_code(500);
        echo DB::arrayToJson([
            "status" => 500,
            "Message" => $e->getMessage()
        ]);
    }
  
});

Route::post("/community/comments", ['postid', 'userid'], function ($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    
    try{
        $postid = intval($params["postid"]);
        $userid = intval($params['userid']);
        $comments = DB::runSql('SELECT community_posts_comments.id as "id", user.id AS "userid", community_posts_comments.comment as "comment", community_posts_comments.images as "images", community_posts_comments.posted_at as "postedat", user.name AS "username", user.avatar as "avatar", (SELECT COUNT(*) FROM community_comments_likes WHERE userid='.$userid.' AND commentid=community_posts_comments.id) AS "liked" FROM community_posts_comments INNER JOIN community_posts ON community_posts_comments.postid = community_posts.id INNER JOIN user ON community_posts_comments.userid = user.id WHERE community_posts_comments.postid ='.$postid.' GROUP BY community_posts_comments.id ORDER BY id DESC');
        echo DB::arrayToJson($comments);
    }catch(\Exception $e){
        http_response_code(500);
        echo DB::arrayToJson([
            "status" => 500,
            "Message" => $e->getMessage()
        ]);
    }
});

Route::post("/community/create-post", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $userid = $params['userid'];
    $title = $params['title'];
    $description = $params['description'];
    $filenames = [];
    if (count($_FILES) > 0)
    {
        for($k = 0; $k < count($_FILES); $k++) {
            $image = $_FILES["images-$k"];
            $randomnumber = rand(1, 999999999);
            $saveto = "./postimages/$randomnumber.jpg";
            move_uploaded_file($image["tmp_name"], $saveto);
            $filenames[] = substr($saveto, 2, strlen($saveto)-1);
        }
        $filename = implode(',', $filenames);
        DB::runSql("INSERT INTO community_posts(userid, title, description, images, posted_at) VALUES('".$userid."','".$title."','".$description."', '$filename', NOW())");
    } else {
        DB::runSql("INSERT INTO community_posts(userid, title, description, images, posted_at) VALUES('".$userid."','".$title."','".$description."', '', NOW())");
    }
    try {
    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200
    ]);
    } catch(\Exception $e) {
        http_response_code(406);
        echo DB::arrayToJson([
            "status" => 406,
            "Message" => $e->getMessage()
        ]);
    }
});

Route::post("/community/like", ["postid", "userid"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
     
    $postid = $params["postid"];
    $userid = $params["userid"];


    $q = DB::runSql("SELECT COUNT(*) AS 'liked' FROM community_post_likes WHERE postid=".$postid." AND userid=".$userid."");
    
    if ($q[0]->liked == 0){
        DB::runSql("INSERT INTO community_post_likes(postid, userid) VALUES(".$postid.", ".$userid.")");
        http_response_code(200);
        echo DB::arrayToJson([
            "status" => 200
        ]);
    } else {
        DB::runSql("DELETE FROM  community_post_likes WHERE postid=".$postid." AND userid=".$userid."");
        http_response_code(418);
        echo DB::arrayToJson([
            "status" => 418
        ]);
    }
});

Route::post("/community/comment", ["postid", "userid", "comment"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $postid = $params["postid"];
    $userid = $params["userid"];
    $comment = $params["comment"];
    $images = $params["images"];
    DB::runSql("INSERT INTO community_posts_comments(postid, userid, comment, images, posted_at) VALUES('".$postid."','".$userid."','".$comment."','".$images."', NOW())");
    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200
    ]);
});

Route::post("/community/posts/delete", ["userid", "postid"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $userid = $params["userid"];
    $postid = $params["postid"];

    $allowed = DB::runSql("SELECT COUNT(*) AS 'allowed' FROM community_posts WHERE id = $postid AND userid = $userid");
    if ($allowed[0] == 0) {
        http_response_code(405);
        echo DB::arrayToJson([
            "status" => 405,
            "Message" => "NOT ALLOWED"
        ]);
        return;
    }

    DB::runSql("DELETE FROM community_post_likes WHERE postid = $postid;");
    DB::runSql("DELETE community_comments_likes FROM community_comments_likes JOIN community_posts_comments ON community_comments_likes.commentid = community_posts_comments.id WHERE community_posts_comments.postid = $postid;");
    DB::runSql("DELETE FROM community_posts_comments WHERE postid = $postid;");
    DB::runSql("DELETE FROM community_posts WHERE id = $postid");
    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200,
        "Message" => "Success"
    ]);
});


Route::post("/community/comment/like/{commentid}", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
     
    $commentid = $params["commentid"];
    $userid = $params["userid"];


    $q = DB::runSql("SELECT COUNT(*) AS 'liked' FROM community_comments_likes WHERE commentid=".$commentid." AND userid=".$userid."");
    
    if ($q[0]->liked == 0){
        DB::runSql("INSERT INTO community_comments_likes(userid, commentid) VALUES(".$userid.", ".$commentid.")");
        
        echo DB::arrayToJson([
            "status" => 200
        ]);
    } else {
        DB::runSql("DELETE FROM  community_comments_likes WHERE commentid=".$commentid." AND userid=".$userid."");
        http_response_code(418);
        echo DB::arrayToJson([
            "status" => 418
        ]);
    }
});

Route::get("/community/postimages/{postid}/{index}", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');


    $postid = intval($params["postid"]);
    $index = intval($params["index"]);

    $res = DB::runSql("SELECT images FROM community_posts WHERE id=$postid")[0]->images;
    $res = explode(',', $res);
    $filename = $res[$index];
    $file = fopen($filename, 'rb');
    header("Content-Type: image/png");
    header("Content-Length: " . filesize($filename));
    fpassthru($file);
});