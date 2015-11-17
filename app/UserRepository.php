<?php

namespace App;

/**
* 
*/
class UserRepository
{
	
	function __construct()
	{
		
	}

	/**
	 * 获取用户
	 */
	public function getUser($id)
	{
		return User::find($id);
	}

	/**
	 * 根据OpenId获取用户,微信接口调用
	 *
	 * @param string $openid
	 * @return User | null
	 */
	public function getUserByOpenId($openid)
	{
		if (empty($oepnid)) {
			return null;
		}
		$user = User::where('oepnid',$oepnid)->first();
	}


	/**
	 * 根据uid获取用户 针对来源是SNS的用户
	 *
	 */
	public function getUserByUid($uid)
	{
		if (empty($uid)) {
			return null;
		}
		$user = User::where('uid',$uid)->first();
	}

	/**
	 * 创建用户
	 * 
	 * @param array $userData
	 * @return $user | null
	 */
	public function create(array $userData)
	{
		//提取字段
		$userData = array_only($userData,['name', 'email', 'password','uid','openid','avatar_url','source']);
		//加密
		$userData['password'] = bcrypt($userData['password']);

		return User::create($userData);
	}

	/**
	 * 创建SNS用户
	 */
	public function createFromSns(array $userData)
	{
		$newuserData = [];
		$newuserData['name'] = $userData['name'];
		$newuserData['email'] = $userData['email'];
		$newuserData['uid'] = $userData['uid'];
		$newuserData['openid'] = '';
		$newuserData['avatar_url'] = $userData['avatar_url'];
		$newuserData['password'] = $userData['email'].$userData['uid'];
		$newuserData['source'] = 'sns';
		return $this->create($newuserData);
	}


	/**
	 * 创建微信用户
	 */
	public function createFromWeixin(array $userData)
	{
		$newuserData = [];
		$newuserData['name'] = $userData['name'];
		$newuserData['email'] = $userData['openid'].'@kenrobot.com';
		$newuserData['uid'] = 0;
		$newuserData['openid'] = $user['openid'];
		$newuserData['avatar_url'] = $userData['avatar_url'];
		$newuserData['password'] = $userData['openid'];
		$newuserData['source'] = 'weixin';
		return $this->create($newuserData);
	}







}