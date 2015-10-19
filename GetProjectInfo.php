<?php

// echo phpinfo();
require "DB.php";

$db=new DB("www_kenrobot_db");

$arrReturn=array();
$arrFields=array(
	'id',
	'name',
	'scope',
	'user_id',
	'user_name',
	'status',
	'info',
	'create_time',
	'update_time'
);
$arrConds=array(
	"id = "=>$_REQUEST['id'],
);

$ret=$db->select("ken_project",$arrFields,$arrConds);

foreach ($ret as $key => $value) {			
	$arrReturn["info"]=$value;
}

echo json_encode($arrReturn,true);

