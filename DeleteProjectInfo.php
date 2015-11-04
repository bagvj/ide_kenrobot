<?php

// echo phpinfo();
require "DB.php";

$db=new DB("www_kenrobot_db");

$id=$_REQUEST['id'];

$ret=$db->query(sprintf("delete from ken_project where id = %d;",$id));
$ret=$db->query(sprintf("delete from ken_flowchart where pid = %d;",$id));

echo $ret;