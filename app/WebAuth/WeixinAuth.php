<?php

namespace App\WebAuth;

use Curl\Curl;

/**
* 
*/
class WeixinAuth implements WebAuth
{

	protected $user;

	protected $url;
	
	function __construct()
	{
		$this->url = config('weixin.userinfo.url');
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

		$userData = $this->getWeixinUser($key);
		
		if ($userData !== null) {
			$userData = $this->transformUserData($userData);
			if ($userData !== null) {
				$this->user = $userData;
				return true;
			}

		}
		return false;

	}


	/**
	 * 
	 */
	protected function transformUserData($rawuserdata)
    {
       if (empty($rawuserdata)) {
           return null;
       }

       $userdata = [];

       $userdata['openid'] = $rawuserdata['openid'];
       $userdata['name'] = $rawuserdata['nickname'];
       $userdata['email'] = $rawuserdata['openid'].'@kenrobot.com';
       $userdata['avatar_url'] = $rawuserdata['headimgurl'];

       return $userdata;
    }

    /**
     * 远程调用
     */
    protected function getWeixinUser($key = '')
    {
        $curl = new Curl();
        $url = $this->url.'?key='.$key;
        $data = $curl->get($url);
        $userData = json_decode($data,true);
        return $userData;
    }

}