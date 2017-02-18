<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use App\WebAuth\Broker;
use App\WebAuth\UserService;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;


    protected $user;

    protected $userService = null;

    protected $broker = null;

    public function __construct(UserService $userService, Broker $broker)
    {
        $this->userService = $userService;
        $this->broker = $broker;
    }


    public function apiReturn($status, $message, $data = null)
    {
        if (!isset($data)) {
            return response()->json(compact('status', 'message'));
        }
        return response()->json(compact('status', 'message', 'data'));
    }


    public function currentUser()
    {
        $userinfo = $this->broker->userinfo();

        if (isset($this->user)) {
            return $this->user;
        }
        
        if (isset($userinfo['status']) && $userinfo['status'] == 0) {
            $this->user =$this->userService->mapDataToUser($userinfo['data']);
            return $this->user;
        }
        return null;
    }

    public function attachSession()
    {
        if ($this->broker->isAttached()) {
            return null;
        }
        $url = $this->broker->getAttachUrl(['return_url' => \Request::url()]);
        return redirect($url, 307);
    }
}
