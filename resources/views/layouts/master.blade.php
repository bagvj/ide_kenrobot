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

  <link href="{{ asset('/assets/images/favicon.ico') }}" type="image/x-icon" rel="shortcut icon" />
  <link rel="stylesheet" type="text/css" href="   {{ asset('/assets/css/base.css') }} " />
  <link rel="stylesheet" type="text/css" href="   {{ asset('/assets/css/scroll.css') }} " />
  @yield('css')
  @yield('scripts')
 </head>
 <body>
   @yield('main')
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
          <div class="remember">
          </div>
          <div>
              <input id="qrcode_key" type="hidden" value="{{$key or ''}}">
              <input class="submitBtn" type="button" value="登录"/>
          </div>
        </form>
      </div>
      <div class="closeBtn"></div>
    </div>
  </div>
  <div id="use_weixin">
    <img src="{{asset('/assets/images/use_weixin.png')}}" />
  </div>
 </body>
</html>
