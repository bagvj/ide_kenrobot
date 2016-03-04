<?php

namespace App\WebAuth;

use Curl\Curl;
 
/**
* 
*/
class SnsAuth implements WebAuth
{

    /**
     * @var Curl/Curl
     */
    protected $curl;

    /**
     * user data
     */
    protected $user = null;

    //protected $api_valid = 'http://mars.kenrobot.com/?app=api&mod=UserCenter&act=validate';

    //protected $api_user = 'http://mars.kenrobot.com/?app=api&mod=UserCenter&act=baseinfo';

    protected $api_valid = '';

    protected $api_user = '';

    protected $errorcode = -1;
        
    /**
     * SNS验证调用网址
     */
    protected $snshost;

    function __construct()
    {
        $this->curl = new Curl();
        $this->api_valid = env('SNS_API_VAlID');
        $this->api_user = env('SNS_APID_USER');
    }

    /**
     * 获取用户信息
     *
     */
    public function user()
    {
        return $this->user;
    }

    /**
     * 获取用户数据
     * 封装的不好，这只是个临时的方法
     */
    public function fetchUserFromServer($uid = 0)
    {
        $token = array('uid' => $uid);
        $userResult = $this->getUserFromServer($token);

        if ($userResult['code'] != 0) {
            $this->error = sprintf('%s:%s', $result['code'], $result['message']);
            return false;
        }

        $this->user = $this->formatUserData($userResult['data']);;
        return $this->user;
    }

    /**
     * 验证
     *
     * @param array $credentials 凭据
     * 
     * @return bool
     */
    public function validate(array $credentials)
    {

        $this->error = '';

        $email = $credentials['email'];
        $password = $credentials['password'];

        if (empty($email) || empty($password)) {
            $this->error = '账号密码不能为空';
            return false;
        }

        $result = $this->validUserFromServer($email,$password);

        //远端验证失败
        if ($result['code'] != 0) {
            $this->error = sprintf('%s',$result['message']);
            $this->errorcode = $result['code'];
            return false;
        }

        $token = $result['token'];
        $userResult = $this->getUserFromServer($token);

        if ($userResult['code'] != 0) {
            $this->error = sprintf('%s', $result['message']);
            return false;
        }

        $this->user = $this->formatUserData($userResult['data']);;
        $this->errorcode = 0;
        return true;
    }

    /**
     * 获取调用错误
     */
    public function getError()
    {
        return $this->error;
    }

    public function getErrorCode()
    {
        return $this->errorcode;
    }

    /**
     * 格式化用户数据
     *
     * @param array $rawuserdata 用户数据
     *
     */
    protected function formatUserData($rawuserdata)
    {
       if (empty($rawuserdata)) {
           return null;
       }

       $userdata = [];

       $userdata['uid'] = $rawuserdata['uid'];
       $userdata['name'] = !empty($rawuserdata['uname']) ? $rawuserdata['uname'] : '';
       $userdata['email'] = !empty($rawuserdata['email']) ? $rawuserdata['email'] : '';
       $userdata['avatar_url'] = isset($rawuserdata['avatar_original']) ? $rawuserdata['avatar_original'] : '';
       empty($userdata['avatar_url']) && $userdata['avatar_url'] ='/assets/images/default_portrait.png';
       return $userdata;
    }




    /**
     * 验证sns账号 账号密码
     * 
     * @param string $email
     * @param string $password
     * 
     * @return array
     */
    protected function validUserFromServer($email,$password)
    {
        $result = $this->curl->post($this->api_valid,[
            'email' => $email,
            'password' => $password
            ]);
       
        return json_decode($result,true);
    }

    /**
     * Sns服务器中获取用户
     */
    public function getUserFromServer($params)
    {
        $result = $this->curl->post($this->api_user.'&'.http_build_query($params));

        return json_decode($result,true);
    }

}