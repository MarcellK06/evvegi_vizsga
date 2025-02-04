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

        Mailer::Send($email, "SzalkaAutó regisztráció", Mailer::MailTamplate("Sikeres regisztáció", "<h4>Üdvözöljük a weboldalon, ".$fullName." !</h4><p>Ha kérdése van cégünkkel kapcsolatba, várjuk emailét szeretettel az <a href='mailto:support@szalkauto.paraghtibor.hu'>itt</a> látható címen!</p>"));
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

    $user = DB::runSql("SELECT *, rank.type FROM user INNER JOIN user_rank ON user_rank.userid = user.id INNER JOIN rank ON user_rank.rankid = rank.id WHERE email LIKE '$email'");
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


Route::get("/user/profile-data/{userid}", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $userid = $params["userid"];
    $data = DB::runSql("SELECT `name`, `email`, `phone`, `type`, `avatar` FROM `user` LEFT JOIN user_rank ON user_rank.userid = user.id LEFT JOIN rank ON user_rank.rankid = rank.id WHERE user.id=".$userid);
    http_response_code(200);
    echo DB::arrayToJson($data);
});