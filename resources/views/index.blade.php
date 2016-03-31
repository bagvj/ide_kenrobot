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
		<link href="/assets/css/index.css" rel="stylesheet" />

		<script src="/assets/js/lib/go.js"></script>
		<script src="/assets/js/lib/astyle.js"></script>
		<script src="/assets/js/lib/require.js" data-main="/assets/js/index"></script>
	</head>
	<body class="unselectable theme-default" data-theme="default">
		<div class="main">
			<div class="main-wrap">
				<div class="main-header">
					<div class="logo">
					</div>
					<div class="top-menu">
						<ul>
							<li data-action="build">编译</li><li data-action="burn">烧写</li><li data-action="format">格式化</li><li data-action="save">保存</li><li data-action="download">下载</li><li data-action="logcat">输出</li>
						</ul>
					</div>
					<div class="user-info {{isset($user) ? 'active' : ''}}">
						<div class="wrap">
							<a class="photo" href="{{$mainpage}}" target="_blank">
								<img src="{{$user->avatar_url or asset('assets/images/default_portrait.png')}}" />
							</a>
							<div class="welcome">
								<span class="name">{{isset($user) ? $user->name : ''}}</span><i class="kenrobot ken-triangle-down arrow"></i>
							</div>
						</div>
						<div class="user-menu">
							<ul>
								<li data-action="share"><i class="kenrobot ken-share"></i>分享</li>
								<li data-action="setting"><i class="kenrobot ken-setting"></i>设置</li>
								<li data-action="logout"><i class="kenrobot ken-logout"></i>退出</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="main-content">
					<div class="sidebar">
						<div class="bar">
							<ul>
								<li data-action="project"><i class="kenrobot ken-project"></i>项目</li>
								<li class="hide" data-action="board"><i class="kenrobot ken-board"></i>主板</li>
								<li class="hide" data-action="component"><i class="kenrobot ken-component"></i>元件</li>
								<li data-action="library"><i class="kenrobot ken-library"></i>库</li>
							</ul>
						</div>
						<div class="tab tab-project">
							<div class="project">
								<div class="operation">
									<ul>
										<li class="new" data-action="new" title="新建项目"><i class="kenrobot ken-add"></i><span>新建</span></li>
										<li class="edit" data-action="edit" title="编辑项目"><i class="kenrobot ken-info-info2"></i>信息</li>
										<li class="delete" data-action="delete" title="删除项目"><i class="kenrobot ken-delete"></i>删除</li>
									</ul>
								</div>
								<div class="list x-scrollbar">
									<ul>
										<li data-project-id="0">
											<div class="title">
												<span class="name">我的项目</span><i class="kenrobot"></i>
											</div>
											<div class="view">
												<div data-view="software"><span class="name">我的项目</span>.ino</div>
											</div>
										</li>
									</ul>
								</div>
								
							</div>
						</div>
						<div class="tab tab-board">
							<div class="board x-scrollbar">
								<ul class="list">
								@foreach($boards as $index => $board)
								@if($index == 0)
									<li class="normal" data-board="{{$board->name}}"><img class="image" src="/assets/images/board/arduino-uno-r3-small.png" /><span class="name">{{$board->label}}</span></li>
								@else
									<li class="forward" data-board="{{$board->name}}">
										<img class="image" src="/assets/images/board/arduino-uno-r3-small.png" />
										<span class="name">{{$board->label}}</span>
										<div class="stamps"></div>
									</li>
								@endif
								@endforeach
								</ul>
							</div>
						</div>
						<div class="tab tab-component">
							<div class="component">
								<div class="search">
									<input class="key" type="text" placeholder="搜索" spellcheck="false"/>
									<i class="kenrobot ken-search"></i>
								</div>
								<div class="items x-scrollbar">
									<ul class="list">
									@foreach($components as $component)
										<li class="item" data-component-name="{{$component->name}}"><img class="image" src="{{$component->source}}" /><div class="name">{{$component->label}}</div></li>
									@endforeach
									</ul>
								</div>
							</div>
						</div>
						<div class="tab tab-library">
							<div class="library x-scrollbar">
								<ul class="list">
								@foreach($libraries as $library)
									<li data-library="{{$library->name}}">{{$library->name}}</li>
								@endforeach
								</ul>
							</div>
						</div>
					</div>
					<div class="wrap">
						<div class="top-tabs">
							<ul>
							</ul>
						</div>
						<div class="main-tabs">
							<div class="tab tab-software active">
								<div class="software">
									<div class="editor"></div>
									<div class="back{{isset($user) ? ' active' : ''}}">
										<i class="kenrobot ken-switch"></i>硬件设计
									</div>
								</div>
							</div>
							<div class="tab tab-hardware">
								<div class="hardware">
									<div class="center" id="hardware-container"></div>
									<div class="follow">
										<img class="follower" />
									</div>
									<div class="tools">
										<ul class="interactive-mode">
											<li data-action="changeInteractiveMode" data-mode="modern">
												<i class="kenrobot ken-switch-on"></i>
												<div class="tips">切换拖拽模式</div>
											</li>
											<li class="hide" data-action="changeInteractiveMode" data-mode="drag">
												<i class="kenrobot ken-switch-off"></i>
												<div class="tips">切换现代模式</div>
											</li>
										</ul>
										<ul class="mode">
											<li class="active" data-action="changeMode" data-mode="default">
												<i class="kenrobot ken-move"></i>
												<div class="tips">默认</div>
											</li>
											<li data-action="changeMode" data-mode="clone">
												<i class="kenrobot ken-clone"></i>
												<div class="tips">克隆</div>
											</li>
											<li data-action="changeMode" data-mode="delete">
												<i class="kenrobot ken-delete"></i>
												<div class="tips">删除</div>
											</li>
										</ul>
									</div>
									<div class="name-dialog">
										<div class="wrap">
											<span class="name-label">名字</span>
											<input class="name" type="text" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="bottom-container">
				<div class="logcat"></div>
				<div class="drag-handle"></div>
			</div>
		</div>
		<div class="layers">
			<div class="float-layer">
				<div class="copyright">
					<div class="wrap">
						备案号：京ICP备15039570号&nbsp;&nbsp;&nbsp;&nbsp;Copyright © 2014 KenRobot.com All Rights Reserved
						<i class="kenrobot ken-close close-btn"></i>
					</div>
				</div>
			</div>
			<div class="drag-layer"></div>
			<div class="modal dialog-layer">
				<div id="login_dialog" class="dialog">
					<div class="close-btn left">
						<i class="kenrobot ken-close"></i>
					</div>
					<div>
						<a title="返回" class="baseLoginBtn" data-action="baseLogin active" style="display:none;"></a>
						<div class="tab baseLogin active">
							<div class="tips">登录到啃萝卜</div>
							<form>
								{!! csrf_field() !!}
								<div class="message">
									<span></span>
								</div>
								<div class="field">
									<label class="email-icon"></label>
									<input class="email" type="email" name="email" value="{{ old('email') }}" placeholder="邮箱地址/手机号码" autocomplete="off" />
								</div>
								<div class="field">
									<label class="password-icon"></label>
									<input class="password" type="password" name="password" />
								</div>
								<div class="remember"></div>
								<div>
									<input id="qrcode_key" type="hidden" value="{{$key or ''}}">
									<a class="btn-login">登录</a>
									<a class="btn-register" href="{{$register_url}}">注册</a>
								</div>
							</form>
						</div>
						<a title="返回" class="qrLoginBtn" data-action="qrLogin"></a>
						<div class="tab qrLogin">
							<div class="tips">请使用微信扫一扫</div>
							<div class="tips">扫码关注后即可直接登录</div>
							<img class="qrcode" alt="微信扫码" src="{{ $qrcodeurl or '' }}" />
						</div>
					</div>
				</div>
				<div id="use_weixin" style="display:none;">
					<img src="{{asset('/assets/images/use_weixin.png')}}" />
				</div>
				<div class="x-dialog x-dialog-info install-dialog">
					<div class="x-dialog-title">安装</div>
					<div class="x-dialog-close">&times;</div>
					<div class="x-dialog-content selectable">
						你没有安装啃萝卜<span class="strong">KenExt.crx</span>，请按以下步骤操作:
						<div class="step">
							Step 1: 点击<a href="http://platform.kenrobot.com/download/KenExt.crx" title="啃萝卜">下载</a><br />
							Step 2: 打开chrome浏览器，在地址栏输入<span class="strong">chrome://extensions</span><br />
							Step 3: 把<span class="strong">KenExt.crx</span>拖入浏览器<br />
							Step 4: 完成安装
						</div>
						<div class="des">说明: 如果顶部弹出“无法添加来自此网站的应用...”，请点击确定。由于一些你懂的原因，我们不能把插件发布到google应用商店。就算能发布，部分用户也不能...，所以<span class="helpless">╮(╯▽╰)╭</span></div>
					</div>
					<div class="x-dialog-btns">
						<button class="x-dialog-btn confirm">确定</button>
					</div>
				</div>
				<div class="x-dialog x-dialog-info arduino-driver-dialog">
					<div class="x-dialog-title">驱动问题</div>
					<div class="x-dialog-close">&times;</div>
					<div class="x-dialog-content selectable">
						如果你遇到了Arduino<span class="strong">驱动问题</span>，请按以下步骤操作:
						<div class="step">
							Step 1: 点击<a class="downloadUrl" href="#" title="Arduino驱动">下载</a>并解压<br />
							Step 2: 运行<span class="strong">arduino驱动安装.exe</span><br />
							Step 3: 完成安装
						</div>
					</div>
					<div class="x-dialog-btns">
						<button class="x-dialog-btn confirm">确定</button>
					</div>
				</div>
				<div class="x-dialog x-dialog-confirm delete-project-dialog">
					<div class="x-dialog-title">删除确认</div>
					<div class="x-dialog-close">&times;</div>
					<div class="x-dialog-content">
						删除后不可恢复，确定要删除该项目吗？
					</div>
					<div class="x-dialog-btns">
						<button class="x-dialog-btn confirm">确定</button><button class="x-dialog-btn cancel">取消</button>
					</div>
				</div>
				<div class="x-dialog x-dialog-info building-dialog">
					<div class="x-dialog-title">编译</div>
					<div class="x-dialog-close">&times;</div>
					<div class="x-dialog-content"></div>
					<div class="x-dialog-btns">
						<button class="x-dialog-btn confirm">确定</button>
					</div>
				</div>
				<div class="x-dialog x-dialog-custom burn-dialog">
					<div class="x-dialog-title">烧写</div>
					<div class="x-dialog-close">&times;</div>
					<div class="x-dialog-content">
						<div class="tab tab-init active">
							<div class="wrap">
								<div class="message">
									正在初始化，请稍候
								</div>
							</div>
						</div>
						<div class="tab tab-no-serial">
							<div class="wrap">
								<div class="message">
									未检测到有Arduino开发板或其它串口设备插入<br />
									<a class="driver" href='#'>驱动问题?</a>解决后请关闭本窗口，然后重新点击烧写图标
								</div>
							</div>
						</div>
						<div class="tab tab-connect">
							<div class="wrap">
								<div class="tips">
									未检测到Arduino开发板连接或您已连接多个<br />请手动设置串口
								</div>
								<div class="field">
									<label>端口:</label>
									<select class="port">
									</select>
									<label>波特率:</label>
									<select class="bitRate">
										<option>115200</option>
										<option>57600</option>
										<option>19200</option>
										<option>9600</option>
										<option>4800</option>
									</select>
								</div>
								<div>
									<input class="connect" type="button" value="连接" />
								</div>
								<div class="message"></div>
							</div>
						</div>
						<div class="tab tab-burn">
							<div class="wrap">
								<div class="burn-wrap">
									<input class="burn" type="button" value="烧写" />
									<div class="message"></div>
								</div>
								<div class="burn-progress">
									<ul>
									@for($i = 0; $i < 50; $i++)
										<li></li>
									@endfor
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="dialog save-dialog">
				<div class="close-btn right">
					<i class="kenrobot ken-close"></i>
				</div>
				<div class="wrapper">
					<form class="form-horizontal">
						<div class="form-group">
							<label class="col-sm-2 control-label">项目名称：</label>
							<div class="col-sm-10">
								<input class="form-control" name="name" type="text" autocomplete="off" />
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">项目简介：</label>
							<div class="col-sm-10">
								<textarea class="form-control" name="intro" rows="5"></textarea>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-2 control-label">公开：</label>
							<div class="col-sm-10">
								<label class="checkbox-inline"><input type="radio" name="public-type" value="1" checked="true" />私有</label>
								<label class="checkbox-inline"><input type="radio" name="public-type" value="2" />完全公开</label>
								<label class="checkbox-inline"><input type="radio" name="public-type" value="3" />好友公开</label>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-offset-2 col-sm-10">
								<input class="btn save pull-right" type="button" name="save" value="保存项目" />
							</div>
						</div>
					</form>
				</div>
			</div>
			<div class="message-layer"></div>
			@if(!$has_visit)
			<div class="modal guide-layer">
				<div class="guide-step guide-login">
					<div class="guide-title">提示：</div>
					<div class="guide-content">
						点击此处即可弹出<span class="strong">登录</span>窗口<br />
						登录后可解锁更多功能哦<br />
						推荐使用Google Chrome浏览器
					</div>
				</div>
				<div class="guide-step guide-interactive-mode">
					<div class="guide-title">提示：</div>
					<div class="guide-content">
						点击此处可切换<span class="strong">交互模式</span><br />
						包括拖拽模式和现代模式
					</div>
				</div>
				<div class="guide-step guide-code-edit">
					<div class="guide-title">提示：</div>
					<div class="guide-content">
						双击空白处或主板<br />
						可切换到<span class="strong">代码编辑</span>
					</div>
				</div>
				<div class="guide-step guide-burn">
					<div class="guide-title">提示：</div>
					<div class="guide-content">
						点击此处按钮可进行<br />
						<span class="strong">烧写</span>、<span class="strong">保存</span>和<span class="strong">下载</span>
					</div>
				</div>
				<div class="guide-step guide-enjoy">
					<div class="guide-content">
						尽情使用吧
					</div>
				</div>
			</div>
			@endif
		</div>
	</body>
</html>
