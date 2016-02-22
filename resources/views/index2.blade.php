<!DOCTYPE HTML>
<html>
	<head>
		<meta charset='utf-8'>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>啃萝卜智能硬件平台</title>
		<meta name="description" content="啃萝卜智能硬件平台" />
		<meta name="keywords" content="啃萝卜智能硬件平台" />
		<meta name="csrf-token" content="{{csrf_token()}}" />

		<link href="/assets/images/favicon.ico" type="image/x-icon" rel="shortcut icon" />
		<link href="/assets/css/bootstrap.css" rel="stylesheet" />
		<link href="/assets/css/font-awesome.css" rel="stylesheet" />
		<link href="/assets/css/dev.css" rel="stylesheet" />

		<script src="/assets/js/lib/require.min.js" data-main="/assets/js/main2"></script>
	</head>
	<body class="unselectable">
		<div class="main">
			<div class="header">
				<div class="left">
					<a href="http://www.kenrobot.com/" class="logo">&nbsp;</a>
				</div>
				<div class="tab">
					<ul>
						<li><i class="fa fa-th-large"></i>&nbsp;硬件</li>
						<li><i class="fa fa-terminal"></i>&nbsp;软件</li>
						<li><i class="fa fa-info"></i>&nbsp;信息</li>
					</ul>
				</div>
				<div class="setting">
					<div class="btn-group menu" role="group">
						<div class="btn-group" role="group">
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><i class="fa fa-navicon"></i>&nbsp;设置</button>
							<ul class="dropdown-menu">
								<li class="dropdown-submenu">
									<a href="#">主板</a>
									<ul class="board-list dropdown-menu">
									@foreach($boards as $board)
										<li data-action="selectBoard" data-board-name="{{$board->name}}"><a href="#"><img class="thumbnail" src="/assets/images/hardware/arduino-uno-r3-small.png" /><span class="name">{{$board->label}}</span></a></li>
									@endforeach
									</ul>
								</li>
								<li data-action="save"><a href="#">保存</a></li>
								<li data-action="share"><a href="#">分享</a></li>
								<li data-action="setting"><a href="#">界面设置</a></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="content">
				<div class="mod hardware">
					<div class="left">
						<div class="tab-panel">
							<div class="search">
								<input class="key" type="text" placeholder="搜索" spellcheck="false"/>
							</div>
							<div class="seperator"></div>
							<div class="items x-scrollbar">
								<ul class="list">
								@foreach($components as $component)
									<li class="item" data-component-name="{{$component->name}}"><img class="image" src="{{$component->source}}" /><span class="name">{{$component->label}}</span></li>
								@endforeach
								</ul>
							</div>
						</div>
					</div>
					<div class="right">
						<div class="north">
							<ul class="tools">
								<li class="interactive-mode" data-action="changeMode" data-mode="default">
									<i class="fa fa-mouse-pointer"></i>
								</li>
								<li class="interactive-mode active" data-action="changeMode" data-mode="place">
									<i class="fa fa-hand-pointer-o"></i>
								</li>
								<li class="interactive-mode" data-action="changeMode" data-mode="delete">
									<i class="fa fa-close"></i>
								</li>
							</ul>
						</div>
						<div class="center" id="hardware-container">
						</div>
						<div class="south">
							<div class="copyright">
								备案号：京ICP备15039570号<br />Copyright © 2014 KenRobot.com All Rights Reserved
							</div>
						</div>
						<div class="name-dialog" style="display:none;">
							<span class="name-label">名字</span>
							<input class="name" type="text" />
						</div>
					</div>
				</div>
				<div class="mod software">
					<div class="right">
						<div class="north">
							<div class="btn-group menu" role="group">
								<div class="btn-group" role="group">
									<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">文件</button>
									<ul class="dropdown-menu">
										<li data-action="save"><a href="#">保存</a></li>
										<li data-action="download"><a href="#">下载</a></li>
										<li data-action="share"><a href="#">分享</a></li>
									</ul>
								</div>
								<div class="btn-group" role="group">
									<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">项目</button>
									<ul class="dropdown-menu">
										<li class="dropdown-submenu">
											<a href="#">加载库</a>
											<ul class="include-library dropdown-menu">
											@foreach($libraries as $library)
												<li data-action="includeLibrary" data-library="{{$library->name}}"><a href="#">{{$library->name}}</a></li>
											@endforeach
											</ul>
										</li>
									</ul>
								</div>
							</div>
							<div class="sub-tab">
								<ul>
									<li>模块编程</li>
									<li>文本编程</li>
								</ul>
							</div>
						</div>
						<div class="center">
							<div class="sub-mod">
								
							</div>
							<div class="sub-mod">
								<div class="editor"></div>
								<div class="doEdit">
									<ul>
										<li class="active" data-action="enterEdit"><i class="fa fa-pencil"></i>编辑</li>
										<li data-action="exitEdit"><i class="fa fa-close"></i>退出</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="mod info">
				</div>
			</div>
		</div>
		<div>
			<div id="login_dialog" style="display:none">
				<div>
					<a href="javascript:;" title="返回" class="qrLoginBtn active" data-action="qrLogin"></a>
					<div class="qrLogin active">
						<div class="tips">请使用微信扫一扫</div>
						<div class="tips">扫码关注后即可直接登录</div>
						<img class="qrcode" alt="微信扫码" src="{{ $qrcodeurl or '' }}" />
					</div>
					<a href="javascript:;" title="返回" class="baseLoginBtn" data-action="baseLogin" style="display:none;"></a>
					<div class="baseLogin">
						<div class="tips">登录到啃萝卜</div>
						<form>
							{!! csrf_field() !!}
							<div class="message">
								<span></span>
							</div>
							<div class="field">
								<label class="email">
								<!-- <i class="iconauth"></i> -->
								</label>
								<input type="email" name="email" id="email" value="{{ old('email') }}" placeholder="邮箱地址/手机号码" />
							</div>
							<div class="field">
								<label class="password">
								<!-- <i class="iconauth"></i> -->
								</label>
								<input type="password" name="password" id="password" />
							</div>
							<div class="remember"></div>
							<div>
								<input id="qrcode_key" type="hidden" value="{{$key or ''}}">
								<input class="submitBtn" type="button" value="登录"/>
							</div>
						</form>
					</div>
					<div class="closeBtn"></div>
				</div>
			</div>
			<div id="use_weixin" style="display:none;">
				<img src="{{asset('/assets/images/use_weixin.png')}}" />
			</div>
		</div>
	</body>
</html>
