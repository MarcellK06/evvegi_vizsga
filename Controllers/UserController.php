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

Route::post("/login", ["email", "password"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $email = $params['email'];
    $password = $params['password'];
    
    $res = DB::runSql("SELECT 'id', 'email', 'password' FROM users WHERE email LIKE $email;");
    $id = $res[0]->id;

    if (count($res) == 0)
        return DB::arrayToJson(["ACCOUNT_NOT_FOUND"]);

    $respassword = $res[0]->password;
    if (password_verify($password, $respassword))
        return DB::arrayToJson(['SUCCESSFUL_LOGIN', $id]);

    return DB::arrayToJson(['INVALID_EMAIL_OR_PASSWORD']);
});
