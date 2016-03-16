<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SerialController extends Controller {

	public function __construct()
	{
	}

	public function update(Request $request) {
		$filename = "../app/Serial/update.xml";
		//返回的文件类型
		header("Content-type: application/octet-stream");
		//按照字节大小返回
		header("Accept-Ranges: bytes");
		//返回文件的大小
		header("Accept-Length: " . filesize($filename));
		//这里对客户端的弹出对话框，对应的文件名
		Header("Content-Disposition: attachment; filename=" . basename($filename));
		//一次只传输4096个字节的数据给客户端
		//打开文件
		$file = fopen($filename, "r");
		$buffer = 4096; //
		//判断文件是否读完
		while (!feof($file)) {
			//将文件读入内存, 每次向客户端回送1024个字节的数据
			echo fread($file, $buffer);
		}
		fclose($file);
	}
}