<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\WebAuth\Broker;
use App\WebAuth\ApiProxy;
use Url;
use Cache;
use Carbon\Carbon;
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
        $username = $request->input('username');
        $password = $request->input('password');

        $result =  $this->broker->login($username, $password, 'sns');

        if ($result['status'] != 0) {
            return $this->apiReturn($result['status'], $result['message']);
        }
        $user = $this->currentUser();
        if (empty($user)) {
            return $this->apiReturn(-2, '登录失败');
        }

        return $this->apiReturn(0, '登录成功', $user);
    }


    public function weixinlogin(Request $request)
    {
        $ori_login_key = Cache::get('login_key');
        $login_key = $request->input('login_key');
        if (empty($ori_login_key) || empty($login_key)) {
            return $this->apiReturn(-3, 'login_key 过期，请刷新重试！');
        }

        $result = $this->broker->loginWeixin($login_key);
        if ($result['status'] != 0) {
            return $this->apiReturn($result['status'], $result['message']);
        }

        $user = $this->currentUser();
        if (empty($user)) {
            return $this->apiReturn(-2, '登录失败');
        }

        return $this->apiReturn(0, '登录成功', $user);
    }

    /**
     * 获取微信二维码
     */
    public function weixinQrcode(Request $request)
    {
        $refresh = $request->input('refresh');
        $login_key = Cache::get('login_key');

        if ($refresh || empty($login_key)) {

            $apiproxy = new ApiProxy('ide', 'ide');
            $result = $apiproxy->weixinScan();
            if ($result['status'] != 0) {
                return $this->apiReturn($result['status'], $result['message']);
            }
            $expire_seconds = $result['data']['expire_seconds'];
            $login_key = $result['data']['login_key'];
            Cache::put('login_key', $login_key, Carbon::now()->addSeconds($expire_seconds));
            Cache::put('login_data', json_encode($result['data']), Carbon::now()->addSeconds($expire_seconds));
        }

        $login_data = Cache::get('login_data');
        $login_data = json_decode($login_data);

        return $this->apiReturn(0, '获取成功', $login_data);
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

    public function register(Request $request) {
        $email = $request->input('email');
        $username = $request->input('username');
        $password = $request->input('password');
        //注册成功后是否登录
        $login = $request->input('login', false);

        //测试代码
        if ($login) {
            return $this->apiReturn(0, '注册成功', [
                'name' => $username,
                'avatar_url' => '',
                'uid' => 999,
                'user_id' => 999,
            ]);
        }

        return $this->apiReturn(0, '注册失败');
    }
}
