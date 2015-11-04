<?php

// echo phpinfo();
require "DB.php";

$db=new DB("www_kenrobot_db");

$arrReturn=array();
$arrFields=array(
	'id',
	'name',
	'scope',
	'info'
);
$arrConds=array(
	"user_id = "=>$_REQUEST['user_id']
);
$arrAppends=array(
	'order by create_time desc, update_time desc'
);

$ret=$db->select("ken_project",$arrFields,$arrConds,$arrAppends);
$arrReturn["list"]=$ret;

echo json_encode($arrReturn,true);

