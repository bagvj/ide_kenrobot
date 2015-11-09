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
        $token = $request->input('token');
        $data = $this->getUserinfo($token);
        dd($data);


    }

    private function getUserinfo($token = '')
    {
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
        var_dump($curl);
        return $data;
    }

}
