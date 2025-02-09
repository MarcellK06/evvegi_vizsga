<?php
require_once "application/route/Route.php";
require_once "application/assets/Mysql/DB.php";
require_once "application/assets/Header/HttpHeadersManager.php";
require_once "application/assets/Header/HttpHeadersInterface.php";
require_once "APIAuth/Authentication.php";
require_once "application/Mailer/Mailer.php";

use Application\Route\Route;
use Application\Database\DB;
use Application\Assets\Header\HttpHeadersInterface\HttpHeadersInterface;
use Application\Assets\Header\HttpHeadersManager\HttpHeadersManager;
use Application\Mail\Mailer;

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

    $res = DB::runSql("SELECT requests.id, `title`, `description`, `data`, `replied`, `vin`, `email` FROM requests LEFT JOIN car ON requests.carid = car.id ORDER BY requests.replied ASC");
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
    $email = DB::runSql("SELECT email FROM requests WHERE requests.id = $requestid")[0]->email;
    if ($email == "USER")
        $email = DB::runSql("SELECT user.email as `email` FROM user LEFT JOIN requests ON requests.userid = user.id WHERE requests.id = $requestid")[0]->email;
    $data = DB::runSql("SELECT title, description FROM requests WHERE id = $requestid");
    $title = $data[0]->title;
    $description = $data[0]->description;
    Mailer::Send($email, "SzalkaCar Árajánlat Válasz Érkezett", Mailer::MailTamplate("Árajánlat Válasz Levél", "<div><h2>Cím</h2><h4>$title</h4><h2>Leírás</h2><h4>$description</h4><h2>Technikus által adott válasz</h2><h4>$response</h4></div>"));


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