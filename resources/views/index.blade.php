@extends('layouts.master')

@section('css')
<link rel="stylesheet" type="text/css" href="{{asset('/assets/css/jquery-ui.min.css')}}" />
<link rel="stylesheet" type="text/css" href="{{asset('assets/highlight/styles/solarized_light.css')}}" />
<link rel="stylesheet" type="text/css" href="{{asset('/assets/css/bootstrap-tour-standalone.min.css')}} " />
<link rel="stylesheet" type="text/css" href="{{asset('/assets/css/index.css')}} " />
@stop

@section('scripts')
<script type="text/javascript">
	var pageHeight = document.documentElement.clientHeight;
	var pageWidth = document.documentElement.clientWidth;
	var loadingTop = pageHeight > 61 ? (pageHeight - 61) / 2 : 0;
	var loadingLeft = pageWidth > 215 ? (pageWidth - 215) / 2 : 0;
	var loadingId = "loadingDiv";
	var loadingHtml = '<div id="' + loadingId + '" style="position:absolute;left:0;width:100%;height:' + pageHeight + 'px;top:0;background:#f3f8ff;opacity:0.8;filter:alpha(opacity=80);z-index:10000;"><div style="position: absolute; cursor1: wait; left: ' + loadingLeft + 'px; top:' + loadingTop + 'px; width: auto; height: 57px; line-height: 57px; padding-left: 50px; padding-right: 5px; background: #fff url(/assets/images/loading.gif) no-repeat scroll 5px 10px; border: 2px solid #95B8E7; color: #696969; font-family:\'Microsoft YaHei\';">客官，打尖还是住店？</div></div>';
	document.write(loadingHtml);
	document.onreadystatechange = onDomComplete;

	var isTimeout = false;
	var t_img;
	var isImgLoad = true;

	setTimeout(function() {
		isTimeout = true;
		console.log("onTimeout");
		checkImgLoaded(removeLoading);
	}, 1000);

	function onDomComplete() {
		if(document.readyState == "complete") {
			console.log("onDomComplete");
			checkImgLoaded(removeLoading);
		}
	}
	
	// 判断图片加载的函数
	function checkImgLoaded(callback){
		console.log("checkImgLoaded");
		var imgs = document.getElementsByTagName("img");
	    for(var i = 0; i < imgs.length; i++) {
	    	var img = imgs[i];
	        if(img.height === 0){
	            isImgLoad = false;
	            return false;
	        }
	    }

	    if(isImgLoad){
	        clearTimeout(t_img);
	        callback();
	    }else{
	        isImgLoad = true;
	        t_img = setTimeout(function(){
	            checkImgLoaded(callback);
	        }, 500);
	    }
	}

	function removeLoading() {
		if (!isTimeout || !isImgLoad) {
			return;
		}
		console.log("removeLoading");
		var loadingDiv = document.getElementById(loadingId);
		if (loadingDiv) {
			loadingDiv.parentNode.removeChild(loadingDiv);
		}
	}
</script>
<script data-main="/assets/js/main" src="{{asset('/assets/js/lib/require.min.js')}}" type="text/javascript"></script>
@stop

@section('main')
<div class="header no-select">
	<div class="content">
		<span><a href="{{$nav['self'] or '#'}}" class="logo"></a></span>
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
								<img src="/assets/images/software/ifElse-small.png" data-name="ifElse" class="software-item"></img>条件分支
							</li>
							<li>
								<img src="/assets/images/software/conditionLoop-small.png" data-name="conditionLoop" class="software-item"></img>条件循环
							</li>
							<li>
								<img src="/assets/images/software/foreverLoop-small.png" data-name="foreverLoop" class="software-item"></img>永远循环
							</li>
							<li>
								<img src="/assets/images/software/countLoop-small.png" data-name="countLoop" class="software-item"></img>计数循环
							</li>
						</ul>
					</div>
				</li>
				<li class="lckzmk2">
					<div class="tag">函数控制模块<div class="arrow"></div></div>
					<div>
						<ul>
							<li>
								<img src="/assets/images/software/delay-small.png" data-name="delay" class="software-item software-delay"></img>延时函数
							</li>
							<li>
								<img src="/assets/images/software/assignment-small.png" data-name="assignment" class="software-item software-assignment"></img>赋值函数
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
		<div class="var_btn add">增加</div>
		<div class="var_btn del">删除</div>
		<div class="var_btn modify">修改</div>
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
		<div class="btn2 demo">演示</div>
		<div class="btn2 download">下载</div>
		<div class="btn2 feedback">反馈</div>
	</div>
	<div class="instro no-select"></div>
	<div id="code-more" style="display:none">
		<div class="closeBtn"></div>
		<div class="code-wrap">
		<pre><code class="code"></code></pre>
		</div>
	</div>
</div>
@stop
