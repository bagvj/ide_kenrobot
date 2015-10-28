<?php
$time = $_REQUEST['time'];
$filename = "/tmp/$time/CSource.hex";
$f = @fopen($filename, 'r');
if(!$f){
	header("content-type=text/html,charset=utf-8");
	die("非法请求");
}

$filesize = filesize($filename);
header("Content-Type:application/force-download");
header("Content-Disposition:attachment;filename=".basename($filename));
header("Content-Length:".$filesize);

$bytes = @fread($f, $filesize);
@fclose($f);
echo $bytes;
?>