<?php

return [

    /*
    |--------------------------------------------------------------------------
    | 导航
    |--------------------------------------------------------------------------
    |
    | Most templating systems load templates from disk. Here you may specify
    | an array of paths that should be checked for your views. Of course
    | the usual Laravel view path has already been registered for you.
    |
    */

    'master' => [
        //本站
       'self'       => 'http://www.kenrobot.com/index.php?app=square&mod=Index&act=index',
       //我的主页
       'mainpage'   => 'http://www.kenrobot.com/index.php?app=public&mod=Index&act=allshow',
       //开发
       'develop'    => 'http://platform.kenrobot.com/',
       //广场
       'square'     => 'http://www.kenrobot.com/index.php?app=square&mod=Index&act=listshow',
       //商场
       'market'     => 'http://www.kenrobot.com/index.php?app=shop',
       'register'   => 'http://www.kenrobot.com/index.php?app=public&mod=Register&act=index'
    ],

];
