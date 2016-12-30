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
use Maatwebsite\Excel\Facades\Excel;
use App\Project\Repository;


class HomeController extends Controller {

	public function index(Request $request) {
		$attachSession = $this->attachSession();
		if ($attachSession) {
			return $attachSession;
		}

		$user = $this->currentUser();
		

		$qrcode = rand(70000,80000);
		$qrcodeurl = $this->getQrcodeurl($qrcode);
		$key = 'qrscene_'.$qrcode;
		Session::put('key',$key);
		$mainpage = config('platform.url.mainpage');

		$register_url = config('platform.url.register').'&redirect_uri='.urlencode($request->url());
		$find_password_url = config('platform.url.find_password');

		$boards = Repository::getBoards();
		$components = Repository::getComponents();
		$libraries = Repository::getLibraries();
		$exampleGroups = Repository::getExamples(false, true);

		$setting = $this->getSetting();
		$has_visit = !empty($_COOKIE['has_visit']);

		return view("index", compact('user', 'mainpage', 'qrcodeurl', 'register_url', 'find_password_url', 'key', 'boards', 'components', 'libraries', 'exampleGroups', 'has_visit', 'setting'));
	}

	public function editor(Request $request) {
		$option_names = array("theme", "author", "init_code");
		$options = array();

		foreach ($option_names as $name) {
			$option = $request->input($name);
			isset($option) && ($options[$name] = $option);
		}
		$default_options = array(
			"init_code" => true,
			"theme" => "default",
		);
		$options = json_encode(array_merge($default_options, $options), JSON_FORCE_OBJECT);

		return view("editor", compact("options"));
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

	private function getSetting() {
		if(!isset($_COOKIE['setting'])) {
			return config('platform.setting');
		}

		$setting;
		try {
			$setting = json_decode($_COOKIE['setting'], true);
		} catch(Exception $ex) {
			$setting = config('platform.setting');
		}

		return $setting;
	}
}
