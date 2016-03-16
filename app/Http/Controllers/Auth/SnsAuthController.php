<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\WebAuth\Factory as WebAuthFactory;
use Auth;
use Illuminate\Http\Request;

use App\WebAuth\Helper as WebAuthHelper;

class SnsAuthController extends Controller {


	/**
	 * 使用sns账号密码登录
	 */
	public function snsPostLogin(Request $request) 
	{
		$crendentials = $request->only('email', 'password');
		
		$snsauth = WebAuthFactory::create('sns');
		$loginResult = $snsauth->validate($crendentials);

		if ($loginResult === false) {
			return response()->json(['code' => $snsauth->getErrorCode(), 'message' => $snsauth->getError()]);
		}

		$user = $snsauth->localUser();
		//成功后，先调用退出
		Auth::logout();
		Auth::login($user, true);

		//kenrobot_id cookie
		$kenrobot_id = WebAuthHelper::encryptKenrobotId($user->uid);
		return response()->json(['code' => 0, 'message' => '登录成功'])->withCookie(cookie('kenrobot_id', $kenrobot_id));
	}
}
