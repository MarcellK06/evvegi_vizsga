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

Route::post("/requests/all", ["userid"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $userid = intval($params['userid']);

    $allowed = DB::runSql("SELECT COUNT(*) AS 'allowed' FROM user_rank WHERE userid=$userid AND rankid=1");
    if ($allowed[0] == 0)
    {
        http_response_code(405);
        echo DB::arrayToJson([
            "status" => 405,
            "Message" => "NOT ALLOWED"
        ]);
    }

    $res = DB::runSql("SELECT requests.id, `title`, `description`, `data`, `replied`, `vin`, `email` FROM requests LEFT JOIN car ON requests.carid = car.id ORDER BY requests.id DESC");
    http_response_code(200);
    echo DB::arrayToJson($res);
});

Route::post("/requests/load", ["userid"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    
    $userid = intval($params["userid"]);
    $res = DB::runSql("SELECT requests.id, `title`, `description`, `data`, `date`, `replied`, `vin`, `response` FROM requests LEFT JOIN car ON requests.carid = car.id LEFT JOIN user_car ON user_car.carid = car.id LEFT JOIN request_replies ON request_replies.requestid = requests.id WHERE user_car.userid=$userid");
    http_response_code(200);
    echo DB::arrayToJson($res);
});

Route::post("/requests/answer", ["userid", "requestid", "response"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $userid = intval($params["userid"]);
    $requestid = intval($params["requestid"]);
    $response = $params["response"];

    $allowed = DB::runSql("SELECT COUNT(*) AS 'allowed' FROM user_rank WHERE userid=$userid AND rankid=1");
    if ($allowed[0] == 0)
    {
        http_response_code(405);
        echo DB::arrayToJson([
            "status" => 405,
            "Message" => "NOT ALLOWED"
        ]);
    }

    DB::runSql("INSERT INTO request_replies(requestid, response) VALUES($requestid, '$response');");
    DB::runSql("UPDATE requests SET replied=1 WHERE id=$requestid");

    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200,
        "Message" => "Success"
    ]);
});

Route::post("/requests/send", ["title", "description", "carid", "userid"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $userid = intval($params['userid']);
    $carid = intval($params['carid']);
    $title = $params['title'];
    $description = $params['description'];
    DB::runSql("INSERT INTO requests(`userid`, `carid`, `title`, `description`, `date`, `replied`) VALUES($userid, $carid, '$title', '$description', NOW(), 0);");
    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200,
        "Message" => "Success"
    ]);
});
Route::post("/requests/send/anon", ["title", "description", "email"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $email = $params['email'];
    $title = $params['title'];
    $description = $params['description'];
    DB::table("requests")->insert([["title" => $title, "description" => $description, "email" => $email, "date" => date("Y-m-d H:i:s"), "replied" => 0]], true);
    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200,
        "Message" => "Success"
    ]);
});