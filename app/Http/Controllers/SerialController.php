<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SerialController extends Controller {

	public function __construct()
	{
	}

	public function update(Request $request) {
		$content = file_get_contents("../app/Serial/update.xml");
		return response($content)->header('Content-Type', 'text/xml');
	}
}