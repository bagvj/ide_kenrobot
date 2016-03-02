<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Robot\Feedback;
use App\Robot\Project;
use App\User;
use Auth;
use DB;
use Illuminate\Http\Request;
use ZipArchive;

use Curl\Curl;
use Session;


class HomeController extends Controller {

	public function __construct()
	{
		$this->middleware('snspassport');
	}

	public function index(Request $request) {
		if (Auth::check()) {
			$user = Auth::user();
		}

		$qrcode = rand(70000,80000);
		$qrcodeurl = $this->getQrcodeurl($qrcode);
		$key = 'qrscene_'.$qrcode;
		Session::put('key',$key);
		$mainpage = config('navigation.master.mainpage');

		$register_url = config('platform.url.register').'&redirect_uri='.urlencode($request->url());
		$boards = $this->getBoardConfig();

		$components = $this->getComponentConfig();
		$libraries = $this->getLibrariyConfig();

		$first_visit = 1;
		if (empty($_COOKIE['first_visit'])) {
			$has_visit = 0;
		}
		setcookie('first_visit', 1);

		return view("index", compact('user', 'mainpage', 'qrcodeurl', 'register_url', 'key', 'boards', 'components', 'libraries', 'first_visit'));
	}

	public function download(Request $request) {
		$key = $request->input('key');
		$filename = "/tmp/build/$key/build.zip";
		//检查文件是否存在
		if (file_exists($filename)) {
			//返回的文件类型
			header("Content-type: application/octet-stream");
			//按照字节大小返回
			header("Accept-Ranges: bytes");
			//返回文件的大小
			header("Accept-Length: " . filesize($filename));
			//这里对客户端的弹出对话框，对应的文件名
			Header("Content-Disposition: attachment; filename=$key.zip");
			//一次只传输1024个字节的数据给客户端
			//打开文件
			$file = fopen($filename, "r");
			$buffer = 1024; //
			//判断文件是否读完
			while (!feof($file)) {
				//将文件读入内存, 每次向客户端回送1024个字节的数据
				echo fread($file, $buffer);
			}
			fclose($file);
		} else {
			echo "<script>alert('对不起，您要下载的文件不存在！');</script>";
		}
	}

	public function build(Request $request) {
		$result = array();
		$code = -1;

		//下载
		$type = 0;

		//代码的字节码
		$source = $request->input('source');
		//用户id
		$user_id = $request->input('user_id');
		//项目名字
		$project = $request->input('project');
		//编译类型
		$build_type = $request->input('build_type');
		//主板类型
		$board = $request->input('board');

		if ($source) {
			// $source = $this->fromCharCode($bytes);
			$keys = $this->getShort($user_id . $project . $board);
			$key = $keys[0];
			$path = "/tmp/build/$key";
			mkdir($path, 0755, true);
			$f = fopen($path . "/$project.ino", "wb");
			fwrite($f, $source);
			fclose($f);

			$cmd = "sh ../app/Build/compiler/$build_type/build.sh $path $board 2>&1";
			$output = array();
			exec($cmd, $output, $code);
			if ($code == 0) {
				$result['msg'] = "编译成功";
				$result['url'] = "/download?key=$key";
			} else {
				$result['msg'] = "编译失败";
				$result['output'] = $output;
			}
		} else {
			$result['msg'] = "非法请求";
		}
		$result['code'] = $code;

		// echo json_encode($result, true);
		return collect($result)->toJson();
	}

	public function config() {
		$config = array(
			'libraries' => $this->getLibrariyConfig(true),
			'boards' => $this->getBoardConfig(true, true),
			'components' => $this->getComponentConfig(true, true),
		);
		
		return collect($config)->toJson();
	}

	public function saveProject(Request $request) {
		$url = config("platform.url.base").config("platform.url.saveProject");
		$params = array(
			'id' => $request->input('id'),
			'project_name' => $request->input('project_name'),
			'project_intro' => $request->input('project_intro'),
			'project_data' => $request->input('project_data'),
			'user_id' => $request->input('user_id'),
			'public_type' => $request->input('public_type'),
		);
		$curl = new Curl();
		return $curl->post($url, $params);
	}

	public function getProject(Request $request, $id) {
		$url = config("platform.url.base").config("platform.url.getProject")."&id=".$id;
		$curl = new Curl();
		return $curl->get($url);
	}

	public function getProjects(Request $request, $user_id) {
		return $this->getUserProjects($user_id);
	}

	public function deleteProject(Request $request) {
		$url = config("platform.url.base").config("platform.url.deleteProject");
		$params = array(
			'id' => $request->input('id'),
		);
		$curl = new Curl();
		return $curl->post($url, $params);
	}

	private function getUserProjects($user_id) {
		$url = config("platform.url.base").config("platform.url.getUserProjects")."&user_id=".$user_id;
		$curl = new Curl();
		return $curl->get($url);
	}

	private function getLibrariyConfig($isDict = false) {
		$libraries = DB::table('libraries')->get();
		if($isDict) {
			$result = array();
			foreach ($libraries as $key => $value) {
				$result[$value->name] = $value;
			}
		} else {
			$result = $libraries;
		}

		return $result;
	}

	private function getBoardConfig($isDict = false, $withPorts = false) {
		$boards = DB::table('boards')->get();
		foreach($boards as $key => $value) {
			$value->in_use = $value->in_use == 1;
			$value->type = "board";
			$value->deletable = false;
			$value->selectable = false;
			$value->source = "assets/images/board/" . $value->name . ".svg";
		}

		if($withPorts) {
			$allPorts = DB::table('ports')->where('owner_type', 1)->get();
			foreach ($boards as $key => $board) {
				$board->ports = array();
				foreach ($allPorts as $k => $port) {
					if($port->owner_id == $board->id) {
						$board->ports[$port->name] = $port;
					}
				}
			}
		}

		if($isDict) {
			$result = array();
			foreach ($boards as $key => $value) {
				$result[$value->name] = $value;
			}
		} else {
			$result = $boards;
		}

		return $result;
	}

	private function getComponentConfig($isDict = false, $withPorts = false) {
		$components = DB::table('components')->get();
		foreach($components as $key => $value) {
			$value->in_use = $value->in_use == 1;
			$value->type = "component";
			$value->deletable = true;
			$value->selectable = true;
			$value->source = "assets/images/component/" . $value->name . ".svg";
			$value->offsetX = 0;
			$value->offsetY = 3;
		}

		if($withPorts) {
			$allPorts = DB::table('ports')->where('owner_type', 0)->get();
			foreach ($components as $key => $component) {
				$component->ports = array();
				foreach ($allPorts as $k => $port) {
					if($port->owner_id == $component->id) {
						$component->ports[$port->name] = $port;
					}
				}
			}
		}

		if($isDict) {
			$result = array();
			foreach ($components as $key => $value) {
				$result[$value->name] = $value;
			}
		} else {
			$result = $components;
		}

		return $result;
	}

	private function fromCharCode($codes) {
		if (is_scalar($codes)) {
			$codes = func_get_args();
		}

		$str = '';
		foreach ($codes as $code) {
			$str .= chr($code);
		}

		return $str;
	}

	private function getQrcodeurl($key = '')
    {

        $url = config('weixin.qrcode.url');
        $url .="$key";
        $curl = new Curl();
        $qrcodeurl = $curl->get($url);

        return $qrcodeurl;
      //  return $userData;
    }

    //生成短url
    //返回：一个长度为4的数组，每个元素为长度为6的字符串
    private function getShort($value) {
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
    	return $result;
    }
}
