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

	public function index() {
		if (Auth::check()) {
			$user = Auth::user();
		}

		return view('index', compact('user'));
	}

	public function index2() {
		$qrcode = rand(70000,80000);
		$qrcodeurl = $this->getQrcodeurl($qrcode);
		$key = 'qrscene_'.$qrcode;
		Session::put('key',$key);

		$url = config('weixin.userinfo.url')."?key=$key";
		$libraries = $this->getLibrariyConfig();

		return view("index2", compact('qrcodeurl','key', 'libraries'));
	}

	public function download(Request $request) {
		$time = $request->input('time');
		$projectName = $request->input('proj');
		$path = "/tmp/build$time$projectName.tmp/";
		$srcName = $path . "$projectName.cpp";
		$hexName = $path . "$projectName.hex";
		// $binName = $path."$projectName.bin";
		// if(!file_exists($srcName) || !file_exists($hexName) || !file_exists($binName)){
		if (!file_exists($srcName) || !file_exists($hexName)) {
			//C代码文件或者编译出来的hex文件不存在
			header("content-type=text/html,charset=utf-8");
			die("非法请求");
		}

		//打包
		$zipName = $path . "$projectName-" . date("YmdHis", $time / 10000) . ".zip";
		$zip = new ZipArchive();
		if ($zip->open($zipName, ZipArchive::CREATE) === TRUE) {
			$zip->addFile($srcName, basename(($srcName)));
			$zip->addFile($hexName, basename($hexName));
			// $zip->addFile($hexName, basename($binName));
			$zip->close();
		}

		$filename = $zipName;
		//检查文件是否存在
		if (file_exists($filename)) {
			//返回的文件类型
			header("Content-type: application/octet-stream");
			//按照字节大小返回
			header("Accept-Ranges: bytes");
			//返回文件的大小
			header("Accept-Length: " . filesize($filename));
			//这里对客户端的弹出对话框，对应的文件名
			Header("Content-Disposition: attachment; filename=" . basename($filename));
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

			// $headers = array();
			// $headers['Content-type'] = "application/octet-stream";
			// $headers['Accept-Ranges'] = "bytes";
			// $headers['Accept-Length'] = filesize($filename);
			// $headers['Content-Disposition'] = "attachment; filename=".basename($filename);

			// return response()->download($filename, basename($filename), $headers);
		} else {
			echo "<script>alert('对不起，您要下载的文件不存在！');</script>";
		}
	}

	public function build(Request $request) {
		$result = array();
		$code = -1;

		//下载
		$type = 0;
		//直接烧写
		// $type = 1;

		//代码的字节码
		$bytes = $request->input('source');
		//编译类型
		$buildType = $request->input('buildType');
		//项目名字
		$projectName = $request->input('projectName');

		if ($bytes) {
			$source = $this->fromCharCode($bytes);
			$time = microtime(true) * 10000;
			$path = "/tmp/build$time$projectName.tmp";
			mkdir($path);
			$f = fopen($path . "/$projectName.cpp", "wb");
			fwrite($f, $source);
			fclose($f);

			$cmd = "sh ../app/Build/compiler/$buildType/build.sh $projectName $time 2>&1";
			$output = array();
			exec($cmd, $output, $code);
			if ($code == 0) {
				$result['msg'] = "编译成功";
				if ($type == 0) {
					//下载
					$result['url'] = "/download?proj=$projectName&time=$time";
				} else {
					//直接烧写
					$cmd = "sh ../app/Build/flashburn.sh $projectName $time";
					$output = array();
					exec($cmd, $output, $code);
					if ($code == 0) {
						$result['msg'] = "烧写成功";
					} else {
						$result['msg'] = "烧写失败";
					}
				}
			} else {
				$result['msg'] = "编译失败";
				// $result['output'] = $output;
			}
		} else {
			$result['msg'] = "非法请求";
		}
		$result['code'] = $code;

		// echo json_encode($result, true);
		return collect($result)->toJson();
	}

	//平台建议&BUG反馈
	public function feedback(Request $request) {
		$feedback = Feedback::create([
			'nickname' => $request->input('nickname'),
			'contact' => $request->input('contact'),
			'content' => $request->input('content'),
			'create_time' => time(),
		]);
	}

	public function items() {
		$config = $this->getItemConfig();
		return collect($config)->toJson();
	}

	public function config() {
		$defaultCode = "void setup() {\n  // put your setup code here, to run once:\n\n}\n\nvoid loop() {\n  // put your main code here, to run repeatedly:\n\n}";

		$config = array(
			'defaultCode' => $defaultCode,
			'libraries' => $this->getLibrariyConfig(),
		);
		
		return collect($config)->toJson();
	}

	public function saveProject(Request $request) {
		$data = $request->input('data');
		$user_id = $request->input('user_id');

		$result = array();
		if($data && $user_id) {
			$project = Project::where('user_id', $user_id)->first();
			$time = time();
			if($project) {
				$project->data = $data;
				$project->update_at = $time;
				$project->save();
			} else {
				$project = Project::create([
					'data' => $data,
					'user_id' => $user_id,
					'create_at' => $time,
					'update_at' => $time,
				]);
			}
			
			$result['msg'] = "保存成功";
			$result['code'] = 0;
		} else {
			$result['msg'] = "非法请求";
			$result['code'] = -1;
		}
		
		return collect($result)->toJson();
	}

	public function getProject(Request $request, $id) {
		if($id == 0) {
			$project = DB::table('projects')->orderBy('id', 'desc')->first();
		} else {
			$project = DB::table('projects')->where('id', $id)->get();
		}
		return collect($project)->toJson();
	}

	private function getItemConfig() {
		$modules = DB::table('modules')->get();
		$hardwares = DB::table('hardwares')->get();
		$softwares = DB::table('softwares')->get();
		$params = DB::table('params')->get();

		foreach ($modules as $key => $value) {
			$modules[$value->id] = $value;
		}
		$hardwareArray = array();
		foreach ($hardwares as $key => $value) {
			if ($value->in_use) {
				$value->module = $modules[$value->module_id]->name;
				$value->in_use = $value->in_use == 1;
				$value->deletable = $value->deletable == 1;
				$value->is_controller = $value->is_controller == 1;
				$value->need_pin_board = $value->need_pin_board == 1;
				$value->need_drive_plate = $value->need_drive_plate == 1;
				$value->textVisible = false;
				$value->angle = 0;
				$value->source = "assets/images/hardware/" . $value->name . ".png";
				$value->location = "0 0";

				$hardwareArray[$value->name] = $value;
			}
		}

		$paramGroups = array();
		foreach ($params as $key => $value) {
			$software_id = $value->software_id;
			$value->is_init = $value->is_init == 1;
			$value->auto_set = $value->auto_set == 1;
			$value->is_input = $value->is_input == 1;
			if (!isset($paramGroups[$software_id])) {
				$paramGroups[$software_id] = array();
			}
			$paramGroups[$software_id][] = $value;
		}
		$softwareArray = array();
		foreach ($softwares as $key => $value) {
			if ($value->in_use) {
				$software_id = $value->id;
				$value->init_params = array();
				$value->params = array();
				if (isset($paramGroups[$software_id])) {
					$params = $paramGroups[$software_id];
					foreach ($params as $k => $param) {
						if ($param->is_init) {
							$value->init_params[] = $param;
						} else {
							$value->params[] = $param;
						}
					}
				}
				if ($value->tag >= 4) {
					$value->source = "assets/images/hardware/" . $value->name . "-small.png";
				} else {
					$value->source = "assets/images/software/" . $value->name . ".png";
				}
				$value->in_use = $value->in_use == 1;
				$value->deletable = $value->deletable == 1;
				$value->location = "0 0";
				$value->textVisible = $value->tag < 4;
				$value->angle = 0;

				$softwareArray[$value->name] = $value;
			}
		}

		return array(
			'hardwares' => $hardwareArray,
			'softwares' => $softwareArray,
		);
	}

	private function getLibrariyConfig() {
		return DB::table('libraries')->get();
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
}
