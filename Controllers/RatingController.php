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

Route::get("/ratings/get", [], function($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $avg = DB::runSql("SELECT AVG(count) as 'avg' FROM ratings ;")[0];
    $all = DB::runSql("SELECT COUNT(id) as 'all_ratings' FROM ratings ;")[0];
    $ratings = DB::runSql("SELECT user.name, user.avatar, ratings.count, ratings.comment FROM ratings INNER JOIN user on user.id = ratings.userid ORDER BY ratings.id desc");
    $sp = DB::runSql("SELECT `count` as 'star', count(id) as 'amount'  FROM `ratings` GROUP BY `count`");

    echo DB::arrayToJson(["ratings" => $ratings, "avg" => $avg->avg, "all_ratings" => $all->all_ratings, "countperstars" => $sp]);
});
Route::post("/ratings/new", ["userid", "stars", "comment"], function($params){
    $id = $params["userid"];
    $stars = $params["stars"];
    $comment = $params["comment"];
    $user =  DB::runSql("select * from user where id = $id")[0];
    if($user->verified == 0 )return;
    DB::runSql("insert into ratings (userid, count, comment) values ('$id', '$stars', '$comment')");
    return DB::arrayToJson(["success" => true]);

   



});

