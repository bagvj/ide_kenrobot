<!-- <script src=" {{ asset('assets/js/lib/jquery-1.11.2.min.js')}}" type="text/javascript"></script> -->
<script type="text/javascript">
	$(function(){
		$("#login-tabs").tabs();

		var time1 = setInterval(function(){
			$.get('/weixinlogin?key={{$key}}', function(ret){
				if (ret == 1) {
					clearInterval(time1);
					window.location.href = "{{url('/')}}";
				};
			});
		}, 1000);
	})
</script>
<div id="login-tabs">
	<ul>
		<li><a href="#login-tab-1">账号密码登录</a></li>
		<li><a href="#login-tab-2">微信登录</a></li>
	</ul>
	<div id="login-tab-1">
		<form method="POST" action="/snspostlogin" class="loginForm">
		    {!! csrf_field() !!}
		    <div class="field">
		    	<label>账户</label>
		    	<input type="email" name="email" value="{{ old('email') }}" />
		    </div>
		    <div class="field">
		        <label>密码</label>
		        <input type="password" name="password" id="password" />
		    </div>
		    <div class="remember">
		        <input type="checkbox" name="remember" /><label>记住我</label>
		    </div>
		    <div class="submit">
		        <input type="submit" value="登录"/>
		    </div>
		</form>
	</div>
	<div id="login-tab-2">
		<img alt="微信扫码" src="{{ $qrcodeurl or '' }}" style="width:200px;height:200px;" />
	</div>
</div>