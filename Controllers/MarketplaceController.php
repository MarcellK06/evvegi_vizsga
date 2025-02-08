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
                $where = "WHERE marketplace.approved = 1";
            else
                $where .= " AND marketplace.approved = 1";
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
    $where = "WHERE marketplace.approved = 0";
    $items = DB::runSql("SELECT marketplace.id, itemname, itemdescription, itemprice, listed_at, marketplace.images, car.data from marketplace LEFT JOIN car ON marketplace.carid = car.id ".$where);
    $db = DB::runSql("SELECT COUNT(*) as 'all' from marketplace ");

    echo DB::arrayToJson([$items, $db]);
});

Route::get("/marketplace/item/{id}", [], function ($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
$id = $params["id"];
    $item = DB::runSql("SELECT marketplace.id,marketplace.itemname, marketplace.itemdescription, marketplace.images, marketplace.listed_at, marketplace.itemprice, marketplace.show_email, car.data from marketplace LEFT JOIN car ON marketplace.carid = car.id WHERE marketplace.id = $id");
    $email = "N/A";

    if ($item[0]->show_email == 1)
        $email = DB::runSql("SELECT email FROM user LEFT JOIN user_marketplace ON user_marketplace.userid = user.id WHERE user_marketplace.marketplaceid = $id")[0]->email;
    http_response_code(200);
        echo DB::arrayToJson([$item[0], $email]);
   
});

Route::post("/marketplace/listings/create", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $userid = intval($params["userid"]);
    $itemname = $params["itemname"];
    $itemdescription = $params["itemdescription"];
    $itemprice = $params["itemprice"];
    $car = $params["car"];
    $showemail = $params["showemail"] == "on" ? 1 : 0;
    $filenames = [];
    if (count($_FILES) > 0)
    {
        for($k = 0; $k < count($_FILES); $k++) {
            $image = $_FILES["images-$k"];
            $randomnumber = rand(1, 999999999);
            $saveto = "./marketplaceimages/$randomnumber.jpg";
            move_uploaded_file($image["tmp_name"], $saveto);
            $filenames[] = substr($saveto, 2, strlen($saveto)-1);
        }
        $filename = implode(',', $filenames);
    }
    else {
        $filename = "";
    }
    DB::runSql("INSERT INTO marketplace(itemname, itemdescription, itemprice, carid, userid, images, listed_at, show_email) VALUES('$itemname', '$itemdescription', '$itemprice', $car, $userid, '$filename', NOW(), '$showemail');");
    $marketplaceid = DB::runSql("SELECT id as 'num' FROM marketplace ORDER BY id DESC LIMIT 1")[0]->num;
    DB::runSql("INSERT INTO user_marketplace(userid, marketplaceid) VALUES($userid, $marketplaceid);");
    $email = DB::runSql("SELECT email FROM user WHERE id=".$userid."")[0]->email;
    Mailer::Send($email, "SzalkaAutó hírdetés létrehozása", Mailer::MailTamplate("Sikeres hírdetés létrehozás", "<h4><b>".$itemname."</b> hirdetését sikeresen létrehozta!</h4><p>Hirdetése majd abban az esetben lesz elérhető a többi felhasználó számára, ha egy adminisztrátor azt jováhagyja.</p><p>Ez egy pár órától, egy napig is eltarthat. Ha több mint 3 napba telik, kérjük vegye fel a kapcsolatot a csapatunkkal!</p><div><p>Hirdetés címe: <b>".$itemname."</b></p><p>Hirdetés leírása: <b>".$itemdescription."</b></p><p>Lista ár: <b>".$itemprice."Ft</b></p><p>Jármű azonosító: <b>".$car."</b></p></div>"));
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
    $email = DB::runSql("SELECT email FROM user LEFT JOIN marketplace ON marketplace.userid = user.id WHERE marketplace.id=".$listingid."")[0]->email;
    $data = DB::runSql("SELECT * FROM marketplace WHERE id=$listingid");
    $itemname = $data[0]->itemname;
    Mailer::Send($email, "SzalkaAutó hirdetés jóváhagyva", Mailer::MailTamplate("Hirdetés jóváhagyva", "<h4>\"<b>".$itemname."</b>\" hirdetése jóváhagyásra került!</h4><p>Hirdetéséhez ezentúl a többi felhasználó is hozzáfér.</p>"));
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
    $email = DB::runSql("SELECT email FROM user LEFT JOIN marketplace ON marketplace.userid = user.id WHERE marketplace.id=".$listingid."")[0]->email;
    $data = DB::runSql("SELECT * FROM marketplace WHERE id=$listingid");
    $itemname = $data[0]->itemname;
    Mailer::Send($email, "SzalkaAutó hirdetés elutasítva", Mailer::MailTamplate("Hirdetés elutasítva", "<h4>\"<b>".$itemname."</b>\" hirdetése elutasításra került!</h4><p>További információért vegye fel kapcsolatot cégünkkel!</p>"));
    
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

Route::get("/marketplace/images/{postid}/{index}", [], function($params) {
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');

    $postid = intval($params["postid"]);
    $index = intval($params["index"]);
    
    $img = explode(',', DB::runSql("SELECT images FROM marketplace WHERE id=$postid")[0]->images)[$index];
    
    $filename = $img;
    $file = fopen($filename, 'rb');
    header("Content-Type: image/png");
    header("Content-Length: " . filesize($filename));
    fpassthru($file);
});