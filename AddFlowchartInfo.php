<?php

// echo phpinfo();
require "DB.php";

$db=new DB("www_kenrobot_db");

$pid=$_REQUEST['pid'];
//$type=$_REQUEST['type'];
//$info=addslashes(json_encode($_REQUEST['info'],true));
$infos=$_REQUEST['info'];
$create_time=$update_time=time();

$hardware = addslashes(json_encode($infos['hardware'],true));
$flowchart = addslashes(json_encode($infos['flowchart'],true));
$code = addslashes(json_encode($infos['code'],true));

$type=1;
$info=$hardware;
$ret=$db->query(sprintf("insert into ken_flowchart(pid,type,info,create_time,update_time) 
	                     values(%d,%d,'%s',%d,%d) on duplicate key update info='%s',update_time=%d;",
	                     $pid,$type,$info,$create_time,$update_time,$info,$update_time));


$type=2;
$info=$flowchart;
$ret=$db->query(sprintf("insert into ken_flowchart(pid,type,info,create_time,update_time) 
	                     values(%d,%d,'%s',%d,%d) on duplicate key update info='%s',update_time=%d;",
	                     $pid,$type,$info,$create_time,$update_time,$info,$update_time));

$type=4;
$info=$code;
$ret=$db->query(sprintf("insert into ken_flowchart(pid,type,info,create_time,update_time) 
	                     values(%d,%d,'%s',%d,%d) on duplicate key update info='%s',update_time=%d;",
	                     $pid,$type,$info,$create_time,$update_time,$info,$update_time));
echo $ret;