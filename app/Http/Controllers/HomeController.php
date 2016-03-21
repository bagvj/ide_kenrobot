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

		$has_visit = 1;
		if (empty($_COOKIE['has_visit'])) {
			$has_visit = 0;
		}
		setcookie('has_visit', 1, null, "", ".kenrobot.com");

		return view("index", compact('user', 'mainpage', 'qrcodeurl', 'register_url', 'key', 'boards', 'components', 'libraries', 'has_visit'));
	}

	public function download(Request $request, $uri, $ext = "zip") {
		$filename = "download/$uri";
		if(file_exists($filename)) {
			$this->doDownload($filename);
		} else {
			$ext = "." . $ext;
			$filename = "/tmp/build/$uri/build$ext";
			$path = dirname($filename)."/.project";
			
			if(!file_exists($path)) {
				$this->fileNotExist();
				return;
			}

			$projectName = file_get_contents($path);
			$this->doDownload($filename, $projectName.$ext);
		}
	}

	public function build(Request $request) {
		$result = array();
		$status = -1;

		//代码的字节码
		$source = $request->input('source');
		//项目名字
		$project_name = $request->input('project_name');
		//编译类型
		$build_type = $request->input('build_type');
		//主板类型
		$board_type = $request->input('board_type');

		if ($source) {
			$uri = $this->getShort();
			$path = "/tmp/build/$uri";
			mkdir($path, 0755, true);
			$f = fopen($path . "/main.ino", "wb");
			fwrite($f, $source);
			fclose($f);

			$cmd = "sh ../app/Build/compiler/$build_type/build.sh $path $board_type $project_name 2>&1";
			$output = array();
			exec($cmd, $output, $status);
			if ($status == 0) {
				$result['message'] = "编译成功";
				$result['url'] = "/download/$uri";
			} else {
				$result['message'] = "编译失败";
				$result['output'] = $output;
			}
		} else {
			$result['message'] = "非法请求";
		}
		$result['status'] = $status;

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

	private function doDownload($filename, $downloadName = null) {
		//检查文件是否存在
		if (file_exists($filename)) {
			$downloadName = isset($downloadName) ? $downloadName : basename($filename);
			//返回的文件类型
			header("Content-type: application/octet-stream");
			//按照字节大小返回
			header("Accept-Ranges: bytes");
			//返回文件的大小
			header("Accept-Length: " . filesize($filename));
			//这里对客户端的弹出对话框，对应的文件名
			Header("Content-Disposition: attachment; filename=$downloadName");
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
		} else {
			$this->fileNotExist();
		}
	}

	private function fileNotExist() {
		echo "<script>alert('对不起，您要下载的文件不存在！');</script>";
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
    private function getShort($value = "") {
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
