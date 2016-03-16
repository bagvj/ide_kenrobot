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

Route::post('/build', 'HomeController@build');
Route::get('/download/{uri}/{ext?}', 'HomeController@download')->where('uri', '[.0-9a-zA-Z_-]+');

Route::get('/config', 'HomeController@config');

Route::post('/project/save', 'ProjectController@saveProject');
Route::post('/project/delete', 'ProjectController@deleteProject');
Route::get('/project/{id}', 'ProjectController@getProject')->where('id', '[1-9][0-9]*');
Route::get('/projects/{user_id}', 'ProjectController@getProjects')->where('user_id', '[1-9][0-9]*');


Route::get('/serial/update.xml', 'SerialController@update');
Route::get('/serial/{any}', function(){
	return redirect(url('/help/serial'));
});

Route::get('/help/{uri?}', 'HelpController@index')->where('uri', '[0-9a-zA-Z-]*');

// 登录验证
Route::get('/auth/login', 'Auth\AuthController@getLogin');
Route::post('/auth/login', 'Auth\AuthController@postLogin');
Route::get('/auth/logout', 'Auth\AuthController@getLogout2');

Route::get('/auth/check', 'Auth\AuthServerController@index');

// 注册 暂时关闭
// Route::get('/auth/register', 'Auth\AuthController@getRegister');
// Route::post('/auth/register', 'Auth\AuthController@postRegister');

Route::any('/snspostlogin', 'Auth\WebAuthController@snsPostLogin');
Route::any('/weixinlogin', 'Auth\WebAuthController@weixinlogin');

