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
		<link href="/assets/css/index2.css" rel="stylesheet" />

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
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><i class="fa fa-reorder"></i>&nbsp;设置</button>
							<ul class="dropdown-menu">
								<li class="dropdown-submenu">
									<a href="#">主板</a>
									<ul class="board-list dropdown-menu">
									@foreach($boards as $board)
										<li data-action="selectBoard" data-board="{{$board->id}}"><a href="#"><img class="thumbnail" src="/assets/images/hardware/{{$board->thumbnail}}" /><span class="name">{{$board->name}}</span></a></li>
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
					<div class="left x-scrollbar">
						<div class="tab">
							<ul>
								<li class="tag-1"><a>输入模块</a></li>
								<li class="tag-2"><a>输出模块</a></li>
								<li class="tag-3"><a>执行模块</a></li>
								<li class="tag-4"><a>传感模块</a></li>
								<li class="tag-5"><a>通讯模块</a></li>
							</ul>
						</div>
						<div class="tab-panel">
							<div class="search">
								<input class="key" type="text" placeholder="搜索" spellcheck="false"/>
							</div>
							<div class="seperator"></div>
							<div class="items x-scrollbar">
<!-- 							@foreach($components as $module_id => $group)
								<ul class="list" data-module-id="{{$module_id}}">
								@foreach($group as $k => $value)
									<li class="item" data-component-id="{{$value->id}}"><img class="image" src="/assets/images/hardware/{{$value->image}}" /><span class="name">{{$value->name}}</span></li>
								@endforeach
								</ul>
							@endforeach -->
							</div>
						</div>
					</div>
					<div class="right">
						<div class="north port">
							<ul>
								<li>0</li>
								<li>1</li>
								<li>2</li>
								<li>3</li>
								<li>4</li>
								<li>5</li>
								<li>6</li>
								<li>7</li>
								<li>8</li>
								<li>9</li>
								<li>10</li>
								<li>11</li>
								<li>12</li>
								<li>13</li>
							</ul>
						</div>
						<div class="center">
							
						</div>
						<div class="south port">
							<ul>
								<li>14</li>
								<li>15</li>
								<li>16</li>
								<li>17</li>
								<li>18</li>
								<li>19</li>
								<li>20</li>
							</ul>
							<div class="copyright">
								备案号：京ICP备15039570号<br />Copyright © 2014 KenRobot.com All Rights Reserved
							</div>
						</div>
					</div>
				</div>
				<div class="mod software">
<!-- 					<div class="left x-scrollbar">
						<div class="tab">
							<ul>
								<li class="tag-1"><a>硬件模块</a></li>
								<li class="tag-2"><a>函数</a></li>
								<li class="tag-3"><a>变量</a></li>
								<li class="tag-4"><a>文本代码</a></li>
								<li class="tag-5"><a>控制</a></li>
								<li class="tag-6"><a>数字逻辑</a></li>
							</ul>
						</div>
						<div class="tab-panel">
							<div class="items x-scrollbar">
								<ul>
								</ul>
							</div>
						</div>
					</div> -->
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
							</div>
						</div>
					</div>
				</div>
				<div class="mod info">

				</div>
			</div>
			<div class="footer"></div>
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
