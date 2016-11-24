<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\WebAuth\Broker;
use Url;
/**
* 用户登录
*/
class AuthController extends Controller
{
    private $broker = null;

    function __construct()
    {
        $this->broker = new Broker();
    }

    public function attach(Request $request)
    {
        if ($this->broker->isAttached()) {
            return $this->apiReturn(0, '绑定成功');
        }
        $url = $this->broker->getAttachUrl(['return_url' => $request->url()]);
        return redirect($url, 307);
    }

    public function login(Request $request)
    {
        // $username = $request->input('username');
        $username = $request->input('email');
        $password = $request->input('password');

        $result =  $this->broker->login($username, $password);
        if ($result['status'] != 0) {
            return $this->apiReturn($result['status'], $result['message']);
        }
        $user = $this->currentUser();
        if (empty($user)) {
            return $this->apiReturn(-2, '登录失败');
        }

        return $this->apiReturn(0, '登录成功', $user);
    }

    public function loginid(Request $request)
    {

    }

    public function weixinlogin(Request $request)
    {
        
    }

    public function userinfo()
    {
        $user = $this->currentUser();
        if (!isset($user)) {
            return $this->apiReturn(-1, '未登录');
        }
        return $this->apiReturn(0,'Ok', $user);
    }

    public function logout()
    {
        $this->broker->logout();
        return redirect('/');
    }
}
