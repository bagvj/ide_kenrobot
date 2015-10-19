<?php

// echo phpinfo();
require "DB.php";

$db=new DB("www_kenrobot_db");

$name=$_REQUEST['name'];
$scope=$_REQUEST['scope'];
$user_id=$_REQUEST['user_id'];
$user_name=$_REQUEST['user_name'];
$status=$_REQUEST['status'];
$info=$_REQUEST['info'];
$create_time=$update_time=time();


$ret=$db->query(sprintf("insert into ken_project(name,scope,user_id,user_name,status,info,create_time,update_time) 
	                     values('%s',%d,%d,'%s',%d,'%s',%d,%d);",
	                     $name,$scope,$user_id,$user_name,$status,$info,$create_time,$update_time));

$ret=$db->mysqli_insert_id();
echo $ret;