<?php
namespace App\WebAuth;

/**
* 远程调用第三方的登录接口
*/
interface WebAuth
{
	/**
	 * 获取用户信息，登录失败的时候返回null
	 * 
	 * @return array | null
	 */
	public function user();

	/**
	 * 验证是登录是否成功
	 *
	 * @param array $crendetials
	 * @return bool
	 */
	public function validate(array $credentials);

	/**
	 * 本地用户
	 */
	public function localUser();
}