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

Route::post("/appointments/get", ["date"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $date = $params["date"];

    $available_times = [];

    $times = DB::runSql("SELECT * FROM appointable_times");
    $taken_times = DB::runSql("SELECT * FROM appointable_times LEFT JOIN appointment ON appointable_times.id = appointment.timeid WHERE date = '$date'");
    for($k = 0; $k < count($times); $k++) {
        $times[$k]->date = $date;
    }

    http_response_code(200);
    echo DB::arrayToJson([$times, $taken_times]);
    });

Route::post("/appointments/create", ["userid", "carid", "complaint", "stepstorep", "date", "timeid"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $userid = intval($params["userid"]);
    $carid = intval($params["carid"]);
    $complaint = $params["complaint"];
    $stepstorep = $params["stepstorep"];
    $date = $params["date"];
    $timeid = intval($params["timeid"]);


    $id = DB::table("appointment")->insert([["date" => $date, "timeid" => $timeid, "complaint" => $complaint, "stepstorep" => $stepstorep]], true)->getLastInsertId();
    DB::table("user_car_appointment")->insert([["userid" => $userid, "carid" => $carid, "appointmentid" => $id]], true);

    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200,
        "Message" => "Success"
    ]);
});