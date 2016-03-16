<?php

use App\WebAuth\SnsAuth;

/**
* 
*/
class SnsTest extends TestCase
{
	public function testAuth()
	{
		$snsauth = new SnsAuth();

		//test 1
		$credentials = array('email' => 'noexist',
							'password' => '123');

		$ret = $snsauth->validate($credentials);
		$this->assertFalse($ret);
		$error = $snsauth->getError();
		$this->assertEquals('-2:帐号不存在', $error);
		$user = $snsauth->user();
		$this->assertNull($user);


		//test 2
		$credentials = array('email' => 'master@thinksns.com',
							'password' => '123456');
		
		$ret = $snsauth->validate($credentials);
		$this->assertTrue($ret);
		$error = $snsauth->getError();
		$this->assertEmpty($error);
		$user = $snsauth->user();
		$this->assertArrayHasKey('uid', $user);


	}
}