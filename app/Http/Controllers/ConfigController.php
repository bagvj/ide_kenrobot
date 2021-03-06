<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;

use App\Project\Repository;

class ConfigController extends Controller {

	public function index(Request $request) {
		$config = array(
			'libraries' => Repository::getLibraries(true),
			'boards' => Repository::getBoards(true, true),
			'components' => Repository::getComponents(true, true),
		);
		
		return collect($config)->toJson();
	}

	public function example(Request $request) {
		$uuid = $request->input('id');
		$example = DB::table('examples')->where('uuid', $uuid)->first(['name', 'category', 'order', 'uuid']);
		if(!$example) {
			return collect(['error' => 1, '没有该示例'])->toJson();
		}
		
		$path = "examples/" . $example->category . "/" . $example->name . "/" . $example->name . ".ino";
		if(!file_exists($path)) {
			return collect(['error' => 2, '示例代码读取失败'])->toJson();
		}

		$example->id = $example->uuid;
		unset($example->uuid);
		$example->code = file_get_contents($path);

		return collect($example)->toJson();
	}
}