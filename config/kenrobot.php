<?php

return [
    
    //用户接口使用
    'api' => [
        'baseUrl'   => env('KENROBOT_API_BASEURL', ''),
        'appId'     => env('KENROBOT_API_APPID', ''),
        'appSecret' => env('KENROBOT_API_APPSECRET', ''),
    ],

    'sso' => [
        'baseUrl'       => env('KENROBOT_SSO_BASEURL', ''),
        'brokerId'      => env('KENROBOT_SSO_BROKERID', ''),
        'brokerSecret'  => env('KENROBOT_SSO_BROKERSECRET', ''),
    ],
];
