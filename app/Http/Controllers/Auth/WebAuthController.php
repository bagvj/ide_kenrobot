<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\WebAuth\Factory as WebAuthFactory;
use App\WebAuth\Helper as WebAuthHelper;

use Auth;
use App\User as UserModel;


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
            return response()->json(['status' => $snsauth->getErrorCode(), 'message' => $snsauth->getError()]);
        }

        $user = $snsauth->localUser();
        
        //成功后，先调用退出
        Auth::logout();
        Auth::login($user, true);

        //kenrobot_id cookie
        $kenrobot_id = WebAuthHelper::encryptKenrobotId($user->uid);
        $userinfo = array_only($user->toArray(), ['id', 'name', 'avatar_url']);
        return response()->json(['status' => 0, 'message' => '登录成功', 'data' => $userinfo])->withCookie(cookie('kenrobot_id', $kenrobot_id));
    }

    /**
     * 微信扫描登录
     * @return \Illuminate\Http\Response
     */
    public function weixinLogin(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();
            $userinfo = array_only($user->toArray(), ['id', 'name', 'avatar_url']);
            return response()->json(['status' => 1, 'message' => '已经登录', 'data' => $userinfo]);
        }

        $weixinauth = WebAuthFactory::create('weixin');
        $crendentials = $request->only('key');

        $loginResult = $weixinauth->validate($crendentials);

        if ($loginResult === false) {
            return response()->json(['status' => 2, 'message' => '登录失败']);
        }

        $user = $weixinauth->localUser();

        if (Auth::check()) {
            Auth::logout();
        }
        Auth::login($user,false);

        //kenrobot_id cookie
        $kenrobot_id = WebAuthHelper::encryptKenrobotId($user->uid);
        $userinfo = array_only($user->toArray(), ['id', 'name', 'avatar_url']);
        return response()->json(['status' => 0, 'message' => '登录成功', 'data' => $userinfo])->withCookie(cookie('kenrobot_id', $kenrobot_id));
     }

    public function check()
    {
        if (Auth::check()) {
            $user = Auth::user();
            $userinfo = array_only($user->toArray(), ['id', 'name', 'avatar_url']);
            return response()->json(['status' => 0, 'message' => '已经登录', 'user' => $userinfo]);
        }
        return response()->json(['status' => -1, 'message' => '未登录']);
    }
}
