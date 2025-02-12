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

Route::get("/site-data", [], function($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    echo DB::arrayToJson(DB::runSql("SELECT
	(SELECT COUNT(id) FROM user) AS 'total_users',
    (SELECT COUNT(id) FROM appointment) AS 'total_appointments',
    (SELECT COUNT(id) FROM requests) AS 'total_requests';"));
});