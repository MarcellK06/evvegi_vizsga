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


Route::post("/mail", ["userid"], function($params){
    HttpHeadersManager::setHeader(HttpHeadersInterface::HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    $userid = $params["userid"];
    $allowed = DB::runSql("SELECT COUNT(*) AS `allowed` FROM user_rank WHERE userid=$userid AND rankid=1")[0]->allowed;
    if ($allowed == 0) {
        http_response_code(406);
        DB::arrayToJson([
            "status" => 406,
            "Message" => "NOT ALLOWED"
    ]);
        return;
    }
    $inbox_hostname = '{mail.nethely.hu:143/imap/notls}INBOX';
    $sent_hostname = '{mail.nethely.hu:143/imap/notls}[Gmail]/Sent Mail';
    $username = 'szalkacar@paraghtibor.hu';
    $password = 'asd123456789'; 
    
    $inbox = imap_open($inbox_hostname, $username, $password) or die('Nem lehet csatlakozni: ' . imap_last_error());
    $sent = imap_open($sent_hostname, $username, $password) or die('Nem lehet csatlakozni: ' . imap_last_error());
    
    $inbox_emails = imap_search($inbox, 'ALL');
    $mails = [];
    
    if ($inbox_emails) {
        rsort($inbox_emails);     
        foreach ($inbox_emails as $email_number) {
            $overview = imap_fetch_overview($inbox, $email_number, 0);
            $message = imap_fetchbody($inbox, $email_number, 1);
            
            $from_header = imap_rfc822_parse_adrlist($overview[0]->from, "");
            $from_email = $from_header[0]->mailbox . "@" . $from_header[0]->host;
    
            $namexploded = explode('?', $overview[0]->from);
            $namehalf = $namexploded[count($namexploded)-2];
            $name = base64_decode($namehalf."=");
    
            $mails[] = [
                "subject" => $overview[0]->subject,
                "from" => $from_email,
                "body" => $message,
                "date" => $overview[0]->date,
                "name" => $name,
                "type" => "inbox"
            ];  
        }
    }
    
    $sent_emails = imap_search($sent, 'ALL');
    
    if ($sent_emails) {
        rsort($sent_emails);     
        foreach ($sent_emails as $email_number) {
            $overview = imap_fetch_overview($sent, $email_number, 0);
            $message = imap_fetchbody($sent, $email_number, 1);
            
            $from_header = imap_rfc822_parse_adrlist($overview[0]->from, "");
            $from_email = $from_header[0]->mailbox . "@" . $from_header[0]->host;
    
            $namexploded = explode('?', $overview[0]->from);
            $namehalf = $namexploded[count($namexploded)-2];
            $name = base64_decode($namehalf."=");
    
            $mails[] = [
                "subject" => $overview[0]->subject,
                "from" => $from_email,
                "body" => $message,
                "date" => $overview[0]->date,
                "name" => $name,
                "type" => "sent"
            ];  
        }
    }
    
    usort($mails, function($a, $b) {
        return strtotime($b['date']) - strtotime($a['date']);
    });
    
    echo DB::arrayToJson($mails);
    
    imap_close($inbox);
    imap_close($sent);

});
Route::post("/mailer/send", [], function ($params){
    $to = $params["to"];
    $subject = $params["subject"];
    $title = $params["title"];
    $body = $params["body"];
    Mailer::Send($to, $subject, Mailer::MailTamplate($title, $body));
    echo "mail sent";
    
}, Authentication::class);

Route::get("/gdpr", [], function(){
 
    $filePath = 'gdpr.pdf';
    header("Content-Type: application/pdf");
        header("Content-Disposition: inline; filename='gdpr.pdf'");
    
    if (file_exists($filePath)) {
        readfile($filePath);
        
        
        exit;
    } else {
        http_response_code(404);
        echo "A fájl nem található.";
    }
});
Route::get("/aszf", [], function(){
 
    $filePath = 'aszf.pdf';
    header("Content-Type: application/pdf");
        header("Content-Disposition: inline; filename='aszf.pdf'");
    
    if (file_exists($filePath)) {
        readfile($filePath);
        
        
        exit;
    } else {
        http_response_code(404);
        echo "A fájl nem található.";
    }
});