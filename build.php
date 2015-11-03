<?php

function fromCharCode($codes) {
	if (is_scalar($codes))
		$codes= func_get_args();
	$str= '';
	foreach ($codes as $code)
		$str.= chr($code);
	return $str;
}

$result = array();
$code = -1;

//下载
// $type = 0;
//直接烧写
$type = 1;

$bytes = $_POST['source'];
if($bytes)
{
	$source = fromCharCode($bytes);
	$time = time();
	$path = "/tmp/$time";
	mkdir($path);
	$f = fopen($path."/CSource.c", "wb");
	fwrite($f, $source);
	fclose($f);

	$cmd = "sh build.sh $time 2>&1";
	$output = array();
	exec($cmd, &$output, &$code);
	if($code == 0){
		$result['msg'] = "编译成功";
		if($type == 0){
			//下载
			$result['url'] = "/download.php?time=$time";
		} else {
			//直接烧写
			$cmd = "sh flashburn.sh $time";
			$output = array();
			exec($cmd, &$output, &$code);
			if($code == 0){
				$result['msg'] = "烧写成功";
			} else {
				$result['msg'] = "烧写失败";
			}
		}
	} else {
		$result['msg'] = "编译失败";
	}
} else {
	$result['msg'] = "非法请求";
}
$result['code'] = $code;

echo json_encode($result, true);
?>