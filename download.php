<?php
$time = $_REQUEST['time'];
$path = "/tmp/$time/";
$hexName = $path."CSource.hex";
$srcName = $path."CSource.cpp";
if(!file_exists($hexName) || !file_exists($srcName)){
	//C代码文件或者编译出来的hex文件不存在
	header("content-type=text/html,charset=utf-8");
	die("非法请求");
}

//打包
$zipName = $path."CSource.zip";
$zip = new ZipArchive();
if($zip->open($zipName, ZipArchive::CREATE) === TRUE){
	$zip->addFile($hexName, basename($hexName));
	$zip->addFile($srcName, basename(($srcName)));
	$zip->close();
}

$filename = $zipName;
//检查文件是否存在
if (file_exists($filename)){
	//返回的文件类型
	header("Content-type: application/octet-stream");
	//按照字节大小返回
	header("Accept-Ranges: bytes");
	//返回文件的大小
	header("Accept-Length: ".filesize($filename));
	//这里对客户端的弹出对话框，对应的文件名
	Header("Content-Disposition: attachment; filename=".basename($filename));
	//一次只传输1024个字节的数据给客户端
	//打开文件
	$file = fopen($filename,"r");
	$buffer = 1024;//
	//判断文件是否读完
	while (!feof($file)) {
		//将文件读入内存, 每次向客户端回送1024个字节的数据
		echo fread($file, $buffer);
	}            
	fclose($file);
} else {
	echo "<script>alert('对不起，您要下载的文件不存在！');</script>";
}
?>