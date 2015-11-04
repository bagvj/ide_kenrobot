<?php

$pid = $_REQUEST['pid'];
$uid = $_REQUEST['uid'];

if(empty($uid)){
	echo '用户尚未登录，请登录后再尝试!';
	exit(0);
}

// $token = $_REQUEST['token'];
// $tmpToken = md5('uid='.$uid."&pid=".$pid);
// if ($token != $tmpToken) {
// 	echo "登录校验失败，请联系管理员进行处理！";
// 	exit(0);
// }

session_start();

setcookie('kenrobot_uid', $uid, time()+3600);
header("Location: ../index.php?pid=$pid&uid=$uid");