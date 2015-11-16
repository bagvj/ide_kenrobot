<html>
    <head>
        <title></title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

       <!-- <script type="text/javascript" src="/assets/js/jquery-1.11.3.min.js"></script> -->

        <!-- 新 Bootstrap 核心 CSS 文件 -->
        <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">

        <!-- 可选的Bootstrap主题文件（一般不用引入） -->
        <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">

        <!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
        <script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>

        <!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
        <script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

        <script type="text/javascript" src="/assets/js/jquery.mobile-1.4.5.js"></script>
        <link rel="stylesheet" type="text/css" href="/assets/css/jquery.mobile-1.4.5.css">
        <script type="text/javascript">
        $(function(){
        	setInterval(function(){
				$.get('/weixinlogin?key={{$key}}',function(ret){
					if (ret == 1) {
						window.location.href = "{{url('/')}}";
					};
				});
			},3000);
        })
        </script>
    </head>
    <body>
        <div class="container">
		        <div class="row">
					<div class="span6">
					</div>
					<div class="span6">
						<div class="tabbable" id="tabs-348528">
							<ul class="nav nav-tabs">
								<li>
									<a href="#panel-485394" data-toggle="tab">微信登录</a>
								</li>
								<li class="active">
									<a href="#panel-625269" data-toggle="tab">账号密码登录</a>
								</li>
							</ul>
							<div class="tab-content">
								<div class="tab-pane" id="panel-485394">
									<p>
										<img alt="微信扫码" src="{{ $qrcodeurl or '' }}"  width="200px" class="img-polaroid" />
									</p>
								</div>
								<div class="tab-pane active" id="panel-625269">
									<form method="POST" action="/snspostlogin">
								    {!! csrf_field() !!}

								    <div>
								        账户
								        <input type="email" name="email" value="{{ old('email') }}">
								    </div>

								    <div>
								        密码
								        <input type="password" name="password" id="password">
								    </div>

								    <div>
								        <input type="checkbox" name="remember"> 记住我
								    </div>

								    <div>
								        <button type="submit">登录</button>
								    </div>
									</form>
								</div>
							</div>
						</div>
					</div>
			</div>
       </div>
    </body>
</html>
