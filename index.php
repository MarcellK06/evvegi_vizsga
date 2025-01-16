<?php
require_once "application/route/Route.php";
require_once "application/assets/Mysql/DB.php";
require_once "application/assets/Header/HttpHeadersManager.php";
require_once "APIAuth/Authentication.php";

use Application\Route\Route;
use Application\Database\DB;


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, token");
Authentication::init();
DB::DBInit();
Route::get("/", [], function ($params) {});

Route::initialize($_SERVER, $_POST);

$controllers = scandir("Controllers/");
foreach (array_splice($controllers, 2) as $controller) {
    include "Controllers/" . $controller;
}
Route::handle();
