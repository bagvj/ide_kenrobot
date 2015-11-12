<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Auth;
use Session;
use App\User;
use Curl\Curl;

class SnsAuthController extends Controller
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
    public function getLogin(Request $request)
    {
        $uid = $request->input('uid');
        $token = $request->input('token');

        

        $data = $this->getUserinfo($token);

        dd($data);
        
        return $data;         
        if (!empty($uid)) {
            $data['uid'] = $uid;
        }

        $user = $this->getUser($data);
        if ($user == null) {
           $user = $this->createUser($data);
        }

        Auth::login($user,true);
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
        if ($data == 'fail') {
            return false;
        }else{
            $userData = json_decode($data,true);
            return $userData;
        }
    }


    private function getUserinfo($token = '')
    {

        $url = config('sns.userinfo.url');
        $referer = config('sns.userinfo.referer');
        $key = config('sns.key');

        $curl = new Curl();
        $curl->setReferrer($referer);
        $data = $curl->post($url,[
            'key' => $key,
            'token' => $token
            ]);
        $userData = json_decode($data,true);

        return $userData;
    }


    private function getFakeUserinfo($token = '')
    {
        $name = str_random();

        return ['name' => $name,
                'email' => $name.'@qq.com',
                'password' => $name,
                'uid'   => rand(1,99999)
        ];
    }


    /**
     * 获取本地用户
     */
    private function getUser($data = array()){
        if (!isset($data['uid'])) {
            return null;
        }

        $user = User::where('uid',$data['uid'])->first();
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
            'uid'   => $data['uid'],
            'source'   => 'sns'
        ]);
    }



}
