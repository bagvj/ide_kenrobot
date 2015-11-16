<!DOCTYPE HTML>
<html>
<head>
  <meta charset='utf-8'>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="user-scalable=no">
  <title>啃萝卜智能硬件平台</title>
  <meta name="description" content="啃萝卜智能硬件平台" />
  <meta name="keywords" content="啃萝卜智能硬件平台" />
  <meta name="csrf-token" content="{{ csrf_token() }}" />

  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/base.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/scroll.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/jquery-ui.min.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/jquery.contextMenu.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('assets/css/index.css') }} " />
  <link href="{{ asset('assets/img/favicon.ico') }}" type="image/x-icon" rel="shortcut icon" />
  <script data-main="assets/js/main" src=" {{ asset('assets/js/lib/require.min.js')}}" type="text/javascript"></script>

 </head>
 <body>
   @yield('main')
  <div id="login_dialog" style="display:none">
   
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
            <input id="qrcode_key" type="hidden" value="{{$key or ''}}">
            <input type="submit" value="登录"/>
        </div>
    </form>
  </div>
  <div id="login-tab-2">
    <img alt="微信扫码" src="{{ $qrcodeurl or '' }}" style="width:200px;height:200px;" />
  </div>
</div>

  </div>
 </body>
</html>
