<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HelpController extends Controller {

	public function __construct()
	{
	}

	public function index(Request $request, $uri = '') {
		if(!empty($uri) && view()->exists("help.$uri")) {
			return view("help.$uri");
		} else {
			return redirect('/');
		}
	}
}