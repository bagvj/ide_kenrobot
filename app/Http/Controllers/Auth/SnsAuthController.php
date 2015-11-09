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

        $data = $this->getUserinfo();
            
        if (!empty($uid)) {
            $data['uid'] = $uid;
        }

        $user = $this->getUser($data);
        if ($user == null) {
           $user = $this->createUser($data);
        }

        Auth::login($user);


        dd(Auth::user());


    }

    private function getUserinfo($token = '')
    {
        $name = str_random();
        return ['name' => $name,
                'email' => $name.'@qq.com',
                'password' => $name,
                'uid'   => rand(1,99999)
            ];

        $url = 'http://localhost:9003/index.php?app=public&mod=Platform&act=userinfo';
        // $url = 'http://www.baidu.com';
        // $url = 'http://localhost:9003/index.php?app=public&mod=Register&act=wxBind';
        $referer = 'http://localhost:9003';
        $key = 'paltform_43fda8dsafjakfdj';

        $curl = new Curl();
        $curl->setReferrer($referer);

        // $data = $curl->post($url,[
        //     'key' => $key,
        //     'token' => $token
        //     ]);
        $data = $curl->get($url);

        return $data;
    }



    private function getUser($data = array()){

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
