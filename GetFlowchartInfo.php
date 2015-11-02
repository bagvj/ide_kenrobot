<?php

// echo phpinfo();
require "DB.php";

$db=new DB("www_kenrobot_db");

$arrReturn=array();
$arrFields=array(
	'id',
	'pid',
	'type',
	'info'
);

$ret=$db->select("ken_flowchart",$arrFields);

foreach ($ret as $key => $value) {
    switch ($value['type'])
	{
		case 1:
			$arrReturn["hardware"]=json_decode($value['info'],true);
			break;
		case 2:
			$arrReturn["flowchart"]=json_decode($value['info'],true);
		  	break;
		case 3:
		    $arrReturn["canvas"]=json_decode($value['info'],true);
		    break;
		case 4:
		    $arrReturn["code"]=json_decode($value['info'],true);
		    break;
	}
}

echo json_encode($arrReturn,true);

