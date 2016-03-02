<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use App\User;

use App\WebAuth\Factory as WebAuthFactory;
use App\WebAuth\Helper as WebAuthHelper;

class PassportMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $kenrobot_id = $request->cookie('kenrobot_id');
        $kenrobot_id = WebAuthHelper::decryptKenrobotId($kenrobot_id);
        $kenrobot_id = intval($kenrobot_id);

        //kenrobot_id为空，直接返回
        if (empty($kenrobot_id)) {
             return $next($request);
        }

        //如果当前用户已经登录且与kenrobot_id一致，直接返回
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->uid == $kenrobot_id) {
                return $next($request);
            }
        }

        //检查是否有本地用户
        $user = $this->getUser(['uid' => $kenrobot_id]);

        //如果本地用户不存在，查找SNS站点用户信息并注册
        if ($user == null) {
            //未注册同步用户
            $snsauth = WebAuthFactory::create('sns');
            $userInfo = $snsauth->fetchUserFromServer($kenrobot_id);
            if (!empty($userInfo)) {
                $user = $this->createUser($userInfo);
            }
        }

        //如果用户存在或注册成功，可登录
        if ($user !== null) {
            //已登录状态先注销
            if (Auth::check()) {
                Auth::logout();
            }

            Auth::loginUsingId($user->id);
        }

        return $next($request);
    }

    /**
     * 获取本地用户
     * 这个功能应该放在UserRepository里
     */
    private function getUser($data = array()) {
        if (!isset($data['uid'])) {
            return null;
        }

        $user = User::where('uid', $data['uid'])->first();
        return $user;
    }

    /**
     * 创建用户
     * 应该放在UserRepository里面
     */
    private function createUser($data = array()) {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['email'] . '321'),
            'uid' => $data['uid'],
            'avatar_url' => $data['avatar_url'],
            'source' => 'sns',
        ]);
    }


}
