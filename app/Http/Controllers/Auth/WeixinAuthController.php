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
        $this->redirectPath = '/';
        $this->loginPath = '/auth/snslogin';        
    }

 



    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function weixinLogin(Request $request)
    {
        $key = $request->input('key');

        

        $data = $this->getUserinfo($key);

        if ($data == null) {
            return redirect('/');//跳转根目录
        }

        $user = $this->getUser($userInfo);
        if ($user == null) {
           $user = $this->createUser($userInfo);
        }
        Auth::login($user,true);
        return redirect('/');

    }

    /**
     * 验证sns账号密码
     */
    private function validateSnsUser($email,$password){

        $url = config('sns.validate.url');
        // $url = 'http://localhost:8800/N1CwG46Ml';
        $referer = config('sns.validate.referer');
        $key = config('sns.key');


        // echo $url,$referer,$key;

        $curl = new Curl();
        $curl->setReferrer($referer);

        $data = $curl->post($url,[
            'key' => $key,
            'email' => $email,
            'password' => $password
            ]);
       
            $userData = json_decode($data,true);
            return $userData;
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

    }


    private function getUserinfo($key = '')
    {

        $url = config('weixin.userinfo.url');
        $url .="?key=$key";

        $curl = new Curl();
        $data = $curl->get($url);
        $userData = json_decode($data,true);
        return $this->wrapUserinfo($userData);
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
