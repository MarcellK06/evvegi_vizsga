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

Route::get("/appointments/get-all", [], function($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $ap = DB::runSql("SELECT user.id as user_id, user.name , appointment.date, appointable_times.time, car.id as car_id,car.status, car.vin, car.data, appointment.complaint, appointment.stepstorep FROM user_car_appointment INNER JOIN appointment on user_car_appointment.appointmentid = appointment.id INNER JOIN user on user.id = user_car_appointment.userid INNER JOIN appointable_times ON appointable_times.id = appointment.timeid INNER JOIN car ON user_car_appointment.carid = car.id;");
    echo DB::arrayToJson($ap);
});
Route::post("/appointments/set-car-state/{carid}", [], function($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $newStatus = $params["status"];
    $id = $params["carid"];

    DB::runSql("UPDATE car SET status = '$newStatus' WHERE id like $id");
   
});



//TESZT
