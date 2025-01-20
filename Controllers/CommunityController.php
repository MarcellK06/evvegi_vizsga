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


Route::get("/Community/getPosts/{page}", [], function ($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    //tesztelt
    try{
        $page = intval($params["page"]);
        $limit = 15;
        $offset = ($page - 1) * $limit;
        $posts = DB::runSql('SELECT community_posts.id, community_posts.title, community_posts.description, community_posts.images, COUNT(community_post_likes.id) as "likes", COUNT(community_posts_comments.id) as "comments" FROM `community_posts` INNER JOIN community_post_likes ON community_posts.id = community_post_likes.postid INNER JOIN community_posts_comments ON community_posts.id = community_posts_comments.postid LIMIT '.$limit.' OFFSET '.$offset.'');
        echo DB::arrayToJson($posts);
    }catch(\Exception $e){
        http_response_code(500);
        echo DB::arrayToJson([
            "status" => 500,
            "Message" => $e->getMessage()
        ]);
    }

   
  
});
