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

class SerialController extends Controller {

	public function __construct()
	{
		$this->middleware('snspassport');
	}

	public function index(Request $request) {
		return view("serial");
	}
}