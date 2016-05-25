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
use Excel;

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
		$find_password_url = config('platform.url.find_password');
		$boards = $this->getBoardConfig();

		$components = $this->getComponentConfig();
		$libraries = $this->getLibrariyConfig();

		$has_visit = 1;
		// if (empty($_COOKIE['has_visit'])) {
		// 	$has_visit = 0;
		// }
		// setcookie('has_visit', 1, time() + 86400 * 365, "", ".kenrobot.com");

		return view("index", compact('user', 'mainpage', 'qrcodeurl', 'register_url', 'find_password_url', 'key', 'boards', 'components', 'libraries', 'has_visit'));
	}

	public function config() {
		$config = array(
			'libraries' => $this->getLibrariyConfig(true),
			'boards' => $this->getBoardConfig(true, true),
			'components' => $this->getComponentConfig(true, true),
		);
		
		return collect($config)->toJson();
	}

	public function import() {
		$allComponents = DB::table('components')->get();
		$allBoards = DB::table('boards')->get();

		$result = Excel::load('../config/RoSys.xlsx')->skip(2)->toArray();
		$result = json_decode(json_encode($result));
		foreach($result as $component) {
			$component->label = $component->name;
			$component->name = $component->id;

			$component->width = $component->width != null ? $component->width : 0;
			$component->height = $component->height != null ? $component->height : 0;

			$component->var_name = $component->var_name != null ? $component->var_name : "";
			$component->var_code = $component->var_code != null ? $component->var_code : "";
			$component->head_code = $component->head_code != null ? $component->head_code : "";
			$component->setup_code = $component->setup_code != null ? $component->setup_code : "";

			$component->category = $component->category != null ? $component->category : "default";
			$component->in_use = $component->in_use != null ? $component->in_use : 0;
			$component->is_forward = $component->is_forward != null ? $component->is_forward : 0;
			$component->auto_connect = $component->auto_connect != null ? $component->auto_connect : 0;
			$component->board_type = $component->board_type != null ? $component->board_type : "RoSys";
		}

		foreach($result as $component) {
			$exist = false;
			if($component->type == 1) {
				foreach($allBoards as $board) {
					if($board->name == $component->name) {
						$exist = true;
						break;
					}
				}
				if($exist) {
					DB::table('boards')->where('name', $component->name)->update(array(
						'label' => $component->label,
						'board_type' => $component->board_type,
						'in_use' => $component->in_use,
						'is_forward' => $component->is_forward,
						'width' => $component->width,
						'height' => $component->height,
						'category' => $component->category,
					));
				} else {
					DB::table('boards')->insert(array(
						'name' => $component->name,
						'label' => $component->label,
						'board_type' => $component->board_type,
						'in_use' => $component->in_use,
						'is_forward' => $component->is_forward,
						'width' => $component->width,
						'height' => $component->height,
						'category' => $component->category,
					));
				}
			} else if($component->type == 0) {
				foreach($allComponents as $com) {
					if($com->name == $component->name) {
						$exist = true;
						break;
					}
				}
				if($exist) {
					DB::table('components')->where('name', $component->name)->update(array(
						'label' => $component->label,
						'auto_connect' => $component->auto_connect,
						'in_use' => $component->in_use,
						'width' => $component->width,
						'height' => $component->height,
						'varName' => $component->var_name,
						'varCode' => $component->var_code,
						'headCode' => $component->head_code,
						'setupCode' => $component->setup_code,
						'category' => $component->category,
					));
				} else {
					DB::table('components')->insert(array(
						'name' => $component->name,
						'label' => $component->label,
						'auto_connect' => $component->auto_connect,
						'in_use' => $component->in_use,
						'width' => $component->width,
						'height' => $component->height,
						'varName' => $component->var_name,
						'varCode' => $component->var_code,
						'headCode' => $component->head_code,
						'setupCode' => $component->setup_code,
						'category' => $component->category,
					));
				}
			}
		}
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
		$boards = DB::table('boards')->orderBy('is_forward')->get();
		foreach($boards as $key => $value) {
			$value->in_use = $value->in_use == 1;
			$value->type = "board";
			$value->deletable = false;
			$value->selectable = false;
			$value->source = "assets/image/board/" . $value->name . ".png";
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
			$value->auto_connect = $value->auto_connect == 1;
			$value->type = "component";
			$value->deletable = true;
			$value->selectable = true;
			$value->source = "assets/image/component/" . $value->name . ".png";
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

	private function getQrcodeurl($key = '') {
		$url = config('weixin.qrcode.url');
		$url .="$key";
		$curl = new Curl();
		$qrcodeurl = $curl->get($url);

		$image_data = base64_encode($curl->get($qrcodeurl));
		return "data:image/jpg;base64," . $image_data;
		
		// return $qrcodeurl;
	}
}
