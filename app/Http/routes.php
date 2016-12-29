<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
 */
Route::get('/', 'HomeController@index');
Route::get('/editor', 'HomeController@editor');
Route::any('/logout', 'AuthController@logout');

Route::get('/project/download/{hash}/{ext?}', 'ProjectController@downloadProject')->where('hash', '[0-9a-zA-Z]{6}');

// 配置API
Route::post('/api/config', 'ConfigController@index');
Route::post('/api/example', 'ConfigController@example');

// 编译API
Route::post('/api/build', 'BuildController@index');

// 项目API
Route::post('/api/project/build', 'ProjectController@buildProject');
Route::post('/api/project/save', 'ProjectController@saveProject');
Route::post('/api/project/delete', 'ProjectController@deleteProject');
Route::post('/api/project/get', 'ProjectController@getProject');
Route::post('/api/projects/user', 'ProjectController@getProjects');

//获取项目列表，SNS调用
Route::any('/api/projects/list', 'ProjectController@ProjectList');

//项目评论API
Route::post('/api/comment/save', 'CommentController@save');
Route::post('/api/comment/get', 'CommentController@get');
Route::post('/api/comment/delete', 'CommentController@remove');

// 登录验证API
Route::any('/api/auth/attach', 'AuthController@attach');
Route::any('/api/auth/login', 'AuthController@login');
Route::any('/api/auth/register', 'AuthController@register');
Route::any('/api/auth/check', 'AuthController@userinfo');
Route::any('/api/auth/weixin/login', 'AuthController@weixinlogin');
Route::any('/api/auth/weixin/qrcode', 'AuthController@weixinQrcode');
<<<<<<< HEAD


=======
Route::post('/api/user/register', 'AuthController@register');
>>>>>>> 88fe426c84b2e64c31f5bbabb36a3305b3957fd5
