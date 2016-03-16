<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\WebAuth\Factory as WebAuthFactory;
use App\WebAuth\Helper as WebAuthHelper;

use Auth;


class WebAuthController extends Controller
{
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

    /**
     * 微信扫描登录
     * @return \Illuminate\Http\Response
     */
    public function weixinLogin(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();
            return response()->json(['code' => 1, 'message' => '已经登录', 'data' => $user]);
        }


        $weixinauth = WebAuthFactory::create('weixin');
        $crendentials = $request->only('key');

        $loginResult = $weixinauth->validate($crendentials);

        if ($loginResult === false) {
            return response()->json(['code' => 2, 'message' => '登录失败']);
        }

        $user = $weixinauth->localUser();

        if (Auth::check()) {
            Auth::logout();
        }
        Auth::login($user,false);
        return response()->json(['code' => 0, 'message' => '登录成功','data' => $user]);
    }

}
