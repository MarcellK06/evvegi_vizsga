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
    $token = bin2hex(random_bytes(32));
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
        $uid = DB::table("user")->insert([["name" => $fullName, "email" => $email,"phone"=> $phone,"password"=> $password_hashed, "token" => $token, "verified" => 0]], true)->getLastInsertId();
        DB::table("user_rank")->insert([["userid" => $uid, "rankid" => 2]], true);
        Mailer::Send($email, "SzalkaCar regisztráció", Mailer::MailTamplate("Sikeres regisztáció", "<h4>Üdvözöljük a weboldalon, ".$fullName." !</h4><p>Ha kérdése van cégünkkel kapcsolatba, várjuk emailét szeretettel az <a href='mailto:support@szalkauto.paraghtibor.hu'>itt</a> látható címen!</p><h4>Fiók megerősítés</h4><p>A fiókját megerősítheti <a href='https://code2-api.paraghtibor.hu/user/verify/$token'>itt!</a></p><p>Abban az esetben ha a fent megadott link nem működött, ezt itt is megteheti: https://code2-api.paraghtibor.hu/user/verify/$token</p>"));
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

    if ($user[0]->verified == 0) {
        http_response_code(401);
        echo DB::arrayToJson([
            "status" => 406,
            "Message" => "A bejelentkezéshez kérjük erősítse meg fiókját!"
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

Route::post("/user/get-password-recovery", ["email"], function($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $email = $params["email"];

    $user = DB::runSql("SELECT * from user WHERE email like '$email'")[0];

    

    $userid = $user->id;
    $token = bin2hex(random_bytes(8));
    $date = new DateTime();
    $date->modify('+2 hours');
    $expiry = $date->format('Y-m-d H:i:s');
    DB::runSql("INSERT INTO password_recovery (userid, token, expiry) VALUES ($userid, '$token', '$expiry')");
    

    Mailer::Send($email, "SzalkaCar jelszó visszaállítás", Mailer::MailTamplate("Jelszó visszaáálítás", "
        <p>A visszaállító kódja:  <b>".$token."</b></p>
        <p>A kód eddig érvényes: ".$expiry."</p>
    "));
    http_response_code(200);
   echo DB::arrayToJson(["message" => "A kódot sikeresen elküldtünk a '$email' címre."]);
});
Route::post("/user/get-password-recovery/verify", ["email", "token"], function($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $email = $params["email"];
    $token = $params["token"];
    $verify = DB::runSql("SELECT * from user INNER JOIN password_recovery ON password_recovery.userid = user.id WHERE user.email like '$email' 
    and token like '$token' and password_recovery.expiry > NOW() and password_recovery.success not like 1");
    if (count($verify) > 0) {
        echo json_encode(["status" => "passed"]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "failed"]);
        return;
    }

    http_response_code(200);
});

Route::post("/user/reset-password", ["email",  "password","token"], function($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $email = $params["email"];
    $token = $params["token"];
    $newPassword = password_hash($params["password"], PASSWORD_DEFAULT);
    $verify = DB::runSql("SELECT * from user INNER JOIN password_recovery ON password_recovery.userid = user.id WHERE user.email like '$email' 
    and token like '$token' and password_recovery.expiry > NOW() and password_recovery.success not like 1");

    if (count($verify) > 0) {

        DB::runSql("UPDATE user SET password = '$newPassword' WHERE email like '$email'");
        DB::runSql("UPDATE password_recovery SET success = 1 WHERE token like '$token'");
        
        echo json_encode(["status" => "password changed"]);
        $date = new DateTime();
        $date->modify('+1 hours');
        $now= $date->format('Y-m-d H:i:s');
        Mailer::Send($email,"Jelszó visszaállítás", Mailer::MailTamplate("Jelszó visszaállítása sikersen megtörtént!", "
        <p>Jelszava visszaállításának időpontja: '$now'</p>
        
        "));
    } else {
        http_response_code(401);
        echo json_encode(["status" => "failed"]);
        return;
    }

    http_response_code(200);
});

Route::post("/user/upload_avatar", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $userid = intval($params["userid"]);
    $file = $_FILES["avatar"];
    $randomnumber = rand(1, 999999999);
    $saveto = "./avatars/$randomnumber.jpg";
    if(move_uploaded_file($file['tmp_name'], $saveto)) {
    $saveto = substr($saveto, 2, strlen($saveto)-1);
    DB::runSql("UPDATE user SET avatar ='$saveto' WHERE id=$userid");
    http_response_code(200);
    DB::arrayToJson([
        "status" => 200,
        "Message" => "Success"
    ]);
} else {
    
    http_response_code(406);
    DB::arrayToJson([
        "status" => 406,
        "Message" => "Error"
    ]);
}
});

Route::get("/user/avatar/{userid}", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    
    $userid = intval($params["userid"]);

    $avatar = DB::runSql("SELECT avatar FROM user WHERE id=$userid")[0]->avatar;
    if (str_contains("bing", $avatar)) {
        http_response_code(200);
        echo $avatar;
        return;
    }

    $filename = $avatar;
    $file = fopen($filename, 'rb');
    header("Content-Type: image/png");
    header("Content-Length: " . filesize($filename));
    fpassthru($file);
});

Route::post("/user/update", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    
    $userid = $params["userid"];
    $email = $params["email"];
    $phonenumber = $params["phonenumber"];

    DB::runSql("UPDATE user SET phone='$phonenumber', email='$email' WHERE id=$userid");
    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200,
        "Message" => "SUCCESS"
    ]);
});

Route::get("/user/verify/{token}", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $token = $params["token"];

    $exists = DB::runSql("SELECT COUNT(*) AS 'exists' FROM user WHERE token='$token'")[0]->exists;

    if ($exists == 0)
    {
        http_response_code(406);
        echo DB::arrayToJson(["status" => 406, "Message" => "Invalid token!"]);
        return;
    }
    DB::table("user")->update(["verified"=>1])->where("token","=",$token)->save();
    http_response_code(200);
    echo DB::arrayToJson(["status" => 20, "Message" => "SUCCESS"]);
});