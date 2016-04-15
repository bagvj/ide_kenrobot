<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\User;
use Auth;
use DB;
use Illuminate\Http\Request;
use ZipArchive;
use Curl\Curl;
use Session;

class ProjectController extends Controller {

	public function buildProject(Request $request) {
		$id = $request->input('id');
		$project = $this->getProjectInfo($id);
		if(!$project) {
			return response()->json(['status' => -1, 'message' => '非法请求']);
		}

		$project_data = json_decode($project->project_data);
		//代码的字节码
		$source = $project_data->software->source;
		//项目名字
		$project_name = $project->project_name;
		//主板类型
		$board_type = $project_data->board->board_type;
		//项目hash
		$hash = $project->hash;

		$path = "/tmp/build/$hash";
		if(!file_exists($path)) {
			mkdir($path, 0755, true);
		}
		$f = fopen($path . "/main.ino", "wb");
		fwrite($f, $source);
		fclose($f);

		$cmd = "sh ../app/Build/compiler/Arduino/build.sh $path $board_type $project_name 2>&1";
		$output = array();
		exec($cmd, $output, $status);
		if ($status == 0) {
			return response()->json(['status' => 0, 'message' => '编译成功', 'id' => $id, 'url' => "/project/download/$id"]);
		} else {
			// return response()->json(['status' => $status, 'message' => '编译失败']);
			return response()->json(['status' => $status, 'message' => '编译失败', 'id' => $id, 'output' => $output]);
		}
	}

	public function downloadProject(Request $request, $id, $ext = "zip") {
		$project = $this->getProjectInfo($id);
		if(!$project) {
			return abort(404);
		}

		$hash = $project->hash;
		$ext = "." . $ext;
		$filename = "/tmp/build/$hash/build$ext";
		$build_info = "/tmp/build/$hash/build.info";
		if(!file_exists($filename) || !file_exists($build_info) ) {
			return abort(404);
		}

		$file = fopen($build_info, "r");
		$build_name = trim(fgets($file));
		fclose($file);

		$download_name = $build_name.$ext;
		//返回的文件类型
		header("Content-type: application/octet-stream");
		//按照字节大小返回
		header("Accept-Ranges: bytes");
		//返回文件的大小
		header("Accept-Length: " . filesize($filename));
		//这里对客户端的弹出对话框，对应的文件名
		Header("Content-Disposition: attachment; filename=$download_name");
		//一次只传输4096个字节的数据给客户端
		//打开文件
		$file = fopen($filename, "r");
		$buffer = 4096;
		//判断文件是否读完
		while (!feof($file)) {
			//将文件读入内存, 每次向客户端回送4096个字节的数据
			echo fread($file, $buffer);
		}
		fclose($file);
	}

	public function saveProject(Request $request) {
		$id = $request->input('id');
		if($id != 0) {
			$project = $this->getProjectInfo($id);
			if(!$project) {
				return response()->json(['status' => -1, 'message' => '非法请求']);
			}
		}

		$url = config("platform.url.base").config("platform.url.saveProject");
		$params = array(
			'id' => $id,
			'user_id' => $request->input('user_id'),
			'project_data' => $request->input('project_data'),
			'project_name' => $request->input('project_name'),
			'project_intro' => $request->input('project_intro'),
			'public_type' => $request->input('public_type'),
			'project_type' => 'code',
		);
		if($id == 0 || empty($project->hash)) {
			$params['hash'] = $this->getHash();
		}

		//传递默认参数
		$user_id = $request->input('user_id');
		$user = User::find($user_id);
		$params['uid'] = empty($user) ? 0 : $user->uid;

		$curl = new Curl();
		return $curl->post($url, $params);
	}

	public function getProject(Request $request, $id) {
		$url = config("platform.url.base").config("platform.url.getProject")."&id=".$id;
		$curl = new Curl();
		return $curl->get($url);
	}

	public function getProjects(Request $request, $user_id) {
		$url = config("platform.url.base").config("platform.url.getUserProjects")."&project_type=code&user_id=".$user_id;
		$curl = new Curl();
		return $curl->get($url);
	}

	public function deleteProject(Request $request) {
		$url = config("platform.url.base").config("platform.url.deleteProject");
		$params = array(
			'id' => $request->input('id'),
		);
		$curl = new Curl();
		return $curl->post($url, $params);
	}

	private function getProjectInfo($id) {
		$url = config("platform.url.base").config("platform.url.getProject")."&id=".$id;
		$curl = new Curl();
		$result = json_decode($curl->get($url));
		return ($result && $result->status == 0) ? $result->data : false;
	}

	//生成短url
	//返回：一个长度为6的由字母和数组组成的字符串
	private function getHash($value = "") {
		$key = "HwpGAejoUOPr6DbKBlvRILmsq4z7X3TCtky8NVd5iWE0ga2MchSZxfn1Y9JQuF";

		$result = array();
		$time = time();
		$salt = md5(rand(10000, 99999));
		$md5 = md5($salt . $value . $time);

		for($i = 0; $i < 4; $i++) {
			$hex = 0x3FFFFFFF & intval(substr($md5, $i * 8, 8), 16);
			$out = '';
			for($j = 0; $j < 6; $j++) {
				$index = 0x0000003D & $hex;
				$out = $out . $key[$index];
				$hex = $hex >> 5;
			}
			$result[$i] = $out;
		}

		return $result[0];
	}
}