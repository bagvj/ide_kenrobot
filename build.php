<?php

$result = array();
$code = -1;

$bytes = $_REQUEST['source'];
if($bytes)
{
	$time = time();
	$path = "/tmp/$time";
	mkdir($path);
	$f = fopen($path."/CSource.cpp", "wb");
	fwrite($f, $bytes);
	fclose($f);

	$cmd = "sh build.sh $time 2>&1";
	$output = array();
	exec($cmd, &$output, &$code);
	if($code == 0){
		$result['msg'] = "编译成功";
		$result['time'] = $time;
	} else {
		$result['msg'] = "编译失败";
	}
} else {
	$result['msg'] = "非法请求";
}
$result['code'] = $code;

echo json_encode($result, true);
?>