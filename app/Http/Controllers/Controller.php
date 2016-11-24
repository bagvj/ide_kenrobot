<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use App\WebAuth\Broker;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    protected $user;
    public function apiReturn($status, $message, $data = null)
    {
        if (!isset($data)) {
            return response()->json(compact('status', 'message'));
        }
        return response()->json(compact('status', 'message', 'data'));
    }

    public function currentUser()
    {
        $broker = new Broker();
        $userinfo = $broker->userinfo();
        if (isset($this->user)) {
            return $this->user;
        }
        if ($userinfo['status'] == 0) {
            $this->user = [
                'name' => $userinfo['data']['base_nickname'],
                'avatar_url' => $userinfo['data']['base_avatar'],
                'uid' => $userinfo['data']['user_id'],
            ];
            return $this->user;
        }
        return null;
    }
}
