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
Route::get('/config', 'HomeController@config');

Route::post('/project/build', 'ProjectController@buildProject');
Route::post('/project/save', 'ProjectController@saveProject');
Route::post('/project/delete', 'ProjectController@deleteProject');
Route::get('/project/download/{id}/{ext?}', 'ProjectController@downloadProject')->where('id', '[1-9][0-9]*');
Route::get('/project/{id}', 'ProjectController@getProject')->where('id', '[1-9][0-9]*');
Route::get('/projects/{user_id}', 'ProjectController@getProjects')->where('user_id', '[1-9][0-9]*');

// 登录验证
Route::post('/auth/login', 'Auth\WebAuthController@snsPostLogin');
Route::post('/auth/login/weixin', 'Auth\WebAuthController@weixinlogin');
Route::get('/auth/check', 'Auth\AuthServerController@index');
Route::get('/logout', 'Auth\AuthController@getLogout2');