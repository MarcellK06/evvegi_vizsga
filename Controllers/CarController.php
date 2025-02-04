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

Route::get("/car/load/all/{userid}", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $userid = $params["userid"];
    $car = DB::runSql("SELECT car.id, car.vin, car.data, car.status, car.images FROM user_car INNER JOIN car ON user_car.carid = car.id INNER JOIN user ON user_car.userid = user.id WHERE userid = $userid");

    echo DB::arrayToJson($car);
    http_response_code(200);
});

Route::post("/car/delete", ["userid", "carid"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $userid = $params["userid"];
    $carid = $params["carid"];
    DB::runSql("DELETE FROM user_car WHERE userid = $userid AND carid = $carid;");
    DB::runSql("DELETE FROM car WHERE id = $carid;");
    http_response_code(200);
});
Route::post("/car/add", ["userid", "brand", "model", "year", "licenseplate", "vin", "registration"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $userid = $params["userid"];
    $brand = $params["brand"];
    $model = $params["model"];
    $year = $params["year"];
    $licenseplate = $params["licenseplate"];
    $vin = $params["vin"];
    $registration = $params["registration"];
    $km = 0;
    $engineCode = "";
    $json = array(
        "brand" => $brand,
        "model" => $model,
        "engineCode" => $engineCode,
        "km" => $km,
        "licensePlate" => $licenseplate,
        "year" => $year
    );
    $json = json_encode($json);
    $carid = DB::table("car")->insert([["vin" => $vin, "data" => $json]], true)->GetLastInsertId();
    DB::table("user_car")->insert([["userid" => $userid, "carid" => $carid]]);
    http_response_code(200);

    echo DB::arrayToJson(["status" => 200, "Message" => "SUCCESS"]);
});

Route::post("/car/change/status", ["carid", "status"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $status = $params["status"];
    DB::runSql("UPDATE car SET status='$status' WHERE id=$carid");
});