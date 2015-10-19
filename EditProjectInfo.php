<?php

// echo phpinfo();
require "DB.php";

$db=new DB("www_kenrobot_db");

$id=$_REQUEST['id'];
$name=$_REQUEST['name'];
$scope=$_REQUEST['scope'];
$status=$_REQUEST['status'];
$info=$_REQUEST['info'];
$create_time=$update_time=time();


$ret=$db->query(sprintf("update ken_project 
	                     set name = '%s',
	                         scope = %d,
	                         status = %d,
	                         info = '%s',
	                         update_time = %d
	                     where id = %d;",
	                     $name,$scope,$status,$info,$update_time,$id));

echo $ret;