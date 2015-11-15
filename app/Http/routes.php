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
Route::get('/download', 'HomeController@download');


// 登录验证
Route::get('auth/login', 'Auth\AuthController@getLogin');
Route::post('auth/login', 'Auth\AuthController@postLogin');
Route::get('auth/logout', 'Auth\AuthController@getLogout');

// 注册路由
Route::get('auth/register', 'Auth\AuthController@getRegister');
Route::post('auth/register', 'Auth\AuthController@postRegister');

Route::get('auth/snslogin', 'Auth\SnsAuthController@snsLogin');
Route::get('auth/weixinlogin', 'Auth\WeixinAuthController@weixinlogin');


//GetInitInfo
Route::get('initinfo','HomeController@initinfo');

//GetFlowChartInfo.php
Route::get('flowchart/info', 'FlowChartController@info');
//GetFlowchartItem.php
Route::get('flowchart/item', 'FlowChartController@item');
//AddFlowChart.php
Route::match(['get','post'], 'flowchart/add', 'FlowChartController@create');


Route::match(['get','post'],'project/list', 'ProjectController@index');

Route::get('project/info', 'ProjectController@info');
Route::post('project/add', 'ProjectController@create');
Route::post('project/edit', 'ProjectController@edit');

Route::get('project/del', 'ProjectController@destroy');

Route::match(['get','post'],'/board/match', 'ConnectRuleController@getMatchComponent');

