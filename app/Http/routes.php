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
Route::get('/project/{id}', 'HomeController@show')->where('id', '[1-9][0-9]*');

Route::get('/api/config', 'HomeController@config');

Route::get('/project/download/{id}/{ext?}', 'ProjectController@downloadProject')->where('id', '[1-9][0-9]*');
Route::post('/api/project/build', 'ProjectController@buildProject');
Route::post('/api/project/save', 'ProjectController@saveProject');
Route::post('/api/project/delete', 'ProjectController@deleteProject');
Route::post('/api/project/get', 'ProjectController@getProject');
Route::post('/api/projects/user', 'ProjectController@getProjects');

// 登录验证
Route::post('/api/auth/login', 'Auth\WebAuthController@snsPostLogin');
Route::post('/api/auth/login/weixin', 'Auth\WebAuthController@weixinlogin');
Route::get('/api/auth/check', 'Auth\AuthServerController@index');