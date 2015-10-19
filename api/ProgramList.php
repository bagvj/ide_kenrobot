<?php

require "../DB.php";

$db=new DB("www_kenrobot_db");

$arrFields = array(
	"*",
);

$arrConds = array(
	'scope =' => 1,
);

$ret=$db->select("ken_project",$arrFields,$arrConds);

// foreach ($ret as $key => &$value) {
// 	$value['create_time'] = date('Y/m/d H:i:s',$value['create_time']);
// 	$value['update_time'] = date('Y/m/d H:i:s',$value['update_time']);
// }

echo json_encode($ret);

