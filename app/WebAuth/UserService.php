<?php

namespace App\WebAuth;

class UserService
{
	public function mapDataToUser($userData)
	{
		if (!isset($userData['user_id'])) {
			return null;
		}

		$user = [
                'name' => isset($userData['base_name']) ? $userData['base_name'] : '',
                'avatar_url' => isset($userData['base_avatar']) ? $userData['base_avatar'] : '',
                'uid' => isset($userData['uid']) ? $userData['uid'] : 0,
                'user_id' => $userData['user_id'],
        ];

        return $user;
	}
}