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

Route::post("/user/register", ["fullName", "email", "phone", "password"], function ($params){
    //tesztelt
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $fullName = $params["fullName"];
    $email = $params["email"];
    $phone = $params["phone"];
    $password= $params["password"];
    $password_hashed = password_hash($password, PASSWORD_DEFAULT);

    try{
        $email_check = DB::table("user")->select()->where("email", "like", $email)->get();
        if(count($email_check) > 0){
            http_response_code(400);
            echo DB::arrayToJson([
                "status" => 400,
                "Message" => "Az email cím már fogalat!"
            ]);
            return;
        } 
        DB::table("user")->insert([["name" => $fullName, "email" => $email,"phone"=> $phone,"password"=> $password_hashed]], true)->getLastInsertId();
        echo DB::arrayToJson([
            "status" => 201,
            "Message" => "Sikeres regisztráció!"


        ]);
    }catch(Exception $err){
        echo DB::arrayToJson([
            "status" => 500,
            "Message" => "Failed to register user! ".$err->getMessage()
        ]);
    }
});
Route::post("/user/login", ["email", "password"], function ($params){
    //tesztelt
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $email = $params["email"];
    $pass = $params["password"];

    $user = DB::table("user")->select()->where("email", "like", "$email")->get();
    if(count($user) == 0){
        http_response_code(401);
        echo DB::arrayToJson([
            "status" => 401,
            "Message" => "Hibás email cím vagy jelszó!"
        ]);
        return;
    }
    if(!password_verify($pass,$user[0]->password)) {
        http_response_code(401);
        echo DB::arrayToJson([
            "status" => 401,
            "Message" => "Hibás email cím vagy jelszó!"
        ]);
        return;
    }
    echo DB::arrayToJson(["status" => 200, "token" => getenv("TOKEN"), "user" => $user[0]]);
});
