<?php

require "DB.php";

$db=new DB("www_kenrobot_db");
$cookie_user = $_COOKIE['kenrobot_uid'];

$arrReturn = array(
	'uid' => 1,
	'uname' => '萝卜头',
);

echo json_encode($arrReturn);