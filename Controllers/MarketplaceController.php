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


Route::post("/marketplace/listings/load/{page}", [], function ($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $userid = intval($params['userid']);
    $page = intval($params["page"]);
    $limit = 20;
    $offset = $page == 1 ? 0 : $limit* $page - $limit ;
    
    $brand = $params["filters"][0];
    if (strlen($params["filters"][1]) != 1) {
        $model = str_replace('-', ' ', $params["filters"][1]);
    } else {
        $model = $params["filters"][1];
    }
    $engineCode = $params["filters"][2];

    $where = "";
    $parameters = [];
    if ($brand != "-" || $model != "-" || $engineCode != "-")
    {
        if ($brand != "-")
            $parameters[] = "JSON_EXTRACT(car.data, '$.brand') = '".$brand."'";

        if ($model != "-")
            $parameters[] = "JSON_EXTRACT(car.data, '$.model') = '".$model."'";

        if ($engineCode != "-")
            $parameters[] = "JSON_EXTRACT(car.data, '$.engineCode') = '".$engineCode."'";
        $where = "WHERE " . implode(" AND ", $parameters);
    }
        if ($userid == 0) {
            if ($where == "")
                $where = "WHERE approved = 1";
            else
                $where .= " AND approved = 1";
    $items = DB::runSql("SELECT marketplace.id, itemname, itemdescription, itemprice, listed_at, marketplace.images, car.data from marketplace LEFT JOIN car ON marketplace.carid = car.id ".$where);
    $db = DB::runSql("SELECT COUNT(*) as 'all' from marketplace ");
        }
        else {
            $where = "WHERE userid=$userid";
            $items = DB::runSql("SELECT marketplace.id, itemname, itemdescription, itemprice, listed_at, marketplace.images, car.data from marketplace LEFT JOIN car ON marketplace.carid = car.id ".$where);
            $db = DB::runSql("SELECT COUNT(*) as 'all' from marketplace ".$where);
        }
    echo DB::arrayToJson([$items, $db]);
});


Route::post("/marketplace/listings/load/admin/{page}", [], function ($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $page = intval($params["page"]);
    $limit = 20;
    $offset = $page == 1 ? 0 : $limit* $page - $limit ;
    
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
    $where = "WHERE approved = 0";
    $items = DB::runSql("SELECT marketplace.id, itemname, itemdescription, itemprice, listed_at, marketplace.images, car.data from marketplace LEFT JOIN car ON marketplace.carid = car.id ".$where);
    $db = DB::runSql("SELECT COUNT(*) as 'all' from marketplace ");

    echo DB::arrayToJson([$items, $db]);
});

Route::get("/marketplace/item/{id}", [], function ($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
$id = $params["id"];
    $item = DB::runSql("SELECT *, car.data from marketplace LEFT JOIN car ON marketplace.carid = car.id WHERE marketplace.id = $id");

    echo DB::arrayToJson([$item[0]]);
   
});

Route::post("/marketplace/listings/create", ["userid", "itemname", "itemdescription", "itemprice", "car"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $userid = intval($params["userid"]);
    $itemname = $params["itemname"];
    $itemdescription = $params["itemdescription"];
    $itemprice = $params["itemprice"];
    $car = $params["car"];

    DB::runSql("INSERT INTO marketplace(itemname, itemdescription, itemprice, carid, userid, listed_at) VALUES('$itemname', '$itemdescription', '$itemprice', $car, $userid, NOW());");
    $marketplaceid = DB::runSql("SELECT id as 'num' FROM marketplace ORDER BY id DESC LIMIT 1")[0]->num;
    DB::runSql("INSERT INTO user_marketplace(userid, marketplaceid) VALUES($userid, $marketplaceid);");
    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200
    ]);
});

Route::post("/marketplace/listings/approve", ["userid", "rankid", "listingid"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $userid = $params["userid"];
    $rankid = $params["rankid"];
    $listingid = $params["listingid"];

    $allowed = DB::runSql("SELECT COUNT(*) AS 'allowed' FROM user_rank WHERE userid=$userid AND rankid=1");
    if ($allowed[0] == 0) {
        http_response_code(405);
        echo DB::arrayToJson([
            "status" => 405,
            "Message" => "NOT ALLOWED"
        ]);
        return;
    };
    DB::runSql("UPDATE marketplace SET approved=1 WHERE id=$listingid");
    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200,
        "Message" => "Success"
    ]);

});

Route::post("/marketplace/listings/decline", ["userid", "rankid", "listingid"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $userid = $params["userid"];
    $rankid = $params["rankid"];
    $listingid = $params["listingid"];

    $allowed = DB::runSql("SELECT COUNT(*) AS 'allowed' FROM user_rank WHERE userid=$userid AND rankid=1");
    if ($allowed[0] == 0) {
        http_response_code(405);
        echo DB::arrayToJson([
            "status" => 405,
            "Message" => "NOT ALLOWED"
        ]);
        return;
    };
    DB::runSql("DELETE FROM user_marketplace WHERE marketplaceid=$listingid");
    DB::runSql("DELETE FROM marketplace WHERE id=$listingid");
    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200,
        "Message" => "Success"
    ]);

});

Route::post("/marketplace/listings/delete", ["userid", "listingid"], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $userid = intval($params["userid"]);
    $listingid = intval($params["listingid"]);

    DB::runSql("DELETE FROM user_marketplace WHERE userid=$userid marketplaceid=$listingid");
    DB::runSql("DELETE FROM marketplace WHERE userid=$userid AND id=$listingid");
    http_response_code(200);
    echo DB::arrayToJson([
        "status" => 200,
        "Message" => "Success"
    ]);
});