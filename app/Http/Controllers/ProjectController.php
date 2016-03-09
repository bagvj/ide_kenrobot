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

	public function __construct()
	{
		$this->middleware('snspassport');
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
}