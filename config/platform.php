<?php

return [
    'url' => [
    	'base' => env("PLATFORM_URL_BASE", "http://www.kenrobot.com/"),

    	'register' => "http://www.kenrobot.com/index.php?app=public&mod=Register&act=index",
    	'find_password' => "http://www.kenrobot.com/index.php?app=public&mod=Passport&act=findPassword",

        'saveProject' => "?app=api&mod=Project&act=save",
        'getProject' => "?app=api&mod=Project&act=item",
        'getUserProjects' => "?app=api&mod=Project&act=items",
        'deleteProject' => "?app=api&mod=Project&act=del",
    ]
];