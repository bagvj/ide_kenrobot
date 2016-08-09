<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Util\Tools;

class BuildController extends Controller {

	public function index(Request $request) {
		//允许跨域
		header('Access-Control-Allow-Origin:*'); 
		
		$code = $request->input('code');
		if(!isset($code) || empty($code)) {
			return response()->json(['status' => 1, 'message' => '代码不能为空']);
		}

		$board_type = $request->input('board_type');
		$board_type = isset($board_type) ? $board_type : 'uno';
		$yield_error = $request->input('yield_error');
		$yield_error = isset($yield_error) ? $yield_error : false;

		$hash = Tools::getHash();
		$path = "/tmp/build/$hash";
		if(!file_exists($path)) {
		    mkdir($path, 0755, true);
		}
		$f = fopen($path . "/main.ino", "wb");
		fwrite($f, $code);
		fclose($f);

		$cmd = "sudo sh ../app/Build/build.sh $path $board_type $hash 2>&1";
		$output = array();
		exec($cmd, $output, $status);
		if ($status != 0) {
			$output = Tools::filterBuildOutput($output, $path);
			if($yield_error) {
				$error = Tools::yieldBuildError($output);
				return response()->json(['status' => $status, 'message' => '编译失败', 'output' => $output, 'error' => $error]);
			} else {
				return response()->json(['status' => $status, 'message' => '编译失败', 'output' => $output]);
			}
		}

		$hexName = $path . '/build.hex';
		$hex = file_get_contents($hexName);
		return response()->json(['status' => 0, 'message' => '编译成功', 'data' => $hex]);
	}
}