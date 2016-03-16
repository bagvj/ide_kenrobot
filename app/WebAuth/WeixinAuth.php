<?php

namespace App\WebAuth;

use Curl\Curl;
use App\User;
/**
* 
*/
class WeixinAuth implements WebAuth
{

	protected $user;

	protected $url;

	protected $api_user_url;

	protected $api_validate_url;

	protected $curl;

	/**
	 * 用于获取用户信息的凭据
	 */
	protected $token;
	
	function __construct()
	{
		$this->url = config('weixin.userinfo.url');

		$this->api_user_url = '';
		$this->api_validate_url = '';

		$this->curl = new Curl();
	}

    /**
     * 验证是登录是否成功
     *
     * @param array $crendetials
     * @return bool
     */
    public function validate(array $credentials){

        $key = $credentials['key'];
        
        //验证参数条件
        if ($key == null) {
            return false;
        }

        $userData = $this->getUserFromServer($credentials);
        
        if ($userData !== null) {
            $userData = $this->formatUserData($userData);
            if ($userData !== null) {
                $this->user = $userData;
                return true;
            }

        }
        return false;

    }

	/**
	 * 获取用户信息，登录失败的时候返回null
	 * 
	 * @return array | null
	 */
	public function user(){
		return $this->user;
	}

    /**
     * 本地用户
     */
    public function localUser()
    {
        if (empty($this->user) || empty($this->user['openid'])) {
            return null;
        }

        $user = User::where('openid',$this->user['openid'])->first();
        if (!empty($user)) {
            $user->name = $this->user['name'];
            $user->avatar_url = $this->user['avatar_url'];
            $user->save();
        } else {
             $user = User::create([
                'name' => $this->user['name'],
                'email' => $this->user['email'],
                'password' => bcrypt($this->user['email'].'321'),
                'openid'   => $this->user['openid'],
                'avatar_url' => $this->user['avatar_url'],
                'source'   => 'weixin'
            ]);
        }
        
        return $user;
    }


	/**
	 * 格式化数据
	 */
	protected function formatUserData($rawuserdata)
    {
       if (empty($rawuserdata)) {
           return null;
       }

       $userdata = [];

       $userdata['openid'] = $rawuserdata['openid'];
       $userdata['name'] = $rawuserdata['nickname'];
       $userdata['email'] = $rawuserdata['openid'].'@kenrobot.com';
       $userdata['avatar_url'] = $rawuserdata['avatar'];

       return $userdata;
    }

    /**
     * 调用远程验证
     *
     * @param array $crendentials
     *
     * @return array
     */
    protected function validUserFromServer($crendetials)
    {
    	$validate_url = $this->api_validate_url.'?'.http_build_query((array)$crendetials);

    	$return = $this->curl->get($validate_url);



    	return json_decode($return, true);
    }

    /**
     * 远程用户接口
     *
     */
    protected function getUserFromServer($params)
    {
        $data = $this->curl->get($this->url,$params);

        if (is_string($data)) {
            $userData = json_decode($data, true);
        } else {
            $userData = (array) $data;
        }

        return $userData;
    }

}