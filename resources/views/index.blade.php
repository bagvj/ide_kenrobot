<!DOCTYPE HTML>
<html>
	<head>
		<meta charset='utf-8'>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>啃萝卜智能硬件平台</title>
		<meta name="keywords" content="arduino 开发 IDE 开发平台 教程" />
		<meta name="description" content="啃萝卜智能硬件平台" />
		<meta name="csrf-token" content="{{csrf_token()}}" />

		<link href="/assets/css/index.css" rel="stylesheet" />

		@if(!env('APP_DEBUG'))
		<script scr="//hm.baidu.com/hm.js?{{env('PV_KEY')}}"></script>
		@endif
		<script src="/assets/js/go.js"></script>
		<script src="/assets/js/astyle.js"></script>
		<script src="/assets/js/require.js" data-main="/assets/js/index"></script>
	</head>
	<body class="unselectable theme-{{$setting['theme']}}" data-theme="{{$setting['theme']}}">
		<div class="main">
			<div class="main-wrap">
				<div class="main-header">
					<a class="logo" href="http://www.kenrobot.com"></a>
					<div class="wrap">
						<div class="top-menu">
							<ul>
								<li data-action="build">
									<i class="kenrobot ken-build"></i><span>编译</span>
								</li>
								<li data-action="burn">
									<i class="kenrobot ken-upload"></i><span>烧写</span>
								</li>
								<li data-action="format">
									<i class="kenrobot ken-format"></i><span>格式化</span>
								</li>
								<li data-action="save">
									<i class="kenrobot ken-save"></i><span>保存</span>
								</li>
								<li data-action="download">
									<i class="kenrobot ken-download"></i><span>下载</span>
								</li>
								<li>
									<i class="kenrobot ken-tool"></i><span>工具</span>
									<ul>
										<li data-action="logcat">
											<span>输出</span>
										</li>
										<li data-action="serial-assitant">
											<span>串口监视器</span>
										</li>
										<li data-action="interpreter">
											<span>解释器</span>
										</li>
										<li class="port">
											<span>端口</span>
											<i class="arrow kenrobot ken-triangle-right"></i>
											<ul class="select">
											</ul>
										</li>
										<li class="baudRate">
											<span>波特率</span>
											<i class="arrow kenrobot ken-triangle-right"></i>
											<ul class="select">
												<li data-rate="115200"><i class="check kenrobot ken-check"></i>115200</li>
												<li data-rate="57600"><i class="check kenrobot ken-check"></i>57600</li>
												<li data-rate="38400"><i class="check kenrobot ken-check"></i>38400</li>
												<li data-rate="19200"><i class="check kenrobot ken-check"></i>19200</li>
												<li data-rate="9600"><i class="check kenrobot ken-check"></i>9600</li>
												<li data-rate="4800"><i class="check kenrobot ken-check"></i>4800</li>
											</ul>
										</li>
										<li class="board">
											<span>开发板</span>
											<i class="arrow kenrobot ken-triangle-right"></i>
											<ul class="select">
											@foreach($boards as $index => $board)
												<li class="{{$board->is_forward ? 'forward' : ''}}{{$board->is_hot ? ' hot' : ''}}" data-board="{{$board->name}}" title="{{$board->label}}"><i class="check kenrobot ken-check"></i><span class="name">{{$board->label}}</span><i class="hot kenrobot ken-hot"></i></li>
											@endforeach
											</ul>
										</li>
										<li class="library">
											<span>库</span>
											<i class="arrow kenrobot ken-triangle-right"></i>
											<ul class="select">
											@foreach($libraries as $library)
												<li data-library="{{$library->name}}" title="{{$library->name}}"><i class="check kenrobot ken-check"></i>{{$library->name}}</li>
											@endforeach
											</ul>
										</li>
									</ul>
								</li>
								<li data-action="setting">
									<i class="kenrobot ken-setting"></i><span>设置</span>
								</li>
							</ul>
						</div>
						<div class="user{{isset($user) ? ' active' : ''}}">
							<div class="user-login">
								<ul>
									<li data-action="login">登录</li><li data-action="register">注册</li>
								</ul>
							</div>
							<div class="user-info">
								<a class="photo" href="{{$mainpage}}" target="_blank">
									<img src="{{$user->avatar_url or asset('assets/image/default_portrait.png')}}" />
								</a>
								<div class="welcome">
									<span class="name">{{isset($user) ? $user->name : ''}}</span><i class="kenrobot ken-triangle-down arrow"></i>
								</div>
							</div>
							<div class="user-menu">
								<ul>
									<li data-action="share"><i class="kenrobot ken-share"></i>分享</li>
									<li data-action="logout"><i class="kenrobot ken-logout"></i>退出</li>
								</ul>
							</div>
						</div>
						<div class="top-tabs">
							<ul>
							</ul>
						</div>
					</div>
				</div>
				<div class="main-content">
					<div class="sidebar">
						<div class="bar">
							<ul>
								<li data-action="project"><i class="kenrobot ken-project"></i>项目</li>
								<li class="hide" data-action="component"><i class="kenrobot ken-component"></i>元件</li>
								<li data-action="example"><i class="kenrobot ken-demo"></i>示例</li>
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
									</ul>
								</div>
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
						<div class="tab tab-example">
							<div class="example x-scrollbar">
								<ul class="list">
								@foreach($exampleGroups as $category => $examples)
									<li>
										<span>{{$category}}</span>
										<ul>
										@foreach($examples as $example)
											<li data-id="{{$example->uuid}}">{{$example->name}}</li>
										@endforeach
										</ul>
									</li>
								@endforeach
								</ul>
							</div>
						</div>
					</div>
					<div class="wrap">
						<div class="main-tabs">
							<div class="tab tab-software active">
								<div class="software">
									<div class="editor"></div>
									<div class="barrage"></div>
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
						<div class="switch-view{{isset($user) ? ' active' : ''}}" data-view="hardware">
							<i class="kenrobot ken-switch"></i><span class="switch-text">硬件设计</span>
						</div>
					</div>
					<div class="right-bar">
						<div class="wrap">
							<div class="tab tab-comment">
								<div class="tab-wrap">
									<div class="publish-comment">
										<form>
											<textarea class="comment-content" spellcheck="false" placeholder="小哥，吐槽一下呗~"></textarea>
											<div class="publish-wrap">
												<div class="line-reference">
													<div class="line-num"></div>
													<div class="line-content"></div>
												</div>
												<div class="line-wrap">
													<input class="use-line" type="checkbox" id="use-line" />
													<label class="use-line-label" for="use-line">引用行</label>
													<input type="text" class="line" title="行号" />
													<label class="tips">评论某行代码有惊喜</label>
													<input class="publish" type="button" value="发表评论" />
													</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
						<div class="bar">
							<ul>
								<li data-action="comment"><i class="kenrobot ken-comment"></i>评论</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="bottom-container">
				<div class="drag-handle"></div>
				<div class="tab tab-logcat">
					<div class="logcat-wrap">
						<div class="logcat"></div>
					</div>
				</div>
				<div class="tab tab-serial-assitant">
					<div class="serial-assitant">
						<div class="serial-top">
							<div class="serial-input">
								<div class="input-wrap">
									<span class="input-label">输入：</span>
									<input type="text" class="input" spellcheck="false" />
									<input type="button" class="send-btn" value="发送" />
								</div>
								<ul class="serial-control">
									<li data-action="play" title="连接串口"><i class="kenrobot ken-play"></i></li>
									<li data-action="pause" title="暂停接收"><i class="kenrobot ken-pause"></i></li>
									<li data-action="stop" title="断开串口"><i class="kenrobot ken-stop"></i></li>
								</ul>
							</div>
							<div class="serial-tools">
								<ul>
									<li data-action="clear" title="清空输出"><i class="kenrobot ken-clear"></i></li>
								</ul>
							</div>
							<div class="options">
								<input type="checkbox" class="line-break" id="line-break" />
								<label class="line-break-label" for="line-break">带换行符</label>
							</div>
						</div>
						<div class="serial-bottom">
							<textarea class="log" spellcheck="false" readonly="readonly"></textarea>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="layers">
			<div class="float-layer"></div>
			<div class="drag-layer"></div>
			<div class="modal dialog-layer">
				<div class="x-dialog x-dialog-custom login-dialog">
					<i class="kenrobot ken-close x-dialog-close"></i>
					<ul class="switch">
						<li class="account active" data-action="account"></li>
						<li class="weixin" data-action="weixin"><div class="tips">扫码登录更安全</div></li>
					</ul>
					<div class="logo"></div>
					<div class="seperator"></div>
					<div class="wrap">
						<div class="tab tab-account active">
							<div class="title">账号登录</div>
							<form>
								{!! csrf_field() !!}
								<input class="qrcode-key" type="hidden" value="{{$key or ''}}">
								<div class="field">
									<span class="icon"><i class="kenrobot ken-user"></i></span>
									<input class="email" type="email" name="email" value="{{old('email')}}" placeholder="邮箱地址/手机号码" autocomplete="off" />
								</div>
								<div class="field">
									<span class="icon"><i class="kenrobot ken-password"></i></span>
									<input class="password" type="password" name="password" placeholder="密码" />
								</div>
								<div class="message">
									<span></span>
								</div>
								<input class="login-btn" type="button" value="登录" />
							</form>
						</div>
						<div class="tab tab-weixin">
							<div class="scan">
								<img src="{{asset('/assets/image/weixin-scan.png')}}" />
							</div>
							<img class="qrcode" alt="微信扫码" src="{{$qrcodeurl or ''}}" />
							<div class="login-tips tips">
								请使用微信扫一扫<br />扫码关注后即可直接登录
							</div>
							<div class="register-tips tips">
								推荐使用微信扫码功能<br />扫码后将完成注册并登录
							</div>
						</div>
					</div>
					<div class="footer">
						<div class="login-footer">
							<a class="forget-password" href="{{$find_password_url}}">忘记密码</a>
							<a class="register" href="{{$register_url}}">点击注册</a>
							<span class="no-account">还没有啃萝卜账号？</span>
						</div>
						<div class="register-footer">
							<span class="no-account">不使用微信？前往</span>
							<a class="register" href="{{$register_url}}">网站注册</a>
						</div>
					</div>
				</div>
				<div class="x-dialog x-dialog-info install-dialog">
					<div class="x-dialog-title">安装</div>
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content selectable">
						你没有安装啃萝卜<span class="strong">KenExt.crx</span>，请按以下步骤操作:
						<div class="step">
							Step 1: 点击<a href="/download/KenExt.crx" title="啃萝卜">下载</a><br />
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
					<i class="kenrobot ken-close x-dialog-close"></i>
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
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content">
						删除后不可恢复，确定要删除项目"<span class="strong name"></span>"吗？
					</div>
					<div class="x-dialog-btns">
						<button class="x-dialog-btn confirm">确定</button><button class="x-dialog-btn cancel">取消</button>
					</div>
				</div>
				<div class="x-dialog x-dialog-info building-dialog">
					<div class="x-dialog-title">编译</div>
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content"></div>
					<div class="x-dialog-btns">
						<button class="x-dialog-btn confirm">确定</button>
					</div>
				</div>
				<div class="x-dialog x-dialog-custom burn-dialog">
					<div class="x-dialog-title">烧写</div>
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content">
						<div class="tab tab-init active">
							<div class="wrap">
								<div class="message">
									正在初始化，请稍候
								</div>
							</div>
						</div>
						<div class="tab tab-error">
							<div class="wrap">
								<div class="message message-1">
									未检测到有Arduino开发板或其它串口设备插入<br />
									<a class="driver" href='#'>驱动问题?</a>解决后请关闭本窗口，然后重新点击烧写图标
								</div>
								<div class="message message-2">
									请在“工具->端口”中设置串口
								</div>
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
				<div class="x-dialog x-dialog-custom save-dialog">
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content">
						<form>
							<div>
								<span class="filed-key">项目名称：</span>
								<input class="name" name="name" type="text" autocomplete="off" spellcheck="false" />
							</div>
							<div class="filed-intro">
								<span class="filed-key">项目简介：</span>
								<textarea class="intro" name="intro" rows="5" spellcheck="false"></textarea>
							</div>
							<div>
								<span class="filed-key">公开：</span>
								<div class="public-type">
									<label><input type="radio" name="public-type" value="2" checked="true" />完全公开</label>
									<label><input type="radio" name="public-type" value="1" />好友公开</label>
									<label><input type="radio" name="public-type" value="0" />私有</label>
								</div>
							</div>
							<input class="save-btn" name="save" type="button" value="保存" />
						</form>
					</div>
				</div>
				<div class="x-dialog x-dialog-confirm copy-dialog">
					<div class="x-dialog-title">复制项目</div>
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content">
						当前项目不是你的项目，是否复制？
					</div>
					<div class="x-dialog-btns">
						<button class="x-dialog-btn confirm">确定</button><button class="x-dialog-btn cancel">取消</button>
					</div>
				</div>
				<div class="x-dialog x-dialog-custom setting-dialog">
					<div class="x-dialog-title">设置</div>
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content">
						<div class="left">
							<ul>
								<li data-action="theme">主题</li>
								<li data-action="editor">编辑器</li>
								<li data-action="shortcut">快捷键</li>
								<li data-action="help">帮助</li>
								<li data-action="about">关于</li>
							</ul>
						</div>
						<div class="right">
							<div class="tab tab-theme">
								<div class="field">
									<span>主题</span>
									<div>
										<select class="theme">
											<option value="default">默认</option>
											<option value="white">白色</option>
										</select>
									</div>
								</div>
							</div>
							<div class="tab tab-editor">
								<div class="field">
									<span>代码着色</span>
									<div>
										<select class="code-theme">
											<option value="default">默认</option>
											<option value="white">白色</option>
											<option value="chrome">Chrome</option>
											<option value="clouds">Clouds</option>
											<option value="eclipse">Eclipse</option>
											<option value="github">Github</option>
											<option value="monokai">Monokai</option>
											<option value="terminal">Terminal</option>
											<option value="textmate">Textmate</option>
											<option value="tomorrow">Tomorrow</option>
											<option value="xcode">XCode</option>
										</select>
									</div>
								</div>
								<div class="field">
									<span>Tab大小</span>
									<div>
										<input class="tab-size" type="number" value="4" min="0" max="8" />
									</div>
								</div>
							</div>
							<div class="tab tab-shortcut">
								<div class="grid">
									<div>
										<span class="name">名称</span>
										<span class="shortcut">快捷键</span>
									</div>
									<div>
										<span class="name">保存</span>
										<span class="shortcut">Ctrl + S</span>
									</div>
									<div>
										<span class="name">编译</span>
										<span class="shortcut">Ctrl + B</span>
									</div>
									<div>
										<span class="name">格式化</span>
										<span class="shortcut">Ctrl + U</span>
									</div>
									<div>
										<span class="name">注释/取消注释</span>
										<span class="shortcut">Ctrl + /</span>
									</div>
									<div>
										<span class="name">撤消</span>
										<span class="shortcut">Ctrl + Z</span>
									</div>
									<div>
										<span class="name">重做</span>
										<span class="shortcut">Ctrl + Y</span>
									</div>
									<div>
										<span class="name">剪切行</span>
										<span class="shortcut">Ctrl + D</span>
									</div>
									<div>
										<span class="name">交换上一行</span>
										<span class="shortcut">Ctrl + Up</span>
									</div>
									<div>
										<span class="name">交换下一行</span>
										<span class="shortcut">Ctrl + Down</span>
									</div>
									<div>
										<span class="name">块缩进</span>
										<span class="shortcut">Ctrl + ]</span>
									</div>
									<div>
										<span class="name">减少块缩进</span>
										<span class="shortcut">Ctrl + [</span>
									</div>
								</div>
							</div>
							<div class="tab tab-help">
								<div class="tips">常见问题解答</div>
								<div class="faq">
									<div class="question">
										Q： 如何设置串口端口和波特率
									</div>
									<div class="answer">
										A： 在“工具->端口”和“工具->波特率”中设置
									</div>
								</div>
								<div class="faq">
									<div class="question">
										Q: 检测不到串口
									</div>
									<div class="answer">
										A: 驱动问题，参考<span class="link" href="#" data-action="faq-driver">这里</span>
									</div>
								</div>
							</div>
							<div class="tab tab-about">
								<div class="about-logo"></div>
								<div class="intro">啃萝卜是一款在线硬件编程学习平台，我们的目标是：让机器人编程变得更容易，让学习变得更简单。</div>
								<div class="copyright">版权所有2016 KenRobot Inc. 保留所有权利。</div>
							</div>
						</div>
					</div>
				</div>
				<div class="x-dialog x-dialog-info share-dialog">
					<div class="x-dialog-title">分享</div>
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content">
						<textarea class="share-content" name="share-content" rows="5" spellcheck="false"></textarea>
					</div>
					<div class="x-dialog-btns">
						<button class="x-dialog-btn copy-btn">复制</button>
					</div>
				</div>
				<div class="x-dialog x-dialog-custom interpreter-dialog">
					<div class="x-dialog-title"><div class="x-dialog-icon"></div><span class="name">啃萝卜</span></div>
					<i class="kenrobot ken-close x-dialog-close"></i>
					<div class="x-dialog-content">
						<div class="wrap">
							<div class="left">
								<div class="top">
									<input class="connect x-btn" data-action="connect" type="button" value="连接" />
									<input class="reset x-btn" data-action="reset" type="button" value="重置" />
									<input class="advance x-btn" data-action="advance" type="button" value="高级" />
								</div>
								<div class="bottom"></div>
							</div>
							<div class="right">
								<div class="top">
									<input class="prog x-btn" data-action="prog" type="button" value="写入" title="写入代码"/>
									<input class="run x-btn" data-action="run" type="button" value="运行" title="运行当前或者EEPROM中的代码" />
									<input class="save x-btn" data-action="save" type="button" value="保存" title="把代码保存到EEPROM"/>
									<input class="list x-btn" data-action="list" type="button" value="显示" title="显示EEPROM中的代码" />
									<label class="auto-run-label" for="auto-run" title="启动时自动运行EEPROM中的代码"><input class="auto-run" type="checkbox" id="auto-run" data-action="auto-run" />自动运行</label>
								</div>
								<div class="bottom">
									<textarea class="code" spellcheck="false" placeholder="请在此处输入代码"></textarea>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="message-layer"></div>
			<div class="modal guide-layer"></div>
			@if(!$has_visit)
			<div class="modal guide-cover">
				<div class="guide-step guide-step-1" data-target=".sidebar li[data-action='project']">
					<div class="part part-1"></div>
					<div class="part part-2"></div>
				</div>
				<div class="guide-step guide-step-2" data-target=".top-menu li[data-action='build']">
					<div class="part part-1"></div>
					<div class="part part-2"></div>
				</div>
				<div class="guide-step guide-step-3" data-target=".top-menu li[data-action='burn']">
					<div class="part part-1"></div>
					<div class="part part-2"></div>
				</div>
				<div class="guide-step guide-step-4" data-target=".top-menu li[data-action='download']">
					<div class="part part-1"></div>
					<div class="part part-2"></div>
				</div>
				<div class="guide-step guide-step-5" data-target=".user li[data-action='login']">
					<div class="part part-1"></div>
					<div class="part part-2"></div>
				</div>
				<div class="guide-skip"></div>
			</div>
			@endif
		</div>
	</body>
</html>
