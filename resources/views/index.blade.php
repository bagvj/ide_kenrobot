@extends('layouts.master')

@section('css')
<link rel="stylesheet" type="text/css" href="{{asset('/assets/css/jquery-ui.min.css')}}" />
<link rel="stylesheet" type="text/css" href="{{asset('/assets/css/index.css')}} " />
<link rel="stylesheet" type="text/css" href="{{asset('assets/highlight/styles/solarized_light.css')}}" />
@stop

@section('scripts')
<script data-main="/assets/js/main" src="{{asset('/assets/js/lib/require.min.js')}}" type="text/javascript"></script>
@stop

@section('main')
<div class="header no-select">
	<div class="content">
		<span><a href="{{$nav['self'] or '#'}}" class="logo"></a></span>
		<div class="nav">
			<ul>
				<li><a href="{{$nav['mainpage'] or '#'}}">我的主页</a></li>
				<li><a href="{{$nav['develop'] or '#'}}" class="on">开发</a></li>
				<li><a href="{{$nav['square'] or '#'}}">广场</a></li>
				<li><a href="{{$nav['market'] or '#'}}">商城</a></li>
			</ul>
		</div>

		<div class="login">
			<ul>
				@if(isset($user))
				<li><a href="/auth/logout" class="logoutBtn">退出</a></li>
				@else
				<li><a href="{{ $nav['register'] or '#'}}">注册</a></li>
				<li><a href="javascript:;" class="loginBtn">登录</a></li>
				@endif
			</ul>
		</div>

		@if(isset($user))
		<div class="person-wrap">
			<div class="person">
				<a href="{{$nav['mainpage'] or '#'}}" class="photo">
				<img src="{{$user->avatar_url or asset('assets/images/photo.png')}}" />
				</a>
				<span class="welcome">Hi,{{$user->name}}</span>
			</div>
		</div>
		@endif
	</div>
</div>

<div class="main">
	<div class="mod no-select">
		<div class="nav-second">
			<ul></ul>
		</div>
		<div class="canvas" id="hardware-container" style="z-index:-1:"></div>
	</div>
	<div class="mod no-select">
		<div class="nav-second">
			<ul>
				<li class="ypzmk">
					<div class="tag">已配置模块<div class="arrow"></div></div>
					<div class="hardware-list">
						<ul></ul>
					</div>
				</li>
				<li class="lckzmk1">
					<div class="tag">流程控制模块<div class="arrow"></div></div>
					<div>
						<ul>
							<li>
								<div data-name="ifElse" class="software-item software-ifElse"></div>条件分支
							</li>
							<li>
								<div data-name="conditionLoop" class="software-item software-conditionLoop"></div>条件循环
							</li>
							<li>
								<div data-name="foreverLoop" class="software-item software-foreverLoop"></div>永远循环
							</li>
							<li>
								<div data-name="countLoop"class="software-item software-countLoop"></div>计数循环
							</li>
						</ul>
					</div>
				</li>
				<li class="lckzmk2">
					<div class="tag">函数控制模块<div class="arrow"></div></div>
					<div>
						<ul>
							<li>
								<div data-name="delay" class="software-item software-delay"></div>延时函数
							</li>
							<li>
								<div data-name="assignment" class="software-item software-assignment"></div>赋值函数
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
		<div class="canvas" id="software-container"  style="z-index:-1:"></div>
	</div>
	<div class="side">
		<div class="trolley-side no-select">
		<div class="bar">已配置模块<div class="car"></div></div>
		<div class="hardware-list">
		<ul></ul>
		</div>
		<div class="buy" onclick="window.open('http://www.kenrobot.com/index.php?app=shop');">元件选购</div>
		</div>
		<div class="var-side no-select">
		<div class="bar">变量</div>
		<div class="content">
		<table id="var-table">
		<thead>
		<tr>
		<th>名称</th>
		<th>种类</th>
		<th>类型</th>
		<th>初值</th>
		<th>描述</th>
		</tr>
		</thead>
		<tbody></tbody>
		</table>
		</div>
		<div class="operator">
		<div class="btn add">增加</div>
		<div class="btn del">删除</div>
		<div class="btn modify">修改</div>
		</div>
		</div>
		<div class="code-side">
		<div class="bar no-select">源代码</div>
		<div class="content">
		<div class="code-wrap">
		<pre><code id="src"></code></pre>
		</div>
		</div>
		<div class="code_view"></div>
		</div>
	</div>
	<div class="tabs no-select">
		<ul>
			<li><span>硬件连接</span></li>
			<li><span>软件编程</span></li>
		</ul>
	</div>
	<div class="thumbnail no-select">
		<div class="canvas-wrap" data-action="show">
		<div class="canvas"></div>
		</div>
		<div class="scaleTip" disabled="true"></div>
		<div class="foldBtn active"></div>
	</div>
	<div class="mod_btn no-select">
		<!-- <div class="btn2 test">测试</div> -->
		<div class="btn2 download">下载</div>
		<div class="btn2 feedback">反馈</div>
	</div>
	<div class="instro no-select">双击:编辑 右键:删除 滚轮:缩放</div>
	<div id="code-more" style="display:none">
		<div class="closeBtn"></div>
		<div class="code-wrap">
		<pre><code class="code"></code></pre>
		</div>
	</div>
</div>
@stop