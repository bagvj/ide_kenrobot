<?php

namespace App\WebAuth;

use Curl\Curl;

/**
* 
*/
class SnsAuth implements WebAuth
{

	protected $user = null;
	
	function __construct()
	{
		# code...
	}

	/**
	 * 
	 */
	public function user()
	{
		return $this->user;
	}

	/**
	 * @return bool
	 */
	public function validate(array $credentials)
	{
		$email = $credentials['email'];
		$password = $credentials['password'];

		if (empty($email) || empty($email)) {
			return false;
		}

		$userData = $this->validateSnsUser($email,$password);
		if ($userData !== null) {
			$userData = $this->transformUserData($userData);
			if ($userData != null) {
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

       $userdata['uid'] = $rawuserdata['uid'];
       $userdata['name'] = $rawuserdata['uname'];
       $userdata['email'] = $rawuserdata['email'];
       $userdata['avatar_url'] = isset($rawuserdata['avatar_big']) ? $rawuserdata['avatar_big'] : '';
       return $userdata;
    }




	/**
     * 验证sns账号 账号密码
     * 
     * @param string $email
     * @param string $password
     * 
     * @return bool
     */
    protected function validateSnsUser($email,$password){

        $url = config('sns.validate.url');
        $referer = config('sns.validate.referer');
        $key = config('sns.key');

        $curl = new Curl();
        $curl->setReferrer($referer);

        $data = $curl->post($url,[
            'email' => $email,
            'password' => $password
            ]);
       
        $userData = json_decode($data,true);
        return $userData;
    }

}