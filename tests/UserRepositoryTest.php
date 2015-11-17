<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\UserRepository;

class UserRepositoryTest extends TestCase
{
    /**
     * A basic test example.
     * @dataProvider userProvider
     * @return void
     */
    public function testCreateUser($userData)
    {
    	$user = new UserRepository();

    	$userEntity = $user->create($userData);
        $this->assertEquals($userEntity->name,$userData['name']);
        $this->assertEquals($userEntity->email,$userData['email']);
       //  $this->assertEquals($userEntity->password,$userData['password']);
       // $this->assertEquals($userEntity->password,bcrypt($userData['password']));
        // 删除测试数据
        $userEntity->delete();
    }

    /**
     * 用户数据Provider
     */
    public function userProvider(){
    	$faker = Faker\Factory::create();
    	return [
    				[
				    	[
				    		'name' => $faker->name,
				    		'uid'  => $faker->randomDigit,
				    		'openid' => $faker->uuid,
				    		'password' => $faker->password,
				    		'email'	=> $faker->email,
                            'avatar_url' => $faker->imageUrl(),
                            'source'    => 'fake',
				       	],
		   			],
       			];
    }

  
}
