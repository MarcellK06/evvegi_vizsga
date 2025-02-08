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
    $car = DB::runSql("SELECT car.id, car.vin, car.data, car.status, car.images, car.nickname, car.approved FROM user_car INNER JOIN car ON user_car.carid = car.id INNER JOIN user ON user_car.userid = user.id WHERE userid = $userid");

    echo DB::arrayToJson($car);
    http_response_code(200);
});

Route::post("/car/delete", ["userid", "carid"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $userid = $params["userid"];
    $carid = $params["carid"];
    DB::runSql("DELETE FROM car WHERE id = $carid;");
    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200,
        "Message" => "SUCCESS"
    ]);
});
Route::post("/car/add", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $userid = $params["userid"];
    $nickname = $params["nickname"];
    $brand = $params["brand"];
    $model = $params["model"];
    $year = $params["year"];
    $licenseplate = $params["licenseplate"];
    $vin = $params["vin"];
    $file_1 = $_FILES["registration_file_1"];
    $file_2 = $_FILES["registration_file_2"];
    $file_3 = $_FILES["registration_file_3"];
    $filename1 = rand(1, 999999999);
    $filename1 = substr($filename1, 0, 16);
    $filename1 = "images/$filename1.jpg";
    $filename2 = rand(1, 999999999);
    $filename2 = substr($filename2, 0, 16);
    $filename2 = "images/$filename2.jpg";
    $filename3 = rand(1, 999999999);
    $filename3 = substr($filename3, 0, 16);
    $filename3 = "images/$filename3.jpg";
    var_dump($_FILES);
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
    if (move_uploaded_file($file_1['tmp_name'], $filename1) && move_uploaded_file($file_2['tmp_name'], $filename2) && move_uploaded_file($file_3['tmp_name'], $filename3)) {
    $filenames = $filename1.",".$filename2.",".$filename3;
    $carid = DB::table("car")->insert([["vin" => $vin, "data" => $json, "images" => $filenames, "nickname" => $nickname]], true)->GetLastInsertId();
    DB::table("user_car")->insert([["userid" => $userid, "carid" => $carid]]);
    http_response_code(200);

    echo DB::arrayToJson(["status" => 200, "Message" => "SUCCESS"]);
} else {
    http_response_code(406);
    echo DB::arrayToJson(["status" => 406, "Message" => "ERROR"]);
}
});

Route::post("/car/change/status", ["carid", "status"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $status = $params["status"];
    DB::runSql("UPDATE car SET status='$status' WHERE id=$carid");

});


Route::get("/car/images/{carid}/{imageid}", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $carid = intval($params["carid"]);
    $imageid = intval($params["imageid"]);

    $res = DB::runSql("SELECT images FROM car WHERE id=$carid")[0]->images;
    $res = explode(',', $res);
    $filename = $res[$imageid];
    $file = fopen($filename, 'rb');
    header("Content-Type: image/png");
    header("Content-Length: " . filesize($filename));
    fpassthru($file);
});


Route::post("/cars/admin/get", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $userid = $params["userid"];

    
    $allowed = DB::runSql("SELECT COUNT(*) AS 'allowed' FROM user_rank WHERE userid=$userid AND rankid=1");
    if ($allowed[0] == 0) {
        http_response_code(405);
        echo DB::arrayToJson([
            "status" => 405,
            "Message" => "NOT ALLOWED"
        ]);
        return;
    };

    $cars = DB::runSql("SELECT car.id, car.vin, car.data, car.status, car.images, car.nickname, car.approved FROM car WHERE approved = 0;");

    echo DB::arrayToJson($cars);
    http_response_code(200);
});

Route::post("/cars/admin/approve", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $userid = $params["userid"];

    
    $allowed = DB::runSql("SELECT COUNT(*) AS 'allowed' FROM user_rank WHERE userid=$userid AND rankid=1");
    if ($allowed[0] == 0) {
        http_response_code(405);
        echo DB::arrayToJson([
            "status" => 405,
            "Message" => "NOT ALLOWED"
        ]);
        return;
    };
    $carid = intval($params["carid"]);
    $km = intval($params["km"]);
    $brand = $params["brand"];
    $model = $params["model"];
    $engineCode = $params["engineCode"];
    $licensePlate = $params["licensePlate"];
    $year = $params["year"];

    $jsonarray = array("brand" => $brand, "model" => $model, "engineCode" => $engineCode, "km" => $km, "licensePlate" => $licensePlate, "year" => $year);
    $jsonarray = json_encode($jsonarray);
    DB::table("car")->
    update(["data" => $jsonarray, "approved" => 1])->
    where("id", "=", $carid)->save();
});