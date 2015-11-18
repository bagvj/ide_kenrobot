<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Auth;
use Session;
use App\User;
use Curl\Curl;

class WeixinAuthController extends Controller
{
     /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct()
    {
      //  $this->middleware('guest', ['except' => 'getLogout']);
        //跳转路径
        $this->redirectPath = '/';
        //登录路径
        $this->loginPath = '/login';        
    }

    public function homeIndex()
    {
        $qrcode = rand(70000,80000);
        $qrcodeurl = $this->getQrcodeurl($qrcode);
        $key = 'qrscene_'.$qrcode;
        Session::put('key',$key);

        $url = config('weixin.userinfo.url')."?key=$key";

        $nav = config('navigation.master');
        if (Auth::check()) {
            $user = Auth::user();
        }
    
        return view('index',compact('user','qrcode','qrcodeurl','key','nav'));
    }

 
    /**
     * 生成qrcode,获取二维码，这部分不应该写在这里，应该放到Weixin目录下
     * 同时，qrcode的划分要有一个详细的配置
     *
     */
    public function index()
    {
        $qrcode = rand(70000,80000);
        $qrcodeurl = $this->getQrcodeurl($qrcode);
        $key = 'qrscene_'.$qrcode;
        Session::put('key',$key);

        $url = config('weixin.userinfo.url')."?key=$key";
        return view('auth.authlogin',compact('qrcode','qrcodeurl','key'));
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function weixinLogin(Request $request)
    {
        $key = $request->input('key');
        if (Auth::check()) {
            return response()->json(['code' => 1, 'message' => '已经登录']);

        }

        // $key = Session::get('key');
        $userInfo = $this->getUserinfo($key);
        
        if ($userInfo == null) {
            return response()->json(['code' => 2, 'message' => '登录失败']);

        }

        $user = $this->getUser($userInfo);
        if ($user == null) {
           $user = $this->createUser($userInfo);
        }
        if (Auth::check()) {
            Auth::logout();

        }
        Auth::login($user,false);
        return response()->json(['code' => 0, 'message' => '登录成功']);


    }

   

    private function wrapUserinfo($userInfo)
    {
       if (empty($userInfo)) {
           return null;
       }
       $userdata = [];
       $userdata['openid'] = $userInfo['openid'];
       $userdata['name'] = $userInfo['nickname'];
       $userdata['email'] = $userInfo['openid'].'@kenrobot.com';
       $userdata['avatar_url'] = $userInfo['headimgurl'];
       return $userdata;
    }


    private function getUserinfo($key = '')
    {
        $key = $key;
        $url = config('weixin.userinfo.url');
        $url .="?key=$key";
        $curl = new Curl();
        $data = $curl->get($url);
        $userData = json_decode($data,true);
        return $this->wrapUserinfo($userData);
      //  return $userData;
    }

    private function getQrcodeurl($key = '')
    {

        $url = config('weixin.qrcode.url');
        $url .="$key";
        $curl = new Curl();
        $qrcodeurl = $curl->get($url);

        return $qrcodeurl;
      //  return $userData;
    }



    /**
     * 获取本地用户
     */
    private function getUser($data = array()){
        if (!isset($data['openid'])) {
            return null;
        }

        $user = User::where('openid',$data['openid'])->first();
        return $user;
    }


    /**
     * 创建用户
     */
    private function createUser($data = array())
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['email'].'321'),
            'openid'   => $data['openid'],
            'avatar_url' => $data['avatar_url'],
            'source'   => 'weixin'
        ]);
    }


}
