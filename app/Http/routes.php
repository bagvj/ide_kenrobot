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
Route::get('/logout', 'Auth\AuthController@getLogout2');
Route::get('/project/download/{hash}/{ext?}', 'ProjectController@downloadProject')->where('hash', '[0-9a-zA-Z]{6}');

// 配置API
Route::post('/api/config', 'ConfigController@index');
Route::post('/api/example', 'ConfigController@example');

// 项目API
Route::post('/api/project/build', 'ProjectController@buildProject');
Route::post('/api/project/save', 'ProjectController@saveProject');
Route::post('/api/project/delete', 'ProjectController@deleteProject');
Route::post('/api/project/get', 'ProjectController@getProject');
Route::post('/api/projects/user', 'ProjectController@getProjects');

//获取项目列表，SNS调用
Route::any('/api/projects/list', 'ProjectController@ProjectList');


//项目评论API
Route::get('/api/comment', 'CommentController@index');
Route::any('/api/comment/create', 'CommentController@store');

// 登录验证API
Route::post('/api/auth/check', 'Auth\WebAuthController@check');
Route::post('/api/auth/login', 'Auth\WebAuthController@snsPostLogin');
Route::post('/api/auth/login/weixin', 'Auth\WebAuthController@weixinlogin');